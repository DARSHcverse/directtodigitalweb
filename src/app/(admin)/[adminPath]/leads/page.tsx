import Link from "next/link";
import { requireOwner } from "@/lib/admin/auth";
import { adminPath } from "@/lib/admin/paths";
import { listLeads, countByStatus, STATUS_LABEL, LEAD_STATUSES } from "@/lib/admin/leads";
import { LeadCard } from "@/components/admin/LeadCard";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SearchBox } from "@/components/admin/SearchBox";
import { PageHeader, EmptyState } from "@/components/admin/ui";
import { cn } from "@/lib/cn";
import type { LeadStatus } from "@/lib/db/types";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const owner = await requireOwner();
  const { status, q } = await searchParams;

  const filter = (
    LEAD_STATUSES.includes(status as LeadStatus) ? status : "all"
  ) as LeadStatus | "all";

  const [leads, counts] = await Promise.all([
    listLeads(filter, q),
    countByStatus(),
  ]);

  const tabs: Array<{ key: LeadStatus | "all"; label: string }> = [
    { key: "all", label: "All" },
    ...LEAD_STATUSES.map((s) => ({ key: s, label: STATUS_LABEL[s] })),
  ];

  return (
    <div className="min-h-screen">
      <AdminHeader email={owner.email} current="leads" />

      <main className="mx-auto w-[94%] max-w-[1100px] py-8">
        <PageHeader
          title="Leads"
          subtitle={`${counts.all ?? 0} total · ${counts.new ?? 0} new`}
          action={{ href: adminPath("leads/new"), label: "Add lead" }}
        />

        <SearchBox
          basePath={adminPath("leads")}
          placeholder="Search by name, email, message…"
        />

        <nav aria-label="Filter by status" className="mb-6 flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const active = filter === tab.key;
            const n = counts[tab.key] ?? 0;
            return (
              <Link
                key={tab.key}
                href={
                  tab.key === "all"
                    ? adminPath("leads")
                    : `${adminPath("leads")}?status=${tab.key}`
                }
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

        {leads.length === 0 ? (
          <EmptyState
            title={
              q
                ? "Nothing matched that search"
                : filter === "all"
                  ? "No leads yet"
                  : `No ${filter} leads`
            }
            body={
              q
                ? "Try a different name, email or phrase."
                : filter === "all"
                  ? "Enquiries from the website appear here as they arrive. You can also add one by hand."
                  : "Try another status filter."
            }
            action={
              q ? undefined : { href: adminPath("leads/new"), label: "Add a lead" }
            }
          />
        ) : (
          <div className="grid gap-4">
            {leads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                newClientHref={`${adminPath("clients/new")}?lead=${lead.id}`}
                clientHref={
                  lead.client_id ? adminPath(`clients/${lead.client_id}`) : "#"
                }
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
