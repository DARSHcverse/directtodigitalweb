import "server-only";
import { serviceClient } from "@/lib/db/server";
import { isOverdue } from "@/lib/admin/invoices";
import { segmentOf, SEGMENTS, type LeadSegment } from "@/lib/admin/shared";
import { OPEN_STAGES } from "@/lib/admin/projects";
import type { Invoice, Lead, Message, Project } from "@/lib/db/types";

export type Dashboard = {
  newLeads: Lead[];
  activeProjects: (Project & { client_name: string | null })[];
  unreadMessages: (Message & { project_title: string | null })[];
  waitingOnClient: (Project & { client_name: string | null })[];
  outstanding: number;
  overdue: number;
  overdueInvoices: {
    id: string;
    invoice_number: string | null;
    total: number;
    due_on: string | null;
    client_name: string | null;
  }[];
  /** Enquiries in the last 90 days, by part of the business. */
  segments: Record<LeadSegment, number>;
  newThisWeek: number;
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

  const since = new Date(Date.now() - 90 * 86_400_000).toISOString();

  const [leads, projects, messages, invoices, clientCount, recentLeads] = await Promise.all([
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
      .select("id, invoice_number, status, total, due_on, client:clients(business_name)")
      .is("deleted_at", null)
      .in("status", ["issued", "overdue"]),
    db
      .from("clients")
      .select("id", { count: "exact", head: true })
      .is("deleted_at", null),
    db
      .from("leads")
      .select("topic, trade, created_at")
      .is("deleted_at", null)
      .gte("created_at", since),
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
  const overdueInvoices: Dashboard["overdueInvoices"] = [];
  for (const inv of (invoices.data ?? []) as unknown as (Pick<
    Invoice,
    "id" | "invoice_number" | "status" | "total" | "due_on"
  > & { client: { business_name: string } | null })[]) {
    const total = Number(inv.total);
    outstanding += total;
    if (isOverdue(inv)) {
      overdue += total;
      overdueInvoices.push({
        id: inv.id,
        invoice_number: inv.invoice_number,
        total,
        due_on: inv.due_on,
        client_name: inv.client?.business_name ?? null,
      });
    }
  }

  const recent = (recentLeads.data ?? []) as Pick<Lead, "topic" | "trade" | "created_at">[];
  const weekAgo = Date.now() - 7 * 86_400_000;
  const segments = Object.fromEntries(SEGMENTS.map((s) => [s, 0])) as Record<LeadSegment, number>;
  for (const lead of recent) segments[segmentOf(lead)] += 1;

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
    overdueInvoices,
    segments,
    newThisWeek: recent.filter((l) => new Date(l.created_at).getTime() >= weekAgo).length,
    counts: {
      leads: leadCount ?? 0,
      clients: clientCount.count ?? 0,
      projects: withClient.length,
    },
  };
}
