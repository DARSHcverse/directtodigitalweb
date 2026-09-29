import "server-only";
import { serviceClient } from "@/lib/db/server";
import type { Lead, LeadStatus } from "@/lib/db/types";

export const LEAD_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "quoted",
  "won",
  "lost",
];

export const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  won: "Won",
  lost: "Lost",
};

export async function listLeads(status?: LeadStatus | "all") {
  let query = serviceClient()
    .from("leads")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(200);

  if (status && status !== "all") query = query.eq("status", status);

  const { data, error } = await query;
  if (error) throw new Error(`Could not load leads: ${error.message}`);
  return (data ?? []) as Lead[];
}

export async function countByStatus(): Promise<Record<string, number>> {
  const { data, error } = await serviceClient()
    .from("leads")
    .select("status")
    .is("deleted_at", null);

  if (error) return {};

  const counts: Record<string, number> = { all: 0 };
  for (const row of (data ?? []) as { status: LeadStatus }[]) {
    counts.all = (counts.all ?? 0) + 1;
    counts[row.status] = (counts[row.status] ?? 0) + 1;
  }
  return counts;
}
