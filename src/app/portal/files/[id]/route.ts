import { NextResponse } from "next/server";
import { getPortalClient } from "@/lib/portal/auth";
import { getOwner } from "@/lib/admin/auth";
import { serviceClient } from "@/lib/db/server";
import { signedUrl } from "@/lib/attachments";

/**
 * Hands out a file, after checking the requester is entitled to it.
 *
 * The signed URL is generated per request and lasts two minutes, so a URL
 * copied out of someone's history is useless almost immediately. The
 * ownership check happens here rather than in the storage layer because
 * storage knows about paths, not about who a client is.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const db = serviceClient();

  const { data: file } = await db
    .from("attachments")
    .select("storage_path, project_id, file_name")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (!file) return new NextResponse("Not found", { status: 404 });

  // The owner may read anything; a client only files on their own project.
  const owner = await getOwner();

  if (!owner) {
    const client = await getPortalClient();
    if (!client) return new NextResponse("Not found", { status: 404 });

    const { data: project } = await db
      .from("projects")
      .select("id")
      .eq("id", file.project_id as string)
      .eq("client_id", client.id)
      .is("deleted_at", null)
      .maybeSingle();

    // 404 rather than 403: confirming a file exists would tell someone
    // probing ids that they had found a real one.
    if (!project) return new NextResponse("Not found", { status: 404 });
  }

  const url = await signedUrl(file.storage_path as string);
  if (!url) return new NextResponse("Unavailable", { status: 502 });

  return NextResponse.redirect(url);
}
