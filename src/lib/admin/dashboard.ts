import "server-only";
import { serviceClient } from "@/lib/db/server";
import { isOverdue } from "@/lib/admin/invoices";
import { OPEN_STAGES } from "@/lib/admin/projects";
import type { Invoice, Lead, Message, Project } from "@/lib/db/types";

export type Dashboard = {
  newLeads: Lead[];
  activeProjects: (Project & { client_name: string | null })[];
  unreadMessages: (Message & { project_title: string | null })[];
  waitingOnClient: (Project & { client_name: string | null })[];
  outstanding: number;
  overdue: number;
  counts: { leads: number; clients: number; projects: number };
};

/**
 * Everything the dashboard needs, in one parallel batch.
 *
 * Ordered around what actually needs doing — new enquiries, unanswered
 * messages, money owed — rather than listing every table. Signing in should
 * answer "what needs me today", which a raw list of leads did not.
 */
export async function getDashboard(): Promise<Dashboard> {
  const db = serviceClient();

  const [leads, projects, messages, invoices, clientCount] = await Promise.all([
    db
      .from("leads")
      .select("*")
      .is("deleted_at", null)
      .eq("status", "new")
      .order("created_at", { ascending: false })
      .limit(5),
    db
      .from("projects")
      .select("*, client:clients(business_name)")
      .is("deleted_at", null)
      .in("stage", OPEN_STAGES)
      .order("updated_at", { ascending: false }),
    db
      .from("messages")
      .select("*, project:projects(title)")
      .eq("author", "client")
      .is("read_at", null)
      .order("created_at", { ascending: false })
      .limit(5),
    db
      .from("invoices")
      .select("status, total, due_on")
      .is("deleted_at", null)
      .in("status", ["issued", "overdue"]),
    db
      .from("clients")
      .select("id", { count: "exact", head: true })
      .is("deleted_at", null),
  ]);

  const projectRows = (projects.data ?? []) as (Project & {
    client: { business_name: string } | null;
  })[];

  const withClient = projectRows.map((p) => ({
    ...p,
    client_name: p.client?.business_name ?? null,
  }));

  let outstanding = 0;
  let overdue = 0;
  for (const inv of (invoices.data ?? []) as Pick<
    Invoice,
    "status" | "total" | "due_on"
  >[]) {
    const total = Number(inv.total);
    outstanding += total;
    if (isOverdue(inv)) overdue += total;
  }

  const { count: leadCount } = await db
    .from("leads")
    .select("id", { count: "exact", head: true })
    .is("deleted_at", null);

  return {
    newLeads: (leads.data ?? []) as Lead[],
    activeProjects: withClient,
    unreadMessages: ((messages.data ?? []) as (Message & {
      project: { title: string } | null;
    })[]).map((m) => ({ ...m, project_title: m.project?.title ?? null })),
    waitingOnClient: withClient.filter((p) => p.awaiting_client),
    outstanding,
    overdue,
    counts: {
      leads: leadCount ?? 0,
      clients: clientCount.count ?? 0,
      projects: withClient.length,
    },
  };
}
