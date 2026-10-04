"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/admin/DataTable";
import { Pill, formatDate } from "@/components/admin/ui";
import { useAdminPath } from "@/components/admin/AdminPathProvider";
import {
  displayStatus,
  formatMoney,
  STATUS_LABEL,
  type InvoiceRow,
} from "@/lib/admin/shared";
import type { InvoiceStatus } from "@/lib/db/types";

const STATUS_TONE: Record<
  InvoiceStatus,
  "neutral" | "navy" | "amber" | "success" | "danger"
> = {
  draft: "neutral",
  issued: "navy",
  paid: "success",
  overdue: "danger",
  cancelled: "neutral",
};

/**
 * Invoices as a table.
 *
 * Amount and due date sort numerically rather than as text, which is the
 * point: chasing money means ordering by what is most overdue or largest,
 * and a card list could do neither.
 */
export function InvoicesTable({ invoices }: { invoices: InvoiceRow[] }) {
  const adminPath = useAdminPath();

  const columns = useMemo<ColumnDef<InvoiceRow, unknown>[]>(
    () => [
      {
        accessorKey: "invoice_number",
        header: "Number",
        cell: ({ row }) => (
          <Link
            href={adminPath(`invoices/${row.original.id}`)}
            className="font-mono font-semibold text-navy-text no-underline hover:text-amber-deep"
          >
            {row.original.invoice_number ?? "Draft"}
          </Link>
        ),
      },
      {
        id: "client",
        accessorFn: (i) => i.client?.business_name ?? "",
        header: "Client",
        cell: ({ row }) => (
          <span className="text-ink">
            {row.original.client?.business_name ?? "—"}
          </span>
        ),
      },
      {
        id: "status",
        accessorFn: (i) => displayStatus(i),
        header: "Status",
        cell: ({ row }) => {
          const s = displayStatus(row.original);
          return <Pill tone={STATUS_TONE[s]}>{STATUS_LABEL[s]}</Pill>;
        },
      },
      {
        id: "total",
        // Sorts as a number, not as the formatted string.
        accessorFn: (i) => Number(i.total),
        header: "Amount",
        cell: ({ row }) => (
          <span className="whitespace-nowrap font-semibold tabular-nums text-ink">
            {formatMoney(Number(row.original.total))}
          </span>
        ),
      },
      {
        accessorKey: "issued_on",
        header: "Issued",
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted">
            {formatDate(row.original.issued_on)}
          </span>
        ),
      },
      {
        accessorKey: "due_on",
        header: "Due",
        cell: ({ row }) => {
          const overdue = displayStatus(row.original) === "overdue";
          return (
            <span
              className={
                overdue
                  ? "whitespace-nowrap font-semibold text-danger"
                  : "whitespace-nowrap text-muted"
              }
            >
              {formatDate(row.original.due_on)}
            </span>
          );
        },
      },
    ],
    [adminPath],
  );

  return (
    <DataTable
      columns={columns}
      data={invoices}
      getRowId={(i) => i.id}
      searchPlaceholder="Search number or client…"
      emptyTitle="No invoices here"
      emptyBody="Raise one from a project, or create it directly."
      csv={{
        filename: `invoices-${new Date().toISOString().slice(0, 10)}.csv`,
        columns: [
          { key: "number", header: "Number" },
          { key: "client", header: "Client" },
          { key: "project", header: "Project" },
          { key: "status", header: "Status" },
          { key: "total", header: "Amount" },
          { key: "issued", header: "Issued" },
          { key: "due", header: "Due" },
        ],
        map: (i) => ({
          number: i.invoice_number ?? "Draft",
          client: i.client?.business_name ?? "",
          project: i.project?.title ?? "",
          status: STATUS_LABEL[displayStatus(i)],
          total: Number(i.total).toFixed(2),
          issued: i.issued_on
            ? new Date(i.issued_on).toLocaleDateString("en-GB")
            : "",
          due: i.due_on ? new Date(i.due_on).toLocaleDateString("en-GB") : "",
        }),
      }}
      renderCard={(i) => {
        const s = displayStatus(i);
        return (
          <Link
            href={adminPath(`invoices/${i.id}`)}
            className="block rounded-lg border-2 border-edge bg-surface p-4 no-underline"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-mono font-bold text-navy-text">
                {i.invoice_number ?? "Draft"}
              </p>
              <Pill tone={STATUS_TONE[s]}>{STATUS_LABEL[s]}</Pill>
            </div>
            <p className="mt-1 truncate text-sm text-muted">
              {i.client?.business_name ?? "No client"}
            </p>
            <p className="mt-2 flex items-baseline justify-between gap-3">
              <span className="text-lg font-bold tabular-nums text-navy-text">
                {formatMoney(Number(i.total))}
              </span>
              <span
                className={
                  s === "overdue" ? "text-sm text-danger" : "text-sm text-muted"
                }
              >
                {i.due_on ? `Due ${formatDate(i.due_on)}` : ""}
              </span>
            </p>
          </Link>
        );
      }}
    />
  );
}
