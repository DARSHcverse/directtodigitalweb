import "server-only";

// Pure values live in shared.ts so client components can use them too.
import { OPEN_STAGES, type ProjectWithClient } from "@/lib/admin/shared";

export {
  OPEN_STAGES,
  STAGES,
  STAGE_LABEL,
  type ProjectWithClient,
} from "@/lib/admin/shared";
import { serviceClient } from "@/lib/db/server";
import type { Attachment } from "@/lib/attachments";
import type {
  Client,
  Message,
  Project,
  ProjectBrief,
  ProjectStage,
} from "@/lib/db/types";

/** Stages that still need work. Drives the "active" counts. */
export async function listProjects(
  stage?: ProjectStage | "all" | "open",
): Promise<ProjectWithClient[]> {
  let query = serviceClient()
    .from("projects")
    .select(
      "*, client:clients(id, business_name, contact_name, email)",
    )
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (stage && stage !== "all") {
    if (stage === "open") query = query.in("stage", OPEN_STAGES);
    else query = query.eq("stage", stage);
  }

  const { data, error } = await query;
  if (error) throw new Error(`Could not load projects: ${error.message}`);
  return (data ?? []) as ProjectWithClient[];
}

export async function countByStage(): Promise<Record<string, number>> {
  const { data } = await serviceClient()
    .from("projects")
    .select("stage")
    .is("deleted_at", null);

  let all = 0;
  let open = 0;
  const byStage: Record<string, number> = {};

  for (const row of (data ?? []) as { stage: ProjectStage }[]) {
    all += 1;
    if (OPEN_STAGES.includes(row.stage)) open += 1;
    byStage[row.stage] = (byStage[row.stage] ?? 0) + 1;
  }

  return { ...byStage, all, open };
}

export async function getProject(id: string) {
  const db = serviceClient();

  const { data } = await db
    .from("projects")
    .select("*, client:clients(*)")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (!data) return null;

  const { client, ...project } = data as Project & { client: Client | null };
  return { project: project as Project, client };
}

/**
 * Everything the project detail page shows, in one round trip set.
 *
 * The brief and messages were previously never read by the admin at all —
 * clients could fill in their brief and send messages that nobody could see.
 */
export async function getProjectDetail(id: string) {
  const db = serviceClient();

  const [project, brief, messages, clients, attachments] = await Promise.all([
    db
      .from("projects")
      .select("*, client:clients(*)")
      .eq("id", id)
      .is("deleted_at", null)
      .maybeSingle(),
    db.from("project_brief").select("*").eq("project_id", id).maybeSingle(),
    db
      .from("messages")
      .select("*")
      .eq("project_id", id)
      .order("created_at"),
    db
      .from("clients")
      .select("id, business_name, contact_name")
      .is("deleted_at", null)
      .order("business_name"),
    db
      .from("attachments")
      .select("*")
      .eq("project_id", id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
  ]);

  if (!project.data) return null;

  const { client, ...rest } = project.data as Project & {
    client: Client | null;
  };

  return {
    project: rest as Project,
    client,
    brief: (brief.data as ProjectBrief) ?? null,
    messages: (messages.data ?? []) as Message[],
    clients: (clients.data ?? []) as Pick<
      Client,
      "id" | "business_name" | "contact_name"
    >[],
    attachments: (attachments.data ?? []) as Attachment[],
  };
}

/** Clients available when creating a project. */
export async function clientOptions() {
  const { data } = await serviceClient()
    .from("clients")
    .select("id, business_name, contact_name")
    .is("deleted_at", null)
    .order("business_name");

  return (data ?? []) as Pick<
    Client,
    "id" | "business_name" | "contact_name"
  >[];
}
