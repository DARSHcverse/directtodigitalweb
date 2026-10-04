import Link from "next/link";
import { requireOwner } from "@/lib/admin/auth";
import { adminPath } from "@/lib/admin/paths";
import { listLeads, countByStatus, STATUS_LABEL, LEAD_STATUSES } from "@/lib/admin/leads";
import { LeadsTable } from "@/components/admin/LeadsTable";
import { AdminShell } from "@/components/admin/AdminShell";
import { PageHeader } from "@/components/admin/ui";
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
    <AdminShell email={owner.email} current="leads">
        <PageHeader
          title="Leads"
          subtitle={`${counts.all ?? 0} total · ${counts.new ?? 0} new`}
          action={{ href: adminPath("leads/new"), label: "Add lead" }}
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

        <LeadsTable leads={leads} />

      </AdminShell>
  );
}
