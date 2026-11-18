"use server";

import { requireOwner } from "@/lib/admin/auth";
import { adminPath } from "@/lib/admin/paths";
import { serviceClient } from "@/lib/db/server";

export type SearchResult = {
  group: "Leads" | "Clients" | "Projects" | "Invoices";
  title: string;
  detail: string;
  href: string;
};

/** Everything that could break out of a PostgREST or() filter or a pattern. */
const clean = (q: string) => q.replace(/[,()%*_\\:"']/g, " ").replace(/\s+/g, " ").trim().slice(0, 60);

/** One search box across the whole admin. */
export async function searchAdmin(query: string): Promise<SearchResult[]> {
  // A server action is a public endpoint; the page guard does not cover it.
  await requireOwner();

  const q = clean(query);
  if (q.length < 2) return [];
  const like = `%${q}%`;
  const db = serviceClient();

  const [leads, clients, projects, invoices] = await Promise.all([
    db
      .from("leads")
      .select("id, name, email, topic")
      .is("deleted_at", null)
      .or(`name.ilike.${like},email.ilike.${like},phone.ilike.${like},town.ilike.${like},trade.ilike.${like}`)
      .order("created_at", { ascending: false })
      .limit(5),
    db
      .from("clients")
      .select("id, business_name, contact_name")
      .is("deleted_at", null)
      .or(`business_name.ilike.${like},contact_name.ilike.${like},email.ilike.${like},phone.ilike.${like}`)
      .limit(5),
    db
      .from("projects")
      .select("id, title, tier")
      .is("deleted_at", null)
      .ilike("title", like)
      .limit(5),
    db
      .from("invoices")
      .select("id, invoice_number, status")
      .is("deleted_at", null)
      .ilike("invoice_number", like)
      .limit(5),
  ]);

  return [
    ...(leads.data ?? []).map((l) => ({
      group: "Leads" as const,
      title: l.name as string,
      detail: (l.topic as string | null) ?? (l.email as string),
      href: adminPath(`leads/${l.id}`),
    })),
    ...(clients.data ?? []).map((c) => ({
      group: "Clients" as const,
      title: c.business_name as string,
      detail: c.contact_name as string,
      href: adminPath(`clients/${c.id}`),
    })),
    ...(projects.data ?? []).map((p) => ({
      group: "Projects" as const,
      title: p.title as string,
      detail: (p.tier as string | null) ?? "Project",
      href: adminPath(`projects/${p.id}`),
    })),
    ...(invoices.data ?? []).map((i) => ({
      group: "Invoices" as const,
      title: i.invoice_number as string,
      detail: i.status as string,
      href: adminPath(`invoices/${i.id}`),
    })),
  ];
}
