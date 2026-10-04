import "server-only";

// Pure helpers live in shared.ts so client components can use them too;
// re-exported here so existing server imports keep working.
import {
  displayStatus,
  isOverdue,
  type InvoiceRow,
} from "@/lib/admin/shared";

export {
  INVOICE_STATUSES,
  STATUS_LABEL,
  displayStatus,
  formatDate,
  formatMoney,
  isOverdue,
  type InvoiceRow,
} from "@/lib/admin/shared";
import { serviceClient } from "@/lib/db/server";
import type {
  Client,
  Invoice,
  InvoiceLine,
  InvoiceStatus,
  Project,
} from "@/lib/db/types";

export async function listInvoices(
  status?: InvoiceStatus | "all",
): Promise<InvoiceRow[]> {
  let query = serviceClient()
    .from("invoices")
    .select("*, client:clients(id, business_name), project:projects(id, title)")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  // "overdue" is derived, so it is filtered after loading rather than in SQL.
  if (status && status !== "all" && status !== "overdue") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) throw new Error(`Could not load invoices: ${error.message}`);

  const rows = (data ?? []) as InvoiceRow[];
  return status === "overdue" ? rows.filter(isOverdue) : rows;
}

export async function invoiceTotals() {
  const { data } = await serviceClient()
    .from("invoices")
    .select("status, total, due_on")
    .is("deleted_at", null);

  const rows = (data ?? []) as Pick<Invoice, "status" | "total" | "due_on">[];

  let outstanding = 0;
  let overdue = 0;
  let paid = 0;
  let all = 0;
  let overdueCount = 0;
  const byStatus: Record<string, number> = {};

  for (const r of rows) {
    all += 1;
    byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;

    const total = Number(r.total);
    if (r.status === "paid") paid += total;
    if (r.status === "issued") {
      outstanding += total;
      if (isOverdue(r)) {
        overdue += total;
        overdueCount += 1;
      }
    }
  }

  const counts: Record<string, number> = {
    ...byStatus,
    all,
    overdue: overdueCount,
  };

  return { outstanding, overdue, paid, counts };
}

export async function getInvoice(id: string) {
  const db = serviceClient();

  const [{ data: invoice }, { data: lines }] = await Promise.all([
    db
      .from("invoices")
      .select("*, client:clients(*), project:projects(id, title)")
      .eq("id", id)
      .is("deleted_at", null)
      .maybeSingle(),
    db.from("invoice_lines").select("*").eq("invoice_id", id).order("position"),
  ]);

  if (!invoice) return null;

  const { client, project, ...rest } = invoice as Invoice & {
    client: Client | null;
    project: Pick<Project, "id" | "title"> | null;
  };

  return {
    invoice: rest as Invoice,
    client,
    project,
    lines: (lines ?? []) as InvoiceLine[],
  };
}

/** Clients and their projects, for the invoice create form. */
export async function invoiceTargets() {
  const db = serviceClient();

  const [{ data: clients }, { data: projects }] = await Promise.all([
    db
      .from("clients")
      .select("id, business_name, contact_name")
      .is("deleted_at", null)
      .order("business_name"),
    db
      .from("projects")
      .select("id, title, client_id, agreed_price")
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
  ]);

  return {
    clients: (clients ?? []) as Pick<
      Client,
      "id" | "business_name" | "contact_name"
    >[],
    projects: (projects ?? []) as Pick<
      Project,
      "id" | "title" | "client_id" | "agreed_price"
    >[],
  };
}

