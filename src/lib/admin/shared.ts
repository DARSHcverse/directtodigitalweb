/**
 * Admin helpers that are safe on the client.
 *
 * The data modules (clients.ts, projects.ts, invoices.ts) are `server-only`,
 * because they hold the service-role Supabase client. Labels, formatters and
 * row types have no server dependency, but importing one from a server-only
 * module drags the whole module — and the secret key with it — toward the
 * client bundle, which the build correctly refuses.
 *
 * Those pure pieces live here so both sides can use them. The data modules
 * re-export them, so existing server imports keep working unchanged.
 */

import type {
  Client,
  Invoice,
  InvoiceStatus,
  Lead,
  Project,
  ProjectStage,
} from "@/lib/db/types";

/* ---------- leads ---------- */

/** Which part of the business a lead belongs to, from its form answers. */
export type LeadSegment = "automotive" | "trades" | "apps" | "other";

export const SEGMENT_LABEL: Record<LeadSegment, string> = {
  automotive: "Garages",
  trades: "Trades",
  apps: "Apps",
  other: "Other",
};

export const SEGMENTS = Object.keys(SEGMENT_LABEL) as LeadSegment[];

const AUTOMOTIVE_TRADES = new Set([
  "Garage / MOT centre",
  "Car detailing / valeting",
  "Mobile mechanic",
  "Car dealer",
]);
const TRADE_TRADES = new Set([
  "Plumber / heating",
  "Electrician",
  "Builder",
  "Roofer",
  "Other trade",
]);

export function segmentOf(lead: Pick<Lead, "topic" | "trade">): LeadSegment {
  if (lead.topic === "Web app" || lead.topic === "Mobile app") return "apps";
  if (lead.trade && AUTOMOTIVE_TRADES.has(lead.trade)) return "automotive";
  if (lead.trade && TRADE_TRADES.has(lead.trade)) return "trades";
  if (lead.trade === "Just an idea for now") return "apps";
  return "other";
}

/* ---------- projects ---------- */

export const STAGES: ProjectStage[] = [
  "brief",
  "design",
  "build",
  "review",
  "live",
  "on_hold",
  "cancelled",
];

/** Stages that count as work in progress. */
export const OPEN_STAGES: ProjectStage[] = ["brief", "design", "build", "review"];

export const STAGE_LABEL: Record<ProjectStage, string> = {
  brief: "Brief",
  design: "Design",
  build: "Build",
  review: "Review",
  live: "Live",
  on_hold: "On hold",
  cancelled: "Cancelled",
};

/** App work is recognised by its package, e.g. "Web app" or "Mobile app". */
export function isAppProject(project: Pick<Project, "tier">): boolean {
  return /\bapp\b/i.test(project.tier ?? "");
}

export type ProjectWithClient = Project & {
  client: Pick<Client, "id" | "business_name" | "contact_name" | "email"> | null;
};

/* ---------- clients ---------- */

export type ClientWithCounts = Client & {
  project_count: number;
  active_project: string | null;
};

/* ---------- invoices ---------- */

export const INVOICE_STATUSES: InvoiceStatus[] = [
  "draft",
  "issued",
  "paid",
  "overdue",
  "cancelled",
];

export const STATUS_LABEL: Record<InvoiceStatus, string> = {
  draft: "Draft",
  issued: "Issued",
  paid: "Paid",
  overdue: "Overdue",
  cancelled: "Cancelled",
};

export type InvoiceRow = Invoice & {
  client: Pick<Client, "id" | "business_name"> | null;
  project: Pick<Project, "id" | "title"> | null;
};

/** An issued invoice past its due date is overdue. */
export function isOverdue(inv: Pick<Invoice, "status" | "due_on">): boolean {
  if (inv.status !== "issued" || !inv.due_on) return false;
  return new Date(inv.due_on) < new Date(new Date().toDateString());
}

export function displayStatus(inv: Invoice): InvoiceStatus {
  return isOverdue(inv) ? "overdue" : inv.status;
}

export function formatMoney(amount: number | string): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(Number(amount));
}

export function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
