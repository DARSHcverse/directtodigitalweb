import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProjectBoard } from "@/components/admin/ProjectBoard";
import { actionClass, Pill, StatTile, formatDate, relativeDate } from "@/components/admin/ui";
import { requireOwner } from "@/lib/admin/auth";
import { getDashboard } from "@/lib/admin/dashboard";
import { formatMoney } from "@/lib/admin/invoices";
import { adminPath } from "@/lib/admin/paths";
import { SEGMENTS, SEGMENT_LABEL } from "@/lib/admin/shared";

export const dynamic = "force-dynamic";

type Task = {
  key: string;
  title: string;
  detail: string;
  tag: string;
  tone: "amber" | "navy" | "danger";
  href: string;
  action: { label: string; href: string };
};

function greeting(): string {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone: "Europe/London" }).format(new Date()),
  );
  if (hour < 12) return "Good morning";
  return hour < 18 ? "Good afternoon" : "Good evening";
}

export default async function DashboardPage() {
  const owner = await requireOwner();
  const d = await getDashboard();

  // Replies first, then money, then new enquiries: oldest promises come first.
  const tasks: Task[] = [
    ...d.unreadMessages.map((m) => ({
      key: `m-${m.id}`,
      title: m.project_title ?? "Project",
      detail: m.body,
      tag: "Message",
      tone: "navy" as const,
      href: adminPath(`projects/${m.project_id}`),
      action: { label: "Reply", href: adminPath(`projects/${m.project_id}`) },
    })),
    ...d.overdueInvoices.map((i) => ({
      key: `i-${i.id}`,
      title: i.invoice_number ?? "Invoice",
      detail: `${i.client_name ?? "No client"}, ${formatMoney(i.total)}, due ${formatDate(i.due_on)}`,
      tag: "Overdue",
      tone: "danger" as const,
      href: adminPath(`invoices/${i.id}`),
      action: { label: "Chase", href: adminPath(`invoices/${i.id}`) },
    })),
    ...d.newLeads.map((l) => ({
      key: `l-${l.id}`,
      title: l.name,
      detail: [l.topic, l.trade, relativeDate(l.created_at)].filter(Boolean).join(" · "),
      tag: "New lead",
      tone: "amber" as const,
      href: adminPath(`leads/${l.id}`),
      action: l.phone
        ? { label: "Call", href: `tel:${l.phone}` }
        : { label: "Email", href: `mailto:${l.email}` },
    })),
  ];

  const leadTotal = SEGMENTS.reduce((sum, s) => sum + d.segments[s], 0);

  return (
    <AdminShell email={owner.email} current="dashboard">
      <div className="mb-5">
        <h1 className="text-[2.5rem] leading-none font-extrabold tracking-display text-navy-text md:text-5xl">
          {greeting()}, Shan
        </h1>
        <p className="mt-2 text-lg text-muted">
          {tasks.length === 0
            ? "Nothing is waiting on you."
            : `${tasks.length} ${tasks.length === 1 ? "thing needs" : "things need"} you.`}
        </p>
      </div>

      <div className="no-scrollbar -mx-4 mb-4 flex gap-2.5 overflow-x-auto px-4 md:mx-0 md:px-0">
        <StatTile label="Owed to you" value={formatMoney(d.outstanding)} />
        <StatTile label="Overdue" value={formatMoney(d.overdue)} tone={d.overdue > 0 ? "danger" : "navy"} />
        <StatTile label="Active work" value={String(d.counts.projects)} />
        <StatTile label="New this week" value={String(d.newThisWeek)} />
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <section aria-labelledby="do-next" className="rounded-xl border border-edge bg-surface p-4">
          <h2 id="do-next" className="mb-1 text-xl font-extrabold text-navy-text">Do next</h2>
          {tasks.length === 0 ? (
            <p className="py-3 text-muted">You are clear. New enquiries and client messages land here.</p>
          ) : (
            <ul className="divide-y divide-edge">
              {tasks.map((t) => (
                <li key={t.key} className="flex items-center gap-3 py-3">
                  <Link href={t.href} className="min-w-0 flex-1 no-underline">
                    <span className="flex items-center gap-2">
                      <span className="truncate font-bold text-navy-text">{t.title}</span>
                      <Pill tone={t.tone}>{t.tag}</Pill>
                    </span>
                    <span className="mt-0.5 block truncate text-sm text-muted">{t.detail}</span>
                  </Link>
                  {t.action.href.startsWith("/") ? (
                    <Link href={t.action.href} className={`${actionClass(true)} w-18 shrink-0`}>{t.action.label}</Link>
                  ) : (
                    <a href={t.action.href} className={`${actionClass(true)} w-18 shrink-0`}>{t.action.label}</a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="grid content-start gap-4">
          <section aria-labelledby="sources" className="rounded-xl border border-edge bg-surface p-4">
            <h2 id="sources" className="text-xl font-extrabold text-navy-text">Where leads come from</h2>
            <p className="mb-3 text-sm text-muted">Last 90 days</p>
            <div className="grid gap-3">
              {SEGMENTS.map((s) => (
                <div key={s}>
                  <p className="mb-1 flex justify-between text-sm font-semibold text-navy-text">
                    {SEGMENT_LABEL[s]} <span className="tabular-nums">{d.segments[s]}</span>
                  </p>
                  <div className="h-2 overflow-hidden rounded-full bg-edge">
                    <div
                      className="h-full rounded-full bg-amber"
                      style={{ width: `${leadTotal ? (d.segments[s] / leadTotal) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {d.waitingOnClient.length > 0 ? (
            <section aria-labelledby="waiting" className="rounded-xl border border-edge bg-surface p-4">
              <h2 id="waiting" className="mb-2 text-xl font-extrabold text-navy-text">Waiting on clients</h2>
              <ul className="grid gap-2">
                {d.waitingOnClient.map((p) => (
                  <li key={p.id}>
                    <Link href={adminPath(`projects/${p.id}`)} className="block no-underline">
                      <span className="font-semibold text-navy-text">{p.title}</span>
                      <span className="block text-sm text-muted">{p.awaiting_client}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>

      <section aria-labelledby="active-work" className="mt-7">
        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 id="active-work" className="text-xl font-extrabold text-navy-text">Active work</h2>
          <Link href={adminPath("projects")} className="inline-flex min-h-11 items-center text-sm font-bold text-navy-text no-underline hover:text-amber-deep">
            All projects →
          </Link>
        </div>
        <ProjectBoard projects={d.activeProjects} />
      </section>
    </AdminShell>
  );
}
