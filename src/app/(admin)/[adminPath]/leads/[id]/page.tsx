import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOwner } from "@/lib/admin/auth";
import { adminPath } from "@/lib/admin/paths";
import { getLead, LEAD_STATUSES, STATUS_LABEL } from "@/lib/admin/leads";
import { formatDate, relativeDate } from "@/components/admin/ui";
import { AdminShell } from "@/components/admin/AdminShell";
import { ArrangeCallForm } from "@/components/admin/ArrangeCallForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { PageHeader, Panel, Pill } from "@/components/admin/ui";
import {
  deleteLeadAndReturn,
  updateLeadNotes,
  updateLeadStatus,
} from "@/app/(admin)/[adminPath]/leads/actions";
import { leadKindLabel } from "@/lib/lead";

export const dynamic = "force-dynamic";

/**
 * One enquiry, in full.
 *
 * The list is for scanning; this is for acting. Until now there was no page
 * for a single lead, so on a desktop the message itself could not be read,
 * and there was nowhere to arrange the call someone had asked for.
 */
export default async function LeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const owner = await requireOwner();
  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) notFound();

  const isCall = lead.kind === "booking";

  const details: [string, React.ReactNode][] = [
    ["Email", <a key="e" href={`mailto:${lead.email}`} className="font-semibold text-navy-text">{lead.email}</a>],
    ["Phone", lead.phone ? <a key="p" href={`tel:${lead.phone.replace(/\s/g, "")}`} className="font-semibold text-navy-text">{lead.phone}</a> : null],
    ["Trade", lead.trade],
    ["Town", lead.town],
    ["Current website", lead.current_website ? (
      <a key="w" href={/^https?:\/\//.test(lead.current_website) ? lead.current_website : `https://${lead.current_website}`} target="_blank" rel="noreferrer noopener" className="font-semibold text-navy-text">
        {lead.current_website} ↗
      </a>
    ) : null],
    [isCall ? "Call by" : "Wants", lead.topic],
    ["Budget", lead.budget],
    [isCall ? "When suits" : "Timeline", lead.timeline],
    ["Received", `${relativeDate(lead.created_at)} · ${formatDate(lead.created_at)}`],
    ["Source", lead.ref || lead.utm_source || lead.referrer || null],
    ["First page", lead.landing_page || lead.source_path],
  ];

  return (
    <AdminShell email={owner.email} current="leads">
      <PageHeader
        title={lead.name}
        subtitle={leadKindLabel[lead.kind]}
        back={{ href: adminPath("leads"), label: "Leads" }}
      />

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="grid content-start gap-6">
          <Panel title="Details">
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-[10rem_1fr]">
              {details
                .filter(([, value]) => value)
                .map(([label, value]) => (
                  <div key={label} className="contents">
                    <dt className="text-sm text-muted">{label}</dt>
                    <dd className="text-ink">{value}</dd>
                  </div>
                ))}
            </dl>
          </Panel>

          <Panel title={isCall ? "What they want to talk about" : "Their message"}>
            {lead.message ? (
              <p className="leading-relaxed whitespace-pre-wrap text-ink">{lead.message}</p>
            ) : (
              <p className="text-sm text-muted">No message.</p>
            )}
          </Panel>
        </div>

        <div className="grid content-start gap-6">
          <Panel
            title="Arrange a call"
            description={
              isCall
                ? `They asked for a ${lead.topic?.replace(/^Phone/, "phone") ?? "call"}${lead.timeline ? `, ${lead.timeline.toLowerCase()}` : ""}. Pick a time and they'll get a confirmation with a calendar invite.`
                : "Pick a time and they'll get a confirmation with a calendar invite."
            }
          >
            <ArrangeCallForm
              leadId={lead.id}
              requestedMethod={isCall ? lead.topic : null}
              hasPhone={Boolean(lead.phone)}
            />
          </Panel>

          <Panel title="Status">
            <form action={updateLeadStatus} className="flex flex-wrap items-center gap-3">
              <input type="hidden" name="id" value={lead.id} />
              <select
                name="status"
                defaultValue={lead.status}
                aria-label="Status"
                className="rounded-lg border-2 border-edge bg-surface px-3 py-2 text-ink"
              >
                {LEAD_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-md border-2 border-navy px-4 py-2 text-sm font-bold text-navy-text transition hover:bg-navy hover:text-white"
              >
                Save
              </button>
              <Pill tone={lead.status === "new" ? "amber" : lead.status === "won" ? "success" : "neutral"}>
                {STATUS_LABEL[lead.status]}
              </Pill>
            </form>
          </Panel>

          <Panel title="Notes" description="Private. Arranged calls are added here automatically.">
            <form action={updateLeadNotes} className="grid gap-3">
              <input type="hidden" name="id" value={lead.id} />
              <textarea
                name="notes"
                rows={5}
                defaultValue={lead.notes ?? ""}
                aria-label="Notes"
                className="resize-y rounded-lg border-2 border-edge bg-surface px-3 py-2.5 text-ink outline-none focus:border-navy"
              />
              <button
                type="submit"
                className="justify-self-start rounded-md border-2 border-navy px-4 py-2 text-sm font-bold text-navy-text transition hover:bg-navy hover:text-white"
              >
                Save notes
              </button>
            </form>
          </Panel>

          <Panel title="Next">
            <div className="flex flex-wrap items-start gap-3">
              <Link
                href={
                  lead.client_id
                    ? adminPath(`clients/${lead.client_id}`)
                    : `${adminPath("clients/new")}?lead=${lead.id}`
                }
                className="rounded-md bg-navy px-4 py-2 text-sm font-bold text-white no-underline transition hover:bg-navy-deep"
              >
                {lead.client_id ? "View client" : "Convert to client"}
              </Link>
              <DeleteButton
                action={deleteLeadAndReturn}
                id={lead.id}
                what={lead.name}
                label="Delete lead"
              />
            </div>
          </Panel>
        </div>
      </div>
    </AdminShell>
  );
}
