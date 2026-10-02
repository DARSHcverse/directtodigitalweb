import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePortalClient } from "@/lib/portal/auth";
import {
  assertOwnsProject,
  projectBrief,
  projectMessages,
} from "@/lib/portal/data";
import { STAGES, STAGE_LABEL, OPEN_STAGES } from "@/lib/admin/projects";
import { PortalHeader } from "@/components/portal/PortalHeader";
import { BriefForm } from "@/components/portal/BriefForm";
import { MessageThread } from "@/components/portal/MessageThread";
import { projectAttachments } from "@/lib/attachments";
import { site } from "@/lib/site";
import type { ProjectStage } from "@/lib/db/types";
import { cn } from "@/lib/cn";

/** Reads the session cookie, so it can never be static. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your project",
  robots: { index: false, follow: false },
};

/** Stages shown to the client. On-hold and cancelled are omitted: they are
 *  states, not steps, and belong in the status note instead. */
const VISIBLE_STAGES: ProjectStage[] = STAGES.filter(
  (s) => s !== "on_hold" && s !== "cancelled",
);

export default async function PortalProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const client = await requirePortalClient();
  const { id } = await params;

  const project = await assertOwnsProject(client, id);
  if (!project) notFound();

  const [brief, messages, attachments] = await Promise.all([
    projectBrief(id),
    projectMessages(id),
    projectAttachments(id),
  ]);

  const locked = Boolean(project.brief_locked_at);
  const currentIndex = VISIBLE_STAGES.indexOf(project.stage);

  return (
    <div className="min-h-screen">
      <PortalHeader businessName={client.business_name} />

      <main className="mx-auto w-[94%] max-w-[1000px] py-8">
        <Link
          href="/portal"
          className="text-sm font-semibold text-muted no-underline hover:text-navy"
        >
          ← Your projects
        </Link>

        <h1 className="mt-3 mb-6 text-3xl font-bold tracking-display text-navy">
          {project.title}
        </h1>

        <section
          aria-labelledby="progress"
          className="mb-8 border-2 border-navy bg-surface p-6"
        >
          <h2
            id="progress"
            className="mb-4 text-xs font-bold tracking-[0.2em] text-muted uppercase"
          >
            Progress
          </h2>

          <ol className="grid gap-px bg-edge sm:grid-cols-5">
            {VISIBLE_STAGES.map((s, i) => {
              const done = currentIndex >= 0 && i < currentIndex;
              const now = s === project.stage;
              return (
                <li
                  key={s}
                  className={cn(
                    "p-3 text-center text-sm font-semibold",
                    now
                      ? "bg-navy text-white"
                      : done
                        ? "bg-surface text-navy"
                        : "bg-surface text-muted",
                  )}
                >
                  {done ? "✓ " : ""}
                  {STAGE_LABEL[s]}
                </li>
              );
            })}
          </ol>

          {!OPEN_STAGES.includes(project.stage) && project.stage !== "live" ? (
            <p className="mt-4 border-l-4 border-amber bg-bg px-4 py-2 text-sm text-muted">
              This project is currently {STAGE_LABEL[project.stage].toLowerCase()}.
            </p>
          ) : null}

          {project.status_note ? (
            <p className="mt-4 leading-relaxed text-ink">
              {project.status_note}
            </p>
          ) : null}

          {project.awaiting_client ? (
            <p className="mt-4 border-l-4 border-amber bg-bg px-4 py-3">
              <span className="font-bold text-navy">Waiting on you: </span>
              <span className="text-muted">{project.awaiting_client}</span>
            </p>
          ) : null}

          {project.live_url ? (
            <p className="mt-4">
              <a
                href={project.live_url}
                target="_blank"
                rel="noreferrer noopener"
                className="font-bold text-navy hover:text-amber-deep"
              >
                View your live site ↗
              </a>
            </p>
          ) : null}
        </section>

        <section
          aria-labelledby="brief"
          className="mb-8 border-2 border-edge bg-surface p-6"
        >
          <h2 id="brief" className="mb-1 text-xl font-bold text-navy">
            About your business
          </h2>
          <p className="mb-6 text-sm leading-relaxed text-muted">
            {locked
              ? "Your brief is locked now the build is under way. Send a message below with any changes."
              : "The more you fill in, the less back-and-forth later. Nothing here is compulsory, and you can save as you go."}
          </p>

          {locked ? (
            <dl className="grid gap-4">
              {brief
                ? Object.entries(brief)
                    .filter(
                      ([k, v]) =>
                        v && k !== "project_id" && k !== "updated_at",
                    )
                    .map(([k, v]) => (
                      <div key={k} className="border-l-4 border-edge pl-4">
                        <dt className="text-sm font-semibold text-navy">
                          {k.replace(/_/g, " ")}
                        </dt>
                        <dd className="mt-1 whitespace-pre-wrap text-muted">
                          {String(v)}
                        </dd>
                      </div>
                    ))
                : null}
            </dl>
          ) : (
            <BriefForm projectId={id} brief={brief} />
          )}
        </section>

        <section
          aria-labelledby="messages"
          className="border-2 border-edge bg-surface p-6"
        >
          <h2 id="messages" className="mb-1 text-xl font-bold text-navy">
            Messages
          </h2>
          <p className="mb-6 text-sm text-muted">
            Anything you send here is kept with the project, so nothing gets
            lost in an inbox.
          </p>
          <MessageThread
            projectId={id}
            messages={messages}
            attachments={attachments}
            ownerName={site.founder.split(" ")[0] ?? "Darshan"}
          />
        </section>
      </main>
    </div>
  );
}
