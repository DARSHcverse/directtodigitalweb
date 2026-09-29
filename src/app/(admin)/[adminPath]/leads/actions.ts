"use server";

import { revalidatePath } from "next/cache";
import { requireOwner } from "@/lib/admin/auth";
import { serviceClient } from "@/lib/db/server";
import { adminPath } from "@/lib/admin/paths";
import type { LeadStatus } from "@/lib/db/types";

const VALID: LeadStatus[] = ["new", "contacted", "quoted", "won", "lost"];

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
