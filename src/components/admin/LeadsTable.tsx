"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/admin/DataTable";
import { actionClass, Pill, relativeDate } from "@/components/admin/ui";
import { QuickSelect } from "@/components/admin/QuickSelect";
import { cn } from "@/lib/cn";
import { useAdminPath } from "@/components/admin/AdminPathProvider";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteLead, updateLeadStatus } from "@/app/(admin)/[adminPath]/leads/actions";
import { SEGMENTS, SEGMENT_LABEL, segmentOf, type LeadSegment } from "@/lib/admin/shared";
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

const STATUS_OPTIONS = (Object.keys(STATUS_TEXT) as LeadStatus[]).map((value) => ({
  value,
  label: STATUS_TEXT[value],
}));

/** Where an enquiry came from: ref, then utm, then referrer, then the page. */
function sourceOf(l: Lead): string {
  return (
    l.ref || l.utm_source || hostOf(l.referrer) || l.source_path || "direct"
  );
}

/** A malformed stored referrer must not take the whole list down. */
function hostOf(url: string | null | undefined): string {
  if (!url) return "";
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

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
  const adminPath = useAdminPath();
  const [segment, setSegment] = useState<LeadSegment | "all">("all");
  const shown = useMemo(
    () => (segment === "all" ? leads : leads.filter((l) => segmentOf(l) === segment)),
    [leads, segment],
  );

  const columns = useMemo<ColumnDef<Lead, unknown>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="min-w-0">
            <Link
              href={adminPath(`leads/${row.original.id}`)}
              className="block truncate font-semibold text-navy-text no-underline hover:text-amber-deep"
            >
              {row.original.name}
            </Link>
            <p className="truncate text-xs text-muted">{row.original.email}</p>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <span className="flex flex-wrap gap-1">
            <Pill tone={STATUS_TONE[row.original.status]}>
              {STATUS_TEXT[row.original.status]}
            </Pill>
            {row.original.kind === "booking" ? <Pill tone="navy">Call</Pill> : null}
          </span>
        ),
      },
      {
        id: "trade",
        accessorFn: (l) => l.trade ?? "",
        header: "Business",
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="truncate text-ink">{row.original.trade ?? "—"}</p>
            {row.original.town ? (
              <p className="truncate text-xs text-muted">{row.original.town}</p>
            ) : null}
          </div>
        ),
      },
      {
        id: "source",
        accessorFn: (l) => sourceOf(l),
        header: "Source",
        cell: ({ row }) => (
          <span className="text-xs text-muted">{sourceOf(row.original)}</span>
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
          <div className="flex items-center justify-end gap-3 whitespace-nowrap">
            <Link
              href={
                row.original.client_id
                  ? adminPath(`clients/${row.original.client_id}`)
                  : `${adminPath("clients/new")}?lead=${row.original.id}`
              }
              className="text-sm font-bold text-navy-text no-underline hover:text-amber-deep"
            >
              {row.original.client_id ? "View client" : "Convert"} →
            </Link>
            <DeleteButton
              action={deleteLead}
              id={row.original.id}
              what={row.original.name}
              compact
            />
          </div>
        ),
      },
    ],
    [adminPath],
  );

  return (
    <DataTable
      columns={columns}
      data={shown}
      getRowId={(l) => l.id}
      toolbar={
        <div className="no-scrollbar -mx-4 order-last flex w-[calc(100%+2rem)] gap-2 overflow-x-auto px-4 md:order-none md:mx-0 md:w-auto md:px-0">
          {(["all", ...SEGMENTS] as const).map((key) => {
            const n = key === "all" ? leads.length : leads.filter((l) => segmentOf(l) === key).length;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={segment === key}
                onClick={() => setSegment(key)}
                className={cn(
                  "min-h-11 shrink-0 rounded-full border px-3.5 text-sm font-semibold transition",
                  segment === key
                    ? "border-amber bg-amber text-on-amber"
                    : "border-edge bg-surface text-muted hover:border-navy",
                )}
              >
                {key === "all" ? "All" : SEGMENT_LABEL[key]} {n}
              </button>
            );
          })}
        </div>
      }
      searchPlaceholder="Search name, email, message…"
      emptyTitle="No leads here"
      emptyBody="Enquiries from the website arrive here. You can also add one by hand."
      csv={{
        filename: `leads-${new Date().toISOString().slice(0, 10)}.csv`,
        columns: [
          { key: "name", header: "Name" },
          { key: "email", header: "Email" },
          { key: "phone", header: "Phone" },
          { key: "segment", header: "Segment" },
          { key: "trade", header: "Business" },
          { key: "town", header: "Town" },
          { key: "website", header: "Current website" },
          { key: "source", header: "Source" },
          { key: "landing", header: "First page" },
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
          segment: SEGMENT_LABEL[segmentOf(l)],
          trade: l.trade ?? "",
          town: l.town ?? "",
          website: l.current_website ?? "",
          source: sourceOf(l),
          landing: l.landing_page ?? l.source_path ?? "",
          status: STATUS_TEXT[l.status],
          topic: l.topic ?? "",
          budget: l.budget ?? "",
          timeline: l.timeline ?? "",
          message: l.message ?? "",
          received: new Date(l.created_at).toLocaleDateString("en-GB"),
        }),
      }}
      renderCard={(l) => (
        <div className="rounded-xl border border-edge bg-surface p-4">
          <div className="flex items-start justify-between gap-3">
            <Link
              href={adminPath(`leads/${l.id}`)}
              className="min-w-0 truncate text-lg font-bold text-navy-text no-underline"
            >
              {l.name}
            </Link>
            <Pill tone={STATUS_TONE[l.status]}>{STATUS_TEXT[l.status]}</Pill>
          </div>
          <p className="mt-1 text-sm text-muted">
            {[relativeDate(l.created_at), l.topic, l.trade, l.town, l.budget].filter(Boolean).join(" · ")}
          </p>
          {l.message ? <p className="mt-2 line-clamp-2 text-sm text-ink">{l.message}</p> : null}
          <div className="mt-3 grid grid-cols-3 gap-2">
            <a href={l.phone ? `tel:${l.phone}` : `mailto:${l.email}`} className={actionClass(true)}>
              {l.phone ? "Call" : "Email"}
            </a>
            {l.phone ? (
              <a href={`mailto:${l.email}`} className={actionClass()}>Email</a>
            ) : (
              <span />
            )}
            <Link href={adminPath(`leads/${l.id}`)} className={actionClass()}>Open</Link>
          </div>
          <div className="mt-2 grid grid-cols-[1fr_auto] items-center gap-3">
            <QuickSelect
              action={updateLeadStatus}
              id={l.id}
              name="status"
              label={`Status for ${l.name}`}
              value={l.status}
              options={STATUS_OPTIONS}
            />
            <DeleteButton action={deleteLead} id={l.id} what={l.name} compact />
          </div>
        </div>
      )}
    />
  );
}
