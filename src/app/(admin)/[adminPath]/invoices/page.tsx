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
import { AdminHeader } from "@/components/admin/AdminHeader";
import { cn } from "@/lib/cn";
import type { InvoiceStatus } from "@/lib/db/types";

const STATUS_STYLE: Record<InvoiceStatus, string> = {
  draft: "bg-edge text-muted",
  issued: "bg-navy text-white",
  paid: "bg-success text-white",
  overdue: "bg-danger text-white",
  cancelled: "bg-edge text-muted",
};

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
    <div className="min-h-screen">
      <AdminHeader email={owner.email} current="invoices" />

      <main className="mx-auto w-[94%] max-w-[1100px] py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-display text-navy-text">
              Invoices
            </h1>
            <p className="text-muted">{totals.counts.all ?? 0} total</p>
          </div>
          <Link
            href={adminPath("invoices/new")}
            className="bg-navy rounded-md px-5 py-3 text-sm font-bold text-white no-underline transition hover:bg-navy-deep"
          >
            New invoice
          </Link>
        </div>

        {missing.length > 0 ? (
          <div className="mb-6 border-l-4 border-amber bg-surface p-5">
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

        <div className="mb-6 grid gap-px border-2 border-navy bg-edge sm:grid-cols-3">
          {[
            { label: "Outstanding", value: totals.outstanding },
            { label: "Overdue", value: totals.overdue },
            { label: "Paid", value: totals.paid },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface p-5">
              <p className="text-xs font-bold tracking-[0.2em] text-muted uppercase">
                {stat.label}
              </p>
              <p
                className={cn(
                  "mt-1 text-2xl font-bold",
                  stat.label === "Overdue" && stat.value > 0
                    ? "text-danger"
                    : "text-navy-text",
                )}
              >
                {formatMoney(stat.value)}
              </p>
            </div>
          ))}
        </div>

        <nav aria-label="Filter by status" className="mb-6 flex flex-wrap gap-2">
          {[{ key: "all", label: "All" }, ...INVOICE_STATUSES.map((s) => ({ key: s, label: STATUS_LABEL[s] }))].map(
            (tab) => {
              const active = filter === tab.key;
              return (
                <Link
                  key={tab.key}
                  href={`${adminPath("invoices")}?status=${tab.key}`}
                  className={cn(
                    "border-2 px-4 py-2 text-sm font-semibold no-underline transition",
                    active
                      ? "border-navy bg-navy text-white"
                      : "border-edge text-muted hover:border-navy hover:text-navy-text",
                  )}
                >
                  {tab.label}
                  <span className={cn("ml-2", active ? "text-white/70" : "text-muted")}>
                    {totals.counts[tab.key] ?? 0}
                  </span>
                </Link>
              );
            },
          )}
        </nav>

        {invoices.length === 0 ? (
          <div className="border-2 border-edge rounded-lg bg-surface p-10 text-center">
            <p className="text-lg font-bold text-navy-text">No invoices here</p>
            <p className="mt-2 text-muted">
              Create a draft, then issue it when you are ready to send.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {invoices.map((inv) => {
              const shown = displayStatus(inv);
              return (
                <Link
                  key={inv.id}
                  href={adminPath(`invoices/${inv.id}`)}
                  className="flex flex-wrap items-center justify-between gap-4 border-2 border-edge rounded-lg bg-surface p-5 no-underline transition hover:border-navy"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-bold text-navy-text">
                        {inv.invoice_number ?? "Draft"}
                      </h2>
                      <span
                        className={cn(
                          "px-2 py-0.5 text-xs font-bold tracking-wide uppercase",
                          STATUS_STYLE[shown],
                        )}
                      >
                        {STATUS_LABEL[shown]}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      {inv.client?.business_name ?? "Unknown client"}
                      {inv.project?.title ? ` · ${inv.project.title}` : ""}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-navy-text">
                      {formatMoney(inv.total)}
                    </p>
                    <p className="text-sm text-muted">
                      {inv.status === "paid"
                        ? `Paid ${formatDate(inv.paid_on)}`
                        : inv.due_on
                          ? `Due ${formatDate(inv.due_on)}`
                          : "Not issued"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
