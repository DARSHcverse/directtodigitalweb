import Link from "next/link";
import { requireOwner } from "@/lib/admin/auth";
import { adminPath } from "@/lib/admin/paths";
import {
  listProjects,
  countByStage,
  STAGES,
  STAGE_LABEL,
} from "@/lib/admin/projects";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProjectsTable } from "@/components/admin/ProjectsTable";
import { cn } from "@/lib/cn";
import type { ProjectStage } from "@/lib/db/types";

const STAGE_STYLE: Record<ProjectStage, string> = {
  brief: "bg-amber text-on-amber",
  design: "bg-navy-soft text-white",
  build: "bg-navy text-white",
  review: "bg-navy-soft text-white",
  live: "bg-success text-white",
  on_hold: "bg-edge text-muted",
  cancelled: "bg-edge text-muted",
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string }>;
}) {
  const owner = await requireOwner();
  const { stage } = await searchParams;

  const filter = (
    stage === "all" || stage === "open" || STAGES.includes(stage as ProjectStage)
      ? stage
      : "open"
  ) as ProjectStage | "all" | "open";

  const [projects, counts] = await Promise.all([
    listProjects(filter),
    countByStage(),
  ]);

  const tabs: Array<{ key: string; label: string }> = [
    { key: "open", label: "Active" },
    { key: "all", label: "All" },
    ...STAGES.map((s) => ({ key: s, label: STAGE_LABEL[s] })),
  ];

  return (
    <AdminShell email={owner.email} current="projects">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-display text-navy-text">
              Projects
            </h1>
            <p className="text-muted">
              {counts.open ?? 0} active · {counts.all ?? 0} total
            </p>
          </div>
          <Link
            href={adminPath("projects/new")}
            className="bg-navy rounded-md px-5 py-3 text-sm font-bold text-white no-underline transition hover:bg-navy-deep"
          >
            New project
          </Link>
        </div>

        <nav aria-label="Filter by stage" className="mb-6 flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const active = filter === tab.key;
            const n = counts[tab.key] ?? 0;
            return (
              <Link
                key={tab.key}
                href={`${adminPath("projects")}?stage=${tab.key}`}
                className={cn(
                  "border-2 px-4 py-2 text-sm font-semibold no-underline transition",
                  active
                    ? "border-navy bg-navy text-white"
                    : "border-edge text-muted hover:border-navy hover:text-navy-text",
                )}
              >
                {tab.label}
                <span className={cn("ml-2", active ? "text-white/70" : "text-muted")}>
                  {n}
                </span>
              </Link>
            );
          })}
        </nav>

        <ProjectsTable projects={projects} />

      </AdminShell>
  );
}
