import { requireOwner } from "@/lib/admin/auth";
import { adminPath } from "@/lib/admin/paths";
import { listLeads, countByStatus, STATUS_LABEL, LEAD_STATUSES } from "@/lib/admin/leads";
import { LeadsTable } from "@/components/admin/LeadsTable";
import { AdminShell } from "@/components/admin/AdminShell";
import { FilterTabs, PageHeader } from "@/components/admin/ui";
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

        <FilterTabs
          label="Filter by status"
          basePath={adminPath("leads")}
          param="status"
          current={filter}
          tabs={tabs}
          counts={counts}
        />

        <LeadsTable leads={leads} />

      </AdminShell>
  );
}
