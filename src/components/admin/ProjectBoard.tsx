import Link from "next/link";
import { setStage } from "@/app/(admin)/[adminPath]/projects/actions";
import { QuickSelect } from "@/components/admin/QuickSelect";
import { formatDate } from "@/components/admin/ui";
import { adminPath } from "@/lib/admin/paths";
import { OPEN_STAGES, STAGES, STAGE_LABEL } from "@/lib/admin/shared";
import type { Project, ProjectStage } from "@/lib/db/types";

export type BoardProject = Pick<
  Project,
  "id" | "title" | "stage" | "tier" | "target_date" | "awaiting_client"
> & { client_name: string | null };

const PROGRESS: Partial<Record<ProjectStage, string>> = {
  brief: "w-[15%]",
  design: "w-[40%]",
  build: "w-[65%]",
  review: "w-[90%]",
};

const stageOptions = STAGES.map((s) => ({ value: s, label: STAGE_LABEL[s] }));

/** Active work by stage. On a phone the stages swipe sideways. */
export function ProjectBoard({ projects }: { projects: BoardProject[] }) {
  return (
    <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:grid-cols-2 md:px-0 xl:grid-cols-4">
      {OPEN_STAGES.map((stage) => {
        const items = projects.filter((p) => p.stage === stage);
        return (
          <section
            key={stage}
            aria-label={STAGE_LABEL[stage]}
            className="w-[82vw] max-w-80 shrink-0 snap-center rounded-xl bg-edge/60 p-2.5 md:w-auto md:max-w-none"
          >
            <h3 className="mb-2 flex justify-between px-1 font-bold text-navy-text">
              {STAGE_LABEL[stage]} <span className="tabular-nums">{items.length}</span>
            </h3>
            <div className="grid gap-2">
              {items.length === 0 ? (
                <p className="px-1 py-3 text-sm text-muted">Nothing here.</p>
              ) : null}
              {items.map((p) => (
                <article key={p.id} className="rounded-lg bg-surface p-3">
                  <Link
                    href={adminPath(`projects/${p.id}`)}
                    className="block font-bold text-navy-text no-underline hover:text-amber-deep"
                  >
                    {p.title}
                  </Link>
                  <p className="mt-0.5 text-sm text-muted">
                    {[p.client_name, p.tier].filter(Boolean).join(" · ") || "No client"}
                  </p>
                  {p.target_date ? (
                    <p className="text-sm text-muted">Due {formatDate(p.target_date)}</p>
                  ) : null}
                  {p.awaiting_client ? (
                    <p className="mt-1 text-sm font-semibold text-navy-text">
                      Waiting: {p.awaiting_client}
                    </p>
                  ) : null}
                  <div className="my-2.5 h-1.5 overflow-hidden rounded-full bg-edge">
                    <div className={`h-full rounded-full bg-amber ${PROGRESS[p.stage] ?? ""}`} />
                  </div>
                  <QuickSelect
                    action={setStage}
                    id={p.id}
                    name="stage"
                    label={`Stage for ${p.title}`}
                    value={p.stage}
                    options={stageOptions}
                  />
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
