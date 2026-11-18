import Link from "next/link";
import { requireOwner } from "@/lib/admin/auth";
import { adminPath } from "@/lib/admin/paths";
import {
  listInvoices,
  invoiceTotals,
  displayStatus,
  formatMoney,
  formatDate,
  INVOICE_STATUSES,
  STATUS_LABEL,
} from "@/lib/admin/invoices";
import { getSettings, missingForInvoicing } from "@/lib/admin/settings";
import { AdminShell } from "@/components/admin/AdminShell";
import { InvoicesTable } from "@/components/admin/InvoicesTable";
import { FilterTabs, PageHeader, StatTile } from "@/components/admin/ui";
import type { InvoiceStatus } from "@/lib/db/types";

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const owner = await requireOwner();
  const { status } = await searchParams;

  const filter = (
    status === "all" || INVOICE_STATUSES.includes(status as InvoiceStatus)
      ? status
      : "all"
  ) as InvoiceStatus | "all";

  const [invoices, totals, settings] = await Promise.all([
    listInvoices(filter),
    invoiceTotals(),
    getSettings(),
  ]);

  const missing = missingForInvoicing(settings);

  return (
    <AdminShell email={owner.email} current="invoices">
        <PageHeader
          title="Invoices"
          subtitle={`${totals.counts.all ?? 0} total`}
          action={{ href: adminPath("invoices/new"), label: "New invoice" }}
        />

        {missing.length > 0 ? (
          <div className="mb-5 rounded-xl border border-amber bg-surface p-4">
            <p className="font-bold text-navy-text">
              Finish your invoice details first
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              An invoice needs {missing.join(", ")} before it can go out.
              Drafts can still be built in the meantime.
            </p>
            <Link
              href={adminPath("settings")}
              className="mt-3 inline-block border-2 border-navy rounded-lg px-4 py-2 text-sm font-bold text-navy-text no-underline transition hover:bg-navy hover:text-white"
            >
              Business settings
            </Link>
          </div>
        ) : null}

        <div className="no-scrollbar -mx-4 mb-5 flex gap-2.5 overflow-x-auto px-4 md:mx-0 md:px-0">
          <StatTile label="Owed to you" value={formatMoney(totals.outstanding)} />
          <StatTile
            label="Overdue"
            value={formatMoney(totals.overdue)}
            tone={totals.overdue > 0 ? "danger" : "navy"}
          />
          <StatTile label="Paid" value={formatMoney(totals.paid)} tone="success" />
        </div>

        <FilterTabs
          label="Filter by status"
          basePath={adminPath("invoices")}
          param="status"
          current={filter}
          tabs={[{ key: "all", label: "All" }, ...INVOICE_STATUSES.map((s) => ({ key: s, label: STATUS_LABEL[s] }))]}
          counts={totals.counts}
        />

        <InvoicesTable invoices={invoices} />

      </AdminShell>
  );
}
