import "server-only";
import { serviceClient } from "@/lib/db/server";
import type { Client, Project, Lead } from "@/lib/db/types";

export type ClientWithCounts = Client & {
  project_count: number;
  active_project: string | null;
};

export async function listClients(): Promise<ClientWithCounts[]> {
  const db = serviceClient();

  const { data: clients, error } = await db
    .from("clients")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Could not load clients: ${error.message}`);

  const rows = (clients ?? []) as Client[];
  if (rows.length === 0) return [];

  // One query for every client's projects rather than one per client.
  const { data: projects } = await db
    .from("projects")
    .select("client_id, title, stage")
    .is("deleted_at", null)
    .in(
      "client_id",
      rows.map((c) => c.id),
    );

  const byClient = new Map<string, { title: string; stage: string }[]>();
  for (const p of (projects ?? []) as Pick<
    Project,
    "client_id" | "title" | "stage"
  >[]) {
    const list = byClient.get(p.client_id) ?? [];
    list.push({ title: p.title, stage: p.stage });
    byClient.set(p.client_id, list);
  }

  return rows.map((c) => {
    const list = byClient.get(c.id) ?? [];
    const live = list.find(
      (p) => p.stage !== "live" && p.stage !== "cancelled",
    );
    return {
      ...c,
      project_count: list.length,
      active_project: live?.title ?? null,
    };
  });
}

export async function getClient(id: string) {
  const db = serviceClient();

  const [{ data: client }, { data: projects }, { data: leads }] =
    await Promise.all([
      db.from("clients").select("*").eq("id", id).is("deleted_at", null).maybeSingle(),
      db
        .from("projects")
        .select("*")
        .eq("client_id", id)
        .is("deleted_at", null)
        .order("created_at", { ascending: false }),
      db
        .from("leads")
        .select("*")
        .eq("client_id", id)
        .is("deleted_at", null)
        .order("created_at", { ascending: false }),
    ]);

  if (!client) return null;

  return {
    client: client as Client,
    projects: (projects ?? []) as Project[],
    leads: (leads ?? []) as Lead[],
  };
}

/** Leads not yet converted, offered when creating a client. */
export async function unconvertedLeads(): Promise<Lead[]> {
  const { data } = await serviceClient()
    .from("leads")
    .select("*")
    .is("deleted_at", null)
    .is("client_id", null)
    .order("created_at", { ascending: false })
    .limit(50);

  return (data ?? []) as Lead[];
}
