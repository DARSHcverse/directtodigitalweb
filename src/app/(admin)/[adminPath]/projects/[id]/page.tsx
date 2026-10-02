import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOwner } from "@/lib/admin/auth";
import { adminPath } from "@/lib/admin/paths";
import {
  getProjectDetail,
  STAGES,
  STAGE_LABEL,
} from "@/lib/admin/projects";
import {
  setStage,
  archiveProject,
  toggleBriefLock,
} from "@/app/(admin)/[adminPath]/projects/actions";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { AdminThread } from "@/components/admin/AdminThread";
import { BriefView } from "@/components/admin/BriefView";
import { cn } from "@/lib/cn";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const owner = await requireOwner();
  const { id } = await params;

  // One call, all queries in parallel. The brief and messages were not read
  // at all before, so client submissions had nowhere to appear.
  const result = await getProjectDetail(id);
  if (!result) notFound();

  const { project, client, brief, messages, clients, attachments } = result;
  const locked = Boolean(project.brief_locked_at);

  return (
    <div className="min-h-screen">
      <AdminHeader email={owner.email} current="projects" />

      <main className="mx-auto w-[94%] max-w-[1100px] py-8">
        <Link
          href={adminPath("projects")}
          className="text-sm font-semibold text-muted no-underline hover:text-navy"
        >
          ← Projects
        </Link>

        <div className="mt-3 mb-8">
          <h1 className="text-3xl font-bold tracking-display text-navy">
            {project.title}
          </h1>
          {client ? (
            <Link
              href={adminPath(`clients/${client.id}`)}
              className="text-muted no-underline hover:text-navy"
            >
              {client.business_name} · {client.contact_name}
            </Link>
          ) : null}
        </div>

        <section className="mb-6 border-2 border-edge bg-surface p-6">
          <h2 className="mb-4 text-sm font-bold tracking-[0.2em] text-muted uppercase">
            Stage
          </h2>
          <div className="flex flex-wrap gap-2">
            {STAGES.map((s) => (
              <form key={s} action={setStage}>
                <input type="hidden" name="id" value={project.id} />
                <input type="hidden" name="stage" value={s} />
                <button
                  type="submit"
                  disabled={s === project.stage}
                  className={cn(
                    "border-2 px-4 py-2 text-sm font-semibold transition",
                    s === project.stage
                      ? "border-navy bg-navy text-white"
                      : "border-edge text-muted hover:border-navy hover:text-navy",
                  )}
                >
                  {STAGE_LABEL[s]}
                </button>
              </form>
            ))}
          </div>
        </section>

        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          <BriefView brief={brief} />
          <AdminThread
            projectId={project.id}
            messages={messages}
            attachments={attachments}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <section className="border-2 border-edge bg-surface p-6">
            <h2 className="mb-6 text-xl font-bold text-navy">Details</h2>
            <ProjectForm project={project} clients={clients} />
          </section>

          <div className="grid gap-6">
            <section className="border-2 border-edge bg-surface p-6">
              <h2 className="mb-2 text-lg font-bold text-navy">Client brief</h2>
              <p className="mb-4 text-sm leading-relaxed text-muted">
                {locked
                  ? "Locked. The client can read their brief but no longer change it."
                  : "Open. The client can still add and revise details."}
              </p>
              <form action={toggleBriefLock}>
                <input type="hidden" name="id" value={project.id} />
                <input type="hidden" name="lock" value={locked ? "0" : "1"} />
                <button
                  type="submit"
                  className="border-2 border-navy px-4 py-2 text-sm font-bold text-navy transition hover:bg-navy hover:text-white"
                >
                  {locked ? "Unlock brief" : "Lock brief"}
                </button>
              </form>
            </section>

            {project.live_url ? (
              <section className="border-l-4 border-success bg-surface p-6">
                <h2 className="mb-2 text-lg font-bold text-navy">Live site</h2>
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-sm font-semibold text-navy hover:text-amber-deep"
                >
                  {project.live_url} ↗
                </a>
              </section>
            ) : null}

            <section className="border-l-4 border-danger bg-surface p-6">
              <h2 className="mb-2 text-lg font-bold text-navy">Archive</h2>
              <p className="mb-4 text-sm leading-relaxed text-muted">
                Hides this project. Nothing is deleted — records are kept for
                six years.
              </p>
              <form action={archiveProject}>
                <input type="hidden" name="id" value={project.id} />
                <button
                  type="submit"
                  className="border-2 border-danger px-4 py-2 text-sm font-bold text-danger transition hover:bg-danger hover:text-white"
                >
                  Archive project
                </button>
              </form>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
