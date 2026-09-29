"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { portalClientForAction } from "@/lib/portal/auth";
import { assertOwnsProject, BRIEF_FIELDS } from "@/lib/portal/data";
import { serviceClient } from "@/lib/db/server";

export type BriefState = { error: string | null; success: string | null };
export type MessageState = { error: string | null };

export async function saveBrief(
  _prev: BriefState,
  formData: FormData,
): Promise<BriefState> {
  const client = await portalClientForAction();
  if (!client) {
    return { error: "Your session has expired. Sign in again.", success: null };
  }

  const projectId = String(formData.get("project_id") ?? "");
  const project = await assertOwnsProject(client, projectId);
  if (!project) return { error: "Project not found.", success: null };

  // The lock is re-checked server-side: hiding the form in the UI is a
  // convenience, not a control.
  if (project.brief_locked_at) {
    return {
      error: "This brief is now locked. Send a message with any changes.",
      success: null,
    };
  }

  const row: Record<string, string | null> = { project_id: projectId };
  for (const f of BRIEF_FIELDS) {
    const value = String(formData.get(f.name) ?? "").trim().slice(0, 5000);
    row[f.name] = value || null;
  }

  const { error } = await serviceClient()
    .from("project_brief")
    .upsert(row, { onConflict: "project_id" });

  if (error) return { error: "Could not save that. Try again.", success: null };

  revalidatePath(`/portal/projects/${projectId}`);
  return { error: null, success: "Saved. You can keep adding to this." };
}

const messageSchema = z.string().trim().min(1, "Write a message first").max(5000);

export async function sendMessage(
  _prev: MessageState,
  formData: FormData,
): Promise<MessageState> {
  const client = await portalClientForAction();
  if (!client) return { error: "Your session has expired. Sign in again." };

  const projectId = String(formData.get("project_id") ?? "");
  const project = await assertOwnsProject(client, projectId);
  if (!project) return { error: "Project not found." };

  const parsed = messageSchema.safeParse(formData.get("body") ?? "");
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Write a message." };
  }

  const { error } = await serviceClient().from("messages").insert({
    project_id: projectId,
    // Always 'client' here, never taken from the form — otherwise a message
    // could be posted as though it came from the owner.
    author: "client",
    body: parsed.data,
  });

  if (error) return { error: "Could not send that. Try again." };

  revalidatePath(`/portal/projects/${projectId}`);
  return { error: null };
}
