"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ownerForAction, requireOwner } from "@/lib/admin/auth";
import { serviceClient } from "@/lib/db/server";
import { adminPath } from "@/lib/admin/paths";
import { STAGES } from "@/lib/admin/projects";
import type { ProjectStage } from "@/lib/db/types";

const projectSchema = z.object({
  client_id: z.uuid("Choose a client"),
  title: z.string().trim().min(1, "Give the project a title").max(200),
  tier: z.string().trim().max(60).optional(),
  // Empty string means "not agreed yet", which is different from zero.
  agreed_price: z
    .string()
    .trim()
    .optional()
    .refine(
      (v) => !v || (!Number.isNaN(Number(v)) && Number(v) >= 0),
      "Price must be a number",
    ),
  target_date: z.string().trim().optional(),
  status_note: z.string().trim().max(2000).optional(),
  awaiting_client: z.string().trim().max(500).optional(),
  live_url: z.string().trim().max(300).optional(),
});

export type ProjectFormState = { error: null | string };

function parse(formData: FormData) {
  return projectSchema.safeParse({
    client_id: formData.get("client_id") ?? "",
    title: formData.get("title") ?? "",
    tier: formData.get("tier") ?? "",
    agreed_price: formData.get("agreed_price") ?? "",
    target_date: formData.get("target_date") ?? "",
    status_note: formData.get("status_note") ?? "",
    awaiting_client: formData.get("awaiting_client") ?? "",
    live_url: formData.get("live_url") ?? "",
  });
}

function toRow(d: z.infer<typeof projectSchema>) {
  return {
    client_id: d.client_id,
    title: d.title,
    tier: d.tier || null,
    agreed_price: d.agreed_price ? Number(d.agreed_price) : null,
    target_date: d.target_date || null,
    status_note: d.status_note || null,
    awaiting_client: d.awaiting_client || null,
    live_url: d.live_url || null,
  };
}

export async function createProject(
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const owner = await ownerForAction();
  if (!owner) return { error: "Your session has expired. Sign in again." };

  const parsed = parse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the details." };
  }

  const db = serviceClient();
  const { data, error } = await db
    .from("projects")
    .insert({ ...toRow(parsed.data), started_on: new Date().toISOString().slice(0, 10) })
    .select("id")
    .single();

  if (error) return { error: "Could not create that project. Try again." };

  await db.from("audit_log").insert({
    actor: owner.email,
    action: "project.created",
    entity: "projects",
    entity_id: data.id as string,
  });

  redirect(adminPath(`projects/${data.id}`));
}

export async function updateProject(
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const owner = await ownerForAction();
  if (!owner) return { error: "Your session has expired. Sign in again." };

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing project." };

  const parsed = parse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the details." };
  }

  const db = serviceClient();
  const { error } = await db.from("projects").update(toRow(parsed.data)).eq("id", id);
  if (error) return { error: "Could not save those changes." };

  await db.from("audit_log").insert({
    actor: owner.email,
    action: "project.updated",
    entity: "projects",
    entity_id: id,
  });

  revalidatePath(adminPath(`projects/${id}`));
  return { error: null };
}

/** Plain form action — stage buttons post directly, no useActionState. */
export async function setStage(formData: FormData) {
  const owner = await requireOwner();

  const id = String(formData.get("id") ?? "");
  const stage = String(formData.get("stage") ?? "") as ProjectStage;
  if (!id || !STAGES.includes(stage)) return;

  const db = serviceClient();
  await db.from("projects").update({ stage }).eq("id", id);
  await db.from("audit_log").insert({
    actor: owner.email,
    action: "project.stage",
    entity: "projects",
    entity_id: id,
    detail: { stage },
  });

  revalidatePath(adminPath(`projects/${id}`));
  revalidatePath(adminPath("projects"));
}

/** Locks the brief so the client can no longer edit it mid-build. */
export async function toggleBriefLock(formData: FormData) {
  const owner = await requireOwner();
  const id = String(formData.get("id") ?? "");
  const lock = String(formData.get("lock") ?? "") === "1";
  if (!id) return;

  const db = serviceClient();
  await db
    .from("projects")
    .update({ brief_locked_at: lock ? new Date().toISOString() : null })
    .eq("id", id);

  await db.from("audit_log").insert({
    actor: owner.email,
    action: lock ? "project.brief_locked" : "project.brief_unlocked",
    entity: "projects",
    entity_id: id,
  });

  revalidatePath(adminPath(`projects/${id}`));
}

/**
 * Reply to a client in the project thread.
 *
 * author is forced to 'owner' here rather than read from the form, so a
 * client cannot post a message that appears to come from Shan.
 */
export async function replyToClient(formData: FormData) {
  const owner = await requireOwner();

  const projectId = String(formData.get("project_id") ?? "");
  const body = String(formData.get("body") ?? "").trim().slice(0, 5000);
  if (!projectId || !body) return;

  const db = serviceClient();
  await db.from("messages").insert({
    project_id: projectId,
    author: "owner",
    body,
  });

  await db.from("audit_log").insert({
    actor: owner.email,
    action: "project.replied",
    entity: "projects",
    entity_id: projectId,
  });

  revalidatePath(adminPath(`projects/${projectId}`));
}

export async function archiveProject(formData: FormData) {
  const owner = await requireOwner();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const db = serviceClient();
  await db
    .from("projects")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  await db.from("audit_log").insert({
    actor: owner.email,
    action: "project.archived",
    entity: "projects",
    entity_id: id,
  });

  redirect(adminPath("projects"));
}
