import Link from "next/link";
import { requireOwner } from "@/lib/admin/auth";
import { adminPath } from "@/lib/admin/paths";
import { getDashboard } from "@/lib/admin/dashboard";
import { formatMoney } from "@/lib/admin/invoices";
import { STAGE_LABEL } from "@/lib/admin/projects";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  PageHeader,
  Pill,
  StatTile,
  relativeDate,
} from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const owner = await requireOwner();
  const d = await getDashboard();

  // Ordered by what needs doing, not by table. An empty list is a good sign,
  // so each section says so rather than showing nothing.
  const needsAttention =
    d.newLeads.length + d.unreadMessages.length + d.waitingOnClient.length;

  return (
    <div className="min-h-screen">
      <AdminHeader email={owner.email} current="dashboard" />

      <main className="mx-auto w-[94%] max-w-[1100px] py-8">
        <PageHeader
          title="Today"
          subtitle={
            needsAttention === 0
              ? "Nothing waiting on you."
              : `${needsAttention} ${needsAttention === 1 ? "thing" : "things"} need you.`
          }
        />

        <div className="mb-8 grid gap-px border-2 border-navy bg-edge sm:grid-cols-4">
          <StatTile
            label="Outstanding"
            value={formatMoney(d.outstanding)}
            tone={d.outstanding > 0 ? "navy" : "navy"}
          />
          <StatTile
            label="Overdue"
            value={formatMoney(d.overdue)}
            tone={d.overdue > 0 ? "danger" : "navy"}
          />
          <StatTile label="Active projects" value={String(d.counts.projects)} />
          <StatTile label="Clients" value={String(d.counts.clients)} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="border-2 border-edge bg-surface p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-navy">New enquiries</h2>
              <Link
                href={adminPath("leads")}
                className="text-sm font-semibold text-navy no-underline hover:text-amber-deep"
              >
                All leads →
              </Link>
            </div>

            {d.newLeads.length === 0 ? (
              <p className="text-sm text-muted">
                Nothing new. Enquiries from the site land here.
              </p>
            ) : (
              <ul className="grid gap-3">
                {d.newLeads.map((lead) => (
                  <li key={lead.id} className="border-l-4 border-amber pl-4">
                    <p className="font-semibold text-navy">{lead.name}</p>
                    <p className="text-sm text-muted">
                      {relativeDate(lead.created_at)}
                      {lead.source_path ? ` · ${lead.source_path}` : ""}
                      {lead.budget ? ` · ${lead.budget}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="border-2 border-edge bg-surface p-6">
            <h2 className="mb-4 text-xl font-bold text-navy">
              Unanswered messages
            </h2>

            {d.unreadMessages.length === 0 ? (
              <p className="text-sm text-muted">
                Nothing unanswered. Client messages appear here.
              </p>
            ) : (
              <ul className="grid gap-3">
                {d.unreadMessages.map((m) => (
                  <li key={m.id}>
                    <Link
                      href={adminPath(`projects/${m.project_id}`)}
                      className="block border-l-4 border-amber pl-4 no-underline"
                    >
                      <p className="font-semibold text-navy">
                        {m.project_title ?? "Project"}
                      </p>
                      <p className="line-clamp-2 text-sm text-muted">
                        {m.body}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="border-2 border-edge bg-surface p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-navy">Active projects</h2>
              <Link
                href={adminPath("projects")}
                className="text-sm font-semibold text-navy no-underline hover:text-amber-deep"
              >
                All projects →
              </Link>
            </div>

            {d.activeProjects.length === 0 ? (
              <p className="text-sm text-muted">Nothing in progress.</p>
            ) : (
              <ul className="grid gap-3">
                {d.activeProjects.slice(0, 5).map((p) => (
                  <li key={p.id}>
                    <Link
                      href={adminPath(`projects/${p.id}`)}
                      className="flex flex-wrap items-center gap-3 no-underline"
                    >
                      <span className="font-semibold text-navy">{p.title}</span>
                      <Pill tone="navy">{STAGE_LABEL[p.stage]}</Pill>
                      <span className="text-sm text-muted">
                        {p.client_name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="border-2 border-edge bg-surface p-6">
            <h2 className="mb-4 text-xl font-bold text-navy">
              Waiting on clients
            </h2>

            {d.waitingOnClient.length === 0 ? (
              <p className="text-sm text-muted">
                Nothing outstanding from clients.
              </p>
            ) : (
              <ul className="grid gap-3">
                {d.waitingOnClient.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={adminPath(`projects/${p.id}`)}
                      className="block border-l-4 border-amber pl-4 no-underline"
                    >
                      <p className="font-semibold text-navy">{p.title}</p>
                      <p className="text-sm text-muted">{p.awaiting_client}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
