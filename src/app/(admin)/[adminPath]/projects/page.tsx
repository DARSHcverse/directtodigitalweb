import Link from "next/link";
import { requireOwner } from "@/lib/admin/auth";
import { adminPath } from "@/lib/admin/paths";
import {
  listProjects,
  countByStage,
  STAGES,
  STAGE_LABEL,
} from "@/lib/admin/projects";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { cn } from "@/lib/cn";
import type { ProjectStage } from "@/lib/db/types";

const STAGE_STYLE: Record<ProjectStage, string> = {
  brief: "bg-amber text-navy-deep",
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
    <div className="min-h-screen">
      <AdminHeader email={owner.email} current="projects" />

      <main className="mx-auto w-[94%] max-w-[1100px] py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-display text-navy">
              Projects
            </h1>
            <p className="text-muted">
              {counts.open ?? 0} active · {counts.all ?? 0} total
            </p>
          </div>
          <Link
            href={adminPath("projects/new")}
            className="bg-navy px-5 py-3 text-sm font-bold text-white no-underline transition hover:bg-navy-deep"
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
                    : "border-edge text-muted hover:border-navy hover:text-navy",
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

        {projects.length === 0 ? (
          <div className="border-2 border-edge bg-surface p-10 text-center">
            <p className="text-lg font-bold text-navy">No projects here</p>
            <p className="mt-2 text-muted">
              Create one against a client to start tracking a build.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {projects.map((p) => (
              <Link
                key={p.id}
                href={adminPath(`projects/${p.id}`)}
                className="flex flex-wrap items-start justify-between gap-4 border-2 border-edge bg-surface p-5 no-underline transition hover:border-navy"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-bold text-navy">{p.title}</h2>
                    <span
                      className={cn(
                        "px-2 py-0.5 text-xs font-bold tracking-wide uppercase",
                        STAGE_STYLE[p.stage],
                      )}
                    >
                      {STAGE_LABEL[p.stage]}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {p.client?.business_name ?? "Unknown client"}
                    {p.tier ? ` · ${p.tier}` : ""}
                  </p>
                  {p.awaiting_client ? (
                    <p className="mt-2 border-l-4 border-amber pl-3 text-sm text-muted">
                      Waiting on client: {p.awaiting_client}
                    </p>
                  ) : null}
                </div>

                <div className="text-right text-sm">
                  {p.agreed_price != null ? (
                    <p className="font-bold text-navy">
                      £{Number(p.agreed_price).toLocaleString("en-GB")}
                    </p>
                  ) : null}
                  {p.target_date ? (
                    <p className="text-muted">
                      Target{" "}
                      {new Date(p.target_date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
