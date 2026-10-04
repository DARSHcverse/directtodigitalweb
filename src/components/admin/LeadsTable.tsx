"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/admin/DataTable";
import { Pill, relativeDate } from "@/components/admin/ui";
import { adminPath } from "@/lib/admin/paths";
import type { Lead, LeadStatus } from "@/lib/db/types";

const STATUS_TONE: Record<LeadStatus, "neutral" | "navy" | "amber" | "success" | "danger"> = {
  new: "amber",
  contacted: "navy",
  quoted: "navy",
  won: "success",
  lost: "neutral",
};

const STATUS_TEXT: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  won: "Won",
  lost: "Lost",
};

/**
 * Leads as a sortable table.
 *
 * Sorted by date on arrival, which is how a list of enquiries is read, but
 * every column sorts — most usefully status, so the unactioned ones group
 * together without changing the filter.
 *
 * The phone layout keeps the card shape, because the useful columns here are
 * name, how old it is and what they asked for, which do not fit side by side
 * on a narrow screen.
 */
export function LeadsTable({ leads }: { leads: Lead[] }) {
  const columns = useMemo<ColumnDef<Lead, unknown>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="truncate font-semibold text-navy-text">
              {row.original.name}
            </p>
            <p className="truncate text-xs text-muted">{row.original.email}</p>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Pill tone={STATUS_TONE[row.original.status]}>
            {STATUS_TEXT[row.original.status]}
          </Pill>
        ),
      },
      {
        accessorKey: "topic",
        header: "Wants",
        cell: ({ row }) => (
          <span className="text-muted">{row.original.topic ?? "—"}</span>
        ),
      },
      {
        accessorKey: "budget",
        header: "Budget",
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted">
            {row.original.budget ?? "—"}
          </span>
        ),
      },
      {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) =>
          row.original.phone ? (
            <a
              href={`tel:${row.original.phone}`}
              className="whitespace-nowrap text-navy-text no-underline hover:text-amber-deep"
            >
              {row.original.phone}
            </a>
          ) : (
            <span className="text-muted">—</span>
          ),
      },
      {
        accessorKey: "created_at",
        header: "Received",
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted">
            {relativeDate(row.original.created_at)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <Link
            href={
              row.original.client_id
                ? adminPath(`clients/${row.original.client_id}`)
                : `${adminPath("clients/new")}?lead=${row.original.id}`
            }
            className="whitespace-nowrap text-sm font-bold text-navy-text no-underline hover:text-amber-deep"
          >
            {row.original.client_id ? "View client" : "Convert"} →
          </Link>
        ),
      },
    ],
    [],
  );

  return (
    <DataTable
      columns={columns}
      data={leads}
      getRowId={(l) => l.id}
      searchPlaceholder="Search name, email, message…"
      emptyTitle="No leads here"
      emptyBody="Enquiries from the website arrive here. You can also add one by hand."
      csv={{
        filename: `leads-${new Date().toISOString().slice(0, 10)}.csv`,
        columns: [
          { key: "name", header: "Name" },
          { key: "email", header: "Email" },
          { key: "phone", header: "Phone" },
          { key: "status", header: "Status" },
          { key: "topic", header: "Wants" },
          { key: "budget", header: "Budget" },
          { key: "timeline", header: "Timeline" },
          { key: "message", header: "Message" },
          { key: "received", header: "Received" },
        ],
        map: (l) => ({
          name: l.name,
          email: l.email,
          phone: l.phone ?? "",
          status: STATUS_TEXT[l.status],
          topic: l.topic ?? "",
          budget: l.budget ?? "",
          timeline: l.timeline ?? "",
          message: l.message ?? "",
          received: new Date(l.created_at).toLocaleDateString("en-GB"),
        }),
      }}
      renderCard={(l) => (
        <div className="rounded-lg border-2 border-edge bg-surface p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-bold text-navy-text">{l.name}</p>
              <p className="truncate text-sm text-muted">{l.email}</p>
            </div>
            <Pill tone={STATUS_TONE[l.status]}>{STATUS_TEXT[l.status]}</Pill>
          </div>

          <p className="mt-2 text-sm text-muted">
            {relativeDate(l.created_at)}
            {l.topic ? ` · ${l.topic}` : ""}
            {l.budget ? ` · ${l.budget}` : ""}
          </p>

          {l.message ? (
            <p className="mt-2 line-clamp-2 text-sm text-ink">{l.message}</p>
          ) : null}

          <div className="mt-3 flex flex-wrap gap-3">
            {l.phone ? (
              <a
                href={`tel:${l.phone}`}
                className="text-sm font-bold text-navy-text no-underline"
              >
                Call
              </a>
            ) : null}
            <a
              href={`mailto:${l.email}`}
              className="text-sm font-bold text-navy-text no-underline"
            >
              Email
            </a>
            <Link
              href={
                l.client_id
                  ? adminPath(`clients/${l.client_id}`)
                  : `${adminPath("clients/new")}?lead=${l.id}`
              }
              className="ml-auto text-sm font-bold text-navy-text no-underline"
            >
              {l.client_id ? "View client" : "Convert"} →
            </Link>
          </div>
        </div>
      )}
    />
  );
}
