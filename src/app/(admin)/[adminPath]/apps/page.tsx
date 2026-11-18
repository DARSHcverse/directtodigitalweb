import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProjectBoard } from "@/components/admin/ProjectBoard";
import { actionClass, EmptyState, PageHeader, Pill, StatTile, relativeDate } from "@/components/admin/ui";
import { requireOwner } from "@/lib/admin/auth";
import { listLeads } from "@/lib/admin/leads";
import { adminPath } from "@/lib/admin/paths";
import { listProjects } from "@/lib/admin/projects";
import { isAppProject, OPEN_STAGES, segmentOf } from "@/lib/admin/shared";

export const dynamic = "force-dynamic";

/** App enquiries and app builds together, whatever stage they are at. */
export default async function AppsPage() {
  const owner = await requireOwner();
  const [leads, projects] = await Promise.all([listLeads("all"), listProjects("all")]);

  const enquiries = leads.filter(
    (l) => segmentOf(l) === "apps" && ["new", "contacted", "quoted"].includes(l.status),
  );
  const builds = projects
    .filter(isAppProject)
    .map((p) => ({ ...p, client_name: p.client?.business_name ?? null }));
  const active = builds.filter((p) => OPEN_STAGES.includes(p.stage));
  const live = builds.filter((p) => p.stage === "live");

  return (
    <AdminShell email={owner.email} current="apps">
      <PageHeader
        title="Apps"
        subtitle="App enquiries and the apps you are building."
        action={{ href: adminPath("projects/new"), label: "New app project" }}
      />

      <div className="no-scrollbar -mx-4 mb-7 flex gap-2.5 overflow-x-auto px-4 md:mx-0 md:px-0">
        <StatTile label="Open enquiries" value={String(enquiries.length)} />
        <StatTile label="In progress" value={String(active.length)} />
        <StatTile label="Live" value={String(live.length)} />
      </div>

      <section aria-labelledby="app-enquiries" className="mb-8">
        <h2 id="app-enquiries" className="mb-3 text-xl font-extrabold text-navy-text">
          Enquiries
        </h2>
        {enquiries.length === 0 ? (
          <EmptyState title="No open app enquiries" body="Quote requests for web or mobile apps appear here." />
        ) : (
          <div className="grid gap-2.5 lg:grid-cols-2">
            {enquiries.map((l) => (
              <article key={l.id} className="rounded-xl border border-edge bg-surface p-4">
                <div className="flex items-start justify-between gap-3">
                  <Link href={adminPath(`leads/${l.id}`)} className="min-w-0 truncate font-bold text-navy-text no-underline">
                    {l.name}
                  </Link>
                  <Pill tone={l.status === "new" ? "amber" : "neutral"}>{l.status}</Pill>
                </div>
                <p className="mt-1 text-sm text-muted">
                  {[l.topic, l.budget, relativeDate(l.created_at)].filter(Boolean).join(" · ")}
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <a href={l.phone ? `tel:${l.phone}` : `mailto:${l.email}`} className={actionClass(true)}>
                    {l.phone ? "Call" : "Email"}
                  </a>
                  <Link href={adminPath(`leads/${l.id}`)} className={actionClass()}>
                    Open
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="app-builds">
        <h2 id="app-builds" className="mb-3 text-xl font-extrabold text-navy-text">
          Builds
        </h2>
        {active.length === 0 ? (
          <EmptyState
            title="No apps in progress"
            body="Set a project's package to Web app or Mobile app and it appears here."
            action={{ href: adminPath("projects/new"), label: "New app project" }}
          />
        ) : (
          <ProjectBoard projects={active} />
        )}
      </section>
    </AdminShell>
  );
}
