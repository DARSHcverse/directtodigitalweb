import "server-only";
import { randomUUID } from "node:crypto";
import { serviceClient } from "@/lib/db/server";
import type { MessageAuthor } from "@/lib/db/types";

export { MAX_BYTES, formatSize } from "@/lib/attachments-shared";
import { MAX_BYTES } from "@/lib/attachments-shared";

export const BUCKET = "attachments";

export type Attachment = {
  id: string;
  created_at: string;
  project_id: string;
  message_id: string | null;
  storage_path: string;
  file_name: string;
  byte_size: number;
  uploaded_by: MessageAuthor;
  deleted_at: string | null;
};

/**
 * Validates an upload before it reaches storage.
 *
 * The browser's reported MIME type is attacker-controlled, so the file's
 * leading bytes are checked too: every PDF starts with %PDF. A renamed .exe
 * passes the extension and type checks but fails this one.
 */
export async function validatePdf(
  file: File,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (file.size === 0) {
    return { ok: false, error: "That file is empty." };
  }
  if (file.size > MAX_BYTES) {
    return {
      ok: false,
      error: `That file is ${(file.size / 1024 / 1024).toFixed(1)}MB. The limit is 10MB.`,
    };
  }
  if (!file.name.toLowerCase().endsWith(".pdf")) {
    return { ok: false, error: "Only PDF files can be attached." };
  }

  const header = new Uint8Array(await file.slice(0, 5).arrayBuffer());
  const magic = String.fromCharCode(...header.slice(0, 4));
  if (magic !== "%PDF") {
    return {
      ok: false,
      error: "That does not look like a PDF. Only PDFs can be attached.",
    };
  }

  return { ok: true };
}

/**
 * Stores a validated file and records it.
 *
 * The path is generated, never derived from the uploaded name: a filename
 * containing ../ or a null byte must not be able to steer where the file
 * lands. The original name is kept in a column for display only.
 */
export async function storeAttachment({
  file,
  projectId,
  messageId,
  uploadedBy,
}: {
  file: File;
  projectId: string;
  messageId: string | null;
  uploadedBy: MessageAuthor;
}): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const db = serviceClient();
  const path = `${projectId}/${randomUUID()}.pdf`;

  const { error: uploadError } = await db.storage
    .from(BUCKET)
    .upload(path, file, { contentType: "application/pdf", upsert: false });

  if (uploadError) {
    console.error("[attachments] upload failed:", uploadError.message);
    return { ok: false, error: "Could not save that file. Please try again." };
  }

  const { data, error } = await db
    .from("attachments")
    .insert({
      project_id: projectId,
      message_id: messageId,
      storage_path: path,
      // Trimmed and stripped of path separators so the display name cannot
      // be used to mislead about where the file came from.
      file_name: file.name.replace(/[/\\]/g, "_").slice(0, 200),
      byte_size: file.size,
      uploaded_by: uploadedBy,
    })
    .select("id")
    .single();

  if (error) {
    // Do not leave an orphan in storage that nothing references.
    await db.storage.from(BUCKET).remove([path]);
    console.error("[attachments] record failed:", error.message);
    return { ok: false, error: "Could not save that file. Please try again." };
  }

  return { ok: true, id: data.id as string };
}

/**
 * A short-lived URL for one file.
 *
 * The caller must already have established that this project belongs to the
 * requester — this function does not check, so it must never be reached from
 * an unguarded route.
 */
export async function signedUrl(
  storagePath: string,
  seconds = 120,
): Promise<string | null> {
  const { data, error } = await serviceClient()
    .storage.from(BUCKET)
    .createSignedUrl(storagePath, seconds);

  if (error) {
    console.error("[attachments] signing failed:", error.message);
    return null;
  }
  return data.signedUrl;
}

export async function projectAttachments(
  projectId: string,
): Promise<Attachment[]> {
  const { data } = await serviceClient()
    .from("attachments")
    .select("*")
    .eq("project_id", projectId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  return (data ?? []) as Attachment[];
}
