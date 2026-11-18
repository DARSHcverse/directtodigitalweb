import { AdminShell } from "@/components/admin/AdminShell";
import { ProjectBoard } from "@/components/admin/ProjectBoard";
import { ProjectsTable } from "@/components/admin/ProjectsTable";
import { EmptyState, FilterTabs, PageHeader } from "@/components/admin/ui";
import { requireOwner } from "@/lib/admin/auth";
import { adminPath } from "@/lib/admin/paths";
import { countByStage, listProjects, STAGES, STAGE_LABEL } from "@/lib/admin/projects";
import { isAppProject } from "@/lib/admin/shared";
import type { ProjectStage } from "@/lib/db/types";

const WORK_TABS = [
  { key: "all", label: "All" },
  { key: "websites", label: "Websites" },
  { key: "apps", label: "Apps" },
];

/** A board of what is in progress, with the full list one tap away. */
export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string; type?: string; view?: string }>;
}) {
  const owner = await requireOwner();
  const { stage, type, view } = await searchParams;
  const listView = view === "list" || stage !== undefined;

  const filter = (
    stage === "all" || stage === "open" || STAGES.includes(stage as ProjectStage)
      ? stage
      : listView
        ? "all"
        : "open"
  ) as ProjectStage | "all" | "open";

  const [projects, counts] = await Promise.all([listProjects(filter), countByStage()]);

  const tabs = [
    { key: "open", label: "Active" },
    { key: "all", label: "All" },
    ...STAGES.map((s) => ({ key: s, label: STAGE_LABEL[s] })),
  ];

  const workType = type === "apps" || type === "websites" ? type : "all";
  const board = projects
    .filter((p) => workType === "all" || isAppProject(p) === (workType === "apps"))
    .map((p) => ({ ...p, client_name: p.client?.business_name ?? null }));

  return (
    <AdminShell email={owner.email} current="projects">
      <PageHeader
        title="Work"
        subtitle={`${counts.open ?? 0} active · ${counts.all ?? 0} total`}
        action={{ href: adminPath("projects/new"), label: "New project" }}
      />

      {listView ? (
        <>
          <FilterTabs
            label="Filter by stage"
            basePath={adminPath("projects")}
            param="stage"
            current={filter}
            tabs={tabs}
            counts={counts}
          />
          <p className="mb-3">
            <a href={adminPath("projects")} className="text-sm font-bold text-navy-text no-underline">
              ← Back to board
            </a>
          </p>
          <ProjectsTable projects={projects} />
        </>
      ) : (
        <>
          <div className="flex flex-wrap items-start justify-between gap-x-3">
            <FilterTabs
              label="Filter by type"
              basePath={adminPath("projects")}
              param="type"
              current={workType}
              tabs={WORK_TABS}
            />
            <a
              href={`${adminPath("projects")}?view=list`}
              className="mb-4 inline-flex min-h-11 items-center text-sm font-bold text-navy-text no-underline"
            >
              See full list →
            </a>
          </div>
          {board.length === 0 ? (
            <EmptyState
              title="Nothing in progress"
              body="Start a project and it appears on this board."
              action={{ href: adminPath("projects/new"), label: "New project" }}
            />
          ) : (
            <ProjectBoard projects={board} />
          )}
        </>
      )}
    </AdminShell>
  );
}
