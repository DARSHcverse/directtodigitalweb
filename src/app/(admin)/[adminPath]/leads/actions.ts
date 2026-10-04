"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ownerForAction, requireOwner } from "@/lib/admin/auth";
import { serviceClient } from "@/lib/db/server";
import { adminPath } from "@/lib/admin/paths";
import type { LeadStatus } from "@/lib/db/types";

const VALID: LeadStatus[] = ["new", "contacted", "quoted", "won", "lost"];

export type LeadFormState = { error: string | null };

const leadSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.email("Enter a valid email address").max(200),
  phone: z.string().trim().max(40).optional(),
  topic: z.string().trim().max(80).optional(),
  budget: z.string().trim().max(80).optional(),
  timeline: z.string().trim().max(80).optional(),
  message: z.string().trim().max(5000).optional(),
});

/**
 * Adds a lead by hand.
 *
 * Enquiries that arrive by phone or in person were previously impossible to
 * record — the only way into the pipeline was the website form.
 */
export async function createLead(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const owner = await ownerForAction();
  if (!owner) return { error: "Your session has expired. Sign in again." };

  const parsed = leadSchema.safeParse({
    name: formData.get("name") ?? "",
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
    topic: formData.get("topic") ?? "",
    budget: formData.get("budget") ?? "",
    timeline: formData.get("timeline") ?? "",
    message: formData.get("message") ?? "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the details." };
  }

  const d = parsed.data;
  const db = serviceClient();
  const { data, error } = await db
    .from("leads")
    .insert({
      kind: "contact",
      name: d.name,
      email: d.email,
      phone: d.phone || null,
      topic: d.topic || null,
      budget: d.budget || null,
      timeline: d.timeline || null,
      message: d.message || null,
      source_path: "added by hand",
      status: "new",
    })
    .select("id")
    .single();

  if (error) return { error: "Could not save that lead. Try again." };

  await db.from("audit_log").insert({
    actor: owner.email,
    action: "lead.created",
    entity: "leads",
    entity_id: data.id as string,
  });

  redirect(adminPath("leads"));
}

/**
 * Hides a lead. Spam and mistakes need somewhere to go, but business records
 * are kept for six years, so this is a soft delete like everywhere else.
 */
export async function archiveLead(formData: FormData) {
  const owner = await requireOwner();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const db = serviceClient();
  await db
    .from("leads")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  await db.from("audit_log").insert({
    actor: owner.email,
    action: "lead.archived",
    entity: "leads",
    entity_id: id,
  });

  revalidatePath(adminPath("leads"));
}

export async function updateLeadStatus(formData: FormData) {
  // Every mutation re-checks the session: a server action is a public
  // endpoint, and the page guard does not protect it.
  const owner = await requireOwner();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as LeadStatus;

  if (!id || !VALID.includes(status)) return;

  const db = serviceClient();
  await db.from("leads").update({ status }).eq("id", id);
  await db.from("audit_log").insert({
    actor: owner.email,
    action: "lead.status",
    entity: "leads",
    entity_id: id,
    detail: { status },
  });

  revalidatePath(adminPath("leads"));
}

export async function updateLeadNotes(formData: FormData) {
  const owner = await requireOwner();

  const id = String(formData.get("id") ?? "");
  const notes = String(formData.get("notes") ?? "").slice(0, 5000);
  if (!id) return;

  const db = serviceClient();
  await db.from("leads").update({ notes }).eq("id", id);
  await db.from("audit_log").insert({
    actor: owner.email,
    action: "lead.notes",
    entity: "leads",
    entity_id: id,
  });

  revalidatePath(adminPath("leads"));
}

/**
 * Permanently deletes a lead.
 *
 * Archiving is the right default for real enquiries — business records are
 * expected to survive — but it leaves test rows in the table forever, and
 * there was no way to clear them.
 *
 * A lead is safe to delete outright: nothing depends on it. The one reference
 * is projects.lead_id, which is `on delete set null`, so a project that came
 * from this lead keeps working and simply forgets where it came from.
 *
 * The audit entry is written before the row goes, and records the name and
 * email, because after this there is nothing left to look up.
 */
export async function deleteLead(formData: FormData) {
  const owner = await requireOwner();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const db = serviceClient();

  const { data: lead } = await db
    .from("leads")
    .select("name, email")
    .eq("id", id)
    .maybeSingle();

  await db.from("audit_log").insert({
    actor: owner.email,
    action: "lead.deleted",
    entity: "leads",
    entity_id: id,
    detail: lead ?? null,
  });

  const { error } = await db.from("leads").delete().eq("id", id);
  if (error) throw new Error(`Could not delete lead: ${error.message}`);

  revalidatePath(adminPath("leads"));
}
