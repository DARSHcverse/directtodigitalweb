"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireOwner, ownerForAction } from "@/lib/admin/auth";
import { serviceClient } from "@/lib/db/server";
import { adminPath } from "@/lib/admin/paths";

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
