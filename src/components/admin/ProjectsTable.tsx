"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/admin/DataTable";
import { Pill, formatDate } from "@/components/admin/ui";
import { useAdminPath } from "@/components/admin/AdminPathProvider";
import {
  STAGE_LABEL,
  formatMoney,
  type ProjectWithClient,
} from "@/lib/admin/shared";
import type { ProjectStage } from "@/lib/db/types";

const STAGE_TONE: Record<
  ProjectStage,
  "neutral" | "navy" | "amber" | "success" | "danger"
> = {
  brief: "amber",
  design: "navy",
  build: "navy",
  review: "navy",
  live: "success",
  on_hold: "neutral",
  cancelled: "neutral",
};

export function ProjectsTable({ projects }: { projects: ProjectWithClient[] }) {
  const adminPath = useAdminPath();

  const columns = useMemo<ColumnDef<ProjectWithClient, unknown>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Project",
        cell: ({ row }) => (
          <Link
            href={adminPath(`projects/${row.original.id}`)}
            className="font-semibold text-navy-text no-underline hover:text-amber-deep"
          >
            {row.original.title}
          </Link>
        ),
      },
      {
        id: "client",
        accessorFn: (p) => p.client?.business_name ?? "",
        header: "Client",
        cell: ({ row }) => (
          <span className="text-muted">
            {row.original.client?.business_name ?? "—"}
          </span>
        ),
      },
      {
        accessorKey: "stage",
        header: "Stage",
        cell: ({ row }) => (
          <Pill tone={STAGE_TONE[row.original.stage]}>
            {STAGE_LABEL[row.original.stage]}
          </Pill>
        ),
      },
      {
        accessorKey: "agreed_price",
        header: "Price",
        cell: ({ row }) => (
          <span className="whitespace-nowrap tabular-nums text-ink">
            {row.original.agreed_price === null
              ? "—"
              : formatMoney(Number(row.original.agreed_price))}
          </span>
        ),
      },
      {
        accessorKey: "awaiting_client",
        header: "Waiting on",
        cell: ({ row }) =>
          row.original.awaiting_client ? (
            <span className="text-amber-deep">{row.original.awaiting_client}</span>
          ) : (
            <span className="text-muted">—</span>
          ),
      },
      {
        accessorKey: "target_date",
        header: "Target",
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted">
            {formatDate(row.original.target_date)}
          </span>
        ),
      },
    ],
    [adminPath],
  );

  return (
    <DataTable
      columns={columns}
      data={projects}
      getRowId={(p) => p.id}
      searchPlaceholder="Search project or client…"
      emptyTitle="No projects here"
      emptyBody="Projects appear once you start one for a client."
      csv={{
        filename: `projects-${new Date().toISOString().slice(0, 10)}.csv`,
        columns: [
          { key: "title", header: "Project" },
          { key: "client", header: "Client" },
          { key: "stage", header: "Stage" },
          { key: "price", header: "Agreed price" },
          { key: "waiting", header: "Waiting on client" },
          { key: "target", header: "Target date" },
          { key: "live", header: "Live URL" },
        ],
        map: (p) => ({
          title: p.title,
          client: p.client?.business_name ?? "",
          stage: STAGE_LABEL[p.stage],
          price: p.agreed_price === null ? "" : Number(p.agreed_price).toFixed(2),
          waiting: p.awaiting_client ?? "",
          target: p.target_date
            ? new Date(p.target_date).toLocaleDateString("en-GB")
            : "",
          live: p.live_url ?? "",
        }),
      }}
      renderCard={(p) => (
        <Link
          href={adminPath(`projects/${p.id}`)}
          className="block rounded-lg border-2 border-edge bg-surface p-4 no-underline"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="min-w-0 truncate font-bold text-navy-text">{p.title}</p>
            <Pill tone={STAGE_TONE[p.stage]}>{STAGE_LABEL[p.stage]}</Pill>
          </div>
          <p className="mt-1 truncate text-sm text-muted">
            {p.client?.business_name ?? "No client"}
            {p.agreed_price !== null
              ? ` · ${formatMoney(Number(p.agreed_price))}`
              : ""}
          </p>
          {p.awaiting_client ? (
            <p className="mt-2 text-sm text-amber-deep">
              Waiting on client: {p.awaiting_client}
            </p>
          ) : null}
        </Link>
      )}
    />
  );
}
