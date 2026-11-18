import "server-only";
import { cache } from "react";
import { serviceClient } from "@/lib/db/server";
import { isOverdue, segmentOf } from "@/lib/admin/shared";
import type { NavKey } from "@/lib/admin/nav";
import type { Invoice, Lead } from "@/lib/db/types";

export type NavCounts = Partial<Record<NavKey, number>>;

/**
 * The numbers on the navigation: only things waiting on Shan. They stream in
 * after the page, so a slow count never holds up the screen, and a failed one
 * simply shows no badge.
 */
export const getNavCounts = cache(async (): Promise<NavCounts> => {
  try {
    const db = serviceClient();
    const [leads, messages, invoices] = await Promise.all([
      db.from("leads").select("topic, trade").is("deleted_at", null).eq("status", "new"),
      db
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("author", "client")
        .is("read_at", null),
      db
        .from("invoices")
        .select("status, due_on")
        .is("deleted_at", null)
        .in("status", ["issued", "overdue"]),
    ]);

    const newLeads = (leads.data ?? []) as Pick<Lead, "topic" | "trade">[];
    const dueRows = (invoices.data ?? []) as Pick<Invoice, "status" | "due_on">[];
    return {
      leads: newLeads.length,
      apps: newLeads.filter((l) => segmentOf(l) === "apps").length,
      projects: messages.count ?? 0,
      invoices: dueRows.filter(isOverdue).length,
    };
  } catch (err) {
    console.error("[admin] navigation counts failed:", err);
    return {};
  }
});
