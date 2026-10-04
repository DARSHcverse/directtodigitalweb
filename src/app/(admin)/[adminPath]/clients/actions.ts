"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireOwner, ownerForAction } from "@/lib/admin/auth";
import { serviceClient } from "@/lib/db/server";
import { adminPath } from "@/lib/admin/paths";
import { BUCKET } from "@/lib/attachments";

const clientSchema = z.object({
  business_name: z.string().trim().min(1, "Business name is required").max(200),
  contact_name: z.string().trim().min(1, "Contact name is required").max(120),
  email: z.email("Enter a valid email address").max(200),
  phone: z.string().trim().max(40).optional(),
  trade: z.string().trim().max(80).optional(),
  address: z.string().trim().max(500).optional(),
  notes: z.string().trim().max(5000).optional(),
});

export type ClientFormState = { error: string | null };

function parse(formData: FormData) {
  return clientSchema.safeParse({
    business_name: formData.get("business_name") ?? "",
    contact_name: formData.get("contact_name") ?? "",
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
    trade: formData.get("trade") ?? "",
    address: formData.get("address") ?? "",
    notes: formData.get("notes") ?? "",
  });
}

/** Address is entered as one textarea and stored as lines. */
function toLines(address?: string): string[] {
  return (address ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 6);
}

export async function createClient(
  _prev: ClientFormState,
  formData: FormData,
): Promise<ClientFormState> {
  const owner = await ownerForAction();
  if (!owner) return { error: "Your session has expired. Sign in again." };

  const parsed = parse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the details." };
  }

  const { address, ...fields } = parsed.data;
  const leadId = String(formData.get("lead_id") ?? "") || null;

  const db = serviceClient();
  const { data, error } = await db
    .from("clients")
    .insert({
      ...fields,
      phone: fields.phone || null,
      trade: fields.trade || null,
      notes: fields.notes || null,
      address_lines: toLines(address),
    })
    .select("id")
    .single();

  if (error) {
    // A duplicate email is the common case and worth naming precisely.
    if (error.code === "23505") {
      return { error: "A client with that email already exists." };
    }
    return { error: "Could not save that client. Try again." };
  }

  const clientId = data.id as string;

  // Converting a lead links it and marks it won, so the pipeline stays honest.
  if (leadId) {
    await db
      .from("leads")
      .update({ client_id: clientId, status: "won" })
      .eq("id", leadId);
  }

  await db.from("audit_log").insert({
    actor: owner.email,
    action: leadId ? "client.created_from_lead" : "client.created",
    entity: "clients",
    entity_id: clientId,
    detail: leadId ? { lead_id: leadId } : null,
  });

  redirect(adminPath(`clients/${clientId}`));
}

export async function updateClient(
  _prev: ClientFormState,
  formData: FormData,
): Promise<ClientFormState> {
  const owner = await requireOwner();

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing client." };

  const parsed = parse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the details." };
  }

  const { address, ...fields } = parsed.data;

  const db = serviceClient();
  const { error } = await db
    .from("clients")
    .update({
      ...fields,
      phone: fields.phone || null,
      trade: fields.trade || null,
      notes: fields.notes || null,
      address_lines: toLines(address),
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { error: "Another client already uses that email." };
    }
    return { error: "Could not save those changes." };
  }

  await db.from("audit_log").insert({
    actor: owner.email,
    action: "client.updated",
    entity: "clients",
    entity_id: id,
  });

  revalidatePath(adminPath(`clients/${id}`));
  return { error: null };
}

export async function archiveClient(formData: FormData) {
  const owner = await requireOwner();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const db = serviceClient();
  // Soft delete only: business records must survive for six years.
  //
  // Portal access is released at the same time. auth_user_id is unique, so
  // leaving it on an archived row blocks the same person from ever being
  // given access again under a new client record — and an archived client
  // should not keep a working login regardless.
  await db
    .from("clients")
    .update({
      deleted_at: new Date().toISOString(),
      portal_enabled: false,
      auth_user_id: null,
    })
    .eq("id", id);

  await db.from("audit_log").insert({
    actor: owner.email,
    action: "client.archived",
    entity: "clients",
    entity_id: id,
  });

  redirect(adminPath("clients"));
}

/**
 * Permanently deletes a client and everything belonging to them.
 *
 * Archiving keeps business records for the six years HMRC expects, which is
 * right for real clients but leaves test data in place forever.
 *
 * projects.client_id and invoices.client_id are both `on delete restrict`, so
 * the database refuses to remove a client while either exists. That guard is
 * deliberate and stays; this walks the tree in dependency order instead, so
 * the delete is explicit about what it destroys rather than relying on
 * cascades nobody can see from the UI.
 *
 * Attachments are removed from the storage bucket first. Deleting only the
 * rows would orphan the files, which keeps consuming the storage quota this
 * is meant to free.
 */
export async function deleteClient(formData: FormData) {
  const owner = await requireOwner();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const db = serviceClient();

  const { data: client } = await db
    .from("clients")
    .select("business_name, contact_name, email")
    .eq("id", id)
    .maybeSingle();

  const { data: projects } = await db
    .from("projects")
    .select("id")
    .eq("client_id", id);

  const projectIds = (projects ?? []).map((p) => p.id);

  // Storage first: once the rows go, the paths are unrecoverable.
  if (projectIds.length > 0) {
    const { data: files } = await db
      .from("attachments")
      .select("storage_path")
      .in("project_id", projectIds);

    const paths = (files ?? []).map((f) => f.storage_path);
    if (paths.length > 0) {
      await db.storage.from(BUCKET).remove(paths);
    }
  }

  // Invoice lines are `on delete cascade` from invoices, and messages,
  // briefs and attachments cascade from projects — so those go with their
  // parent. Invoices and projects are restricted, so they are removed here.
  //
  // invoices.credit_note_for is a self-reference with no delete rule. Nothing
  // sets it yet, but a credit note belonging to another client would block
  // this delete, so the link is cleared first rather than failing later.
  await db
    .from("invoices")
    .update({ credit_note_for: null })
    .eq("client_id", id);

  const { error: invoiceError } = await db
    .from("invoices")
    .delete()
    .eq("client_id", id);
  if (invoiceError) {
    throw new Error(`Could not delete invoices: ${invoiceError.message}`);
  }

  if (projectIds.length > 0) {
    const { error: projectError } = await db
      .from("projects")
      .delete()
      .in("id", projectIds);
    if (projectError) {
      throw new Error(`Could not delete projects: ${projectError.message}`);
    }
  }

  await db.from("audit_log").insert({
    actor: owner.email,
    action: "client.deleted",
    entity: "clients",
    entity_id: id,
    detail: {
      ...(client ?? {}),
      projects_deleted: projectIds.length,
    },
  });

  const { error } = await db.from("clients").delete().eq("id", id);
  if (error) throw new Error(`Could not delete client: ${error.message}`);

  redirect(adminPath("clients"));
}
