import "server-only";
export { BRIEF_FIELDS } from "@/lib/portal/brief-fields";
import { serviceClient } from "@/lib/db/server";
import type {
  Client,
  Invoice,
  InvoiceLine,
  Message,
  Project,
  ProjectBrief,
} from "@/lib/db/types";

/**
 * Portal reads.
 *
 * Every query is scoped to the client id resolved from their own session, so
 * a client can only see their own records. RLS enforces the same rule at the
 * database level, so this is defence in depth rather than the only barrier.
 */

export async function clientProjects(clientId: string): Promise<Project[]> {
  const { data } = await serviceClient()
    .from("projects")
    .select("*")
    .eq("client_id", clientId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  return (data ?? []) as Project[];
}

export async function clientInvoices(
  clientId: string,
): Promise<(Invoice & { lines: InvoiceLine[] })[]> {
  const db = serviceClient();

  const { data: invoices } = await db
    .from("invoices")
    .select("*")
    .eq("client_id", clientId)
    .is("deleted_at", null)
    // Drafts are working documents and must never be visible to the client.
    .neq("status", "draft")
    .order("created_at", { ascending: false });

  const rows = (invoices ?? []) as Invoice[];
  if (rows.length === 0) return [];

  const { data: lines } = await db
    .from("invoice_lines")
    .select("*")
    .in(
      "invoice_id",
      rows.map((i) => i.id),
    )
    .order("position");

  const byInvoice = new Map<string, InvoiceLine[]>();
  for (const l of (lines ?? []) as InvoiceLine[]) {
    const list = byInvoice.get(l.invoice_id) ?? [];
    list.push(l);
    byInvoice.set(l.invoice_id, list);
  }

  return rows.map((i) => ({ ...i, lines: byInvoice.get(i.id) ?? [] }));
}

export async function projectBrief(
  projectId: string,
): Promise<ProjectBrief | null> {
  const { data } = await serviceClient()
    .from("project_brief")
    .select("*")
    .eq("project_id", projectId)
    .maybeSingle();

  return (data as ProjectBrief) ?? null;
}

export async function projectMessages(projectId: string): Promise<Message[]> {
  const { data } = await serviceClient()
    .from("messages")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at");

  return (data ?? []) as Message[];
}

/** Confirms a project belongs to this client before anything is shown or
 *  written. Called by every project-scoped portal action. */
export async function assertOwnsProject(
  client: Client,
  projectId: string,
): Promise<Project | null> {
  const { data } = await serviceClient()
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .eq("client_id", client.id)
    .is("deleted_at", null)
    .maybeSingle();

  return (data as Project) ?? null;
}
