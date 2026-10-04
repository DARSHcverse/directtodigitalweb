"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/admin/DataTable";
import { Pill, formatDate } from "@/components/admin/ui";
import { useAdminPath } from "@/components/admin/AdminPathProvider";
import type { ClientWithCounts } from "@/lib/admin/shared";

export function ClientsTable({ clients }: { clients: ClientWithCounts[] }) {
  const adminPath = useAdminPath();

  const columns = useMemo<ColumnDef<ClientWithCounts, unknown>[]>(
    () => [
      {
        accessorKey: "business_name",
        header: "Business",
        cell: ({ row }) => (
          <Link
            href={adminPath(`clients/${row.original.id}`)}
            className="font-semibold text-navy-text no-underline hover:text-amber-deep"
          >
            {row.original.business_name}
          </Link>
        ),
      },
      {
        accessorKey: "contact_name",
        header: "Contact",
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="truncate text-ink">{row.original.contact_name}</p>
            <p className="truncate text-xs text-muted">{row.original.email}</p>
          </div>
        ),
      },
      {
        accessorKey: "trade",
        header: "Trade",
        cell: ({ row }) => (
          <span className="text-muted">{row.original.trade ?? "—"}</span>
        ),
      },
      {
        accessorKey: "project_count",
        header: "Projects",
        cell: ({ row }) => (
          <span className="tabular-nums text-ink">
            {row.original.project_count}
          </span>
        ),
      },
      {
        accessorKey: "active_project",
        header: "Active",
        cell: ({ row }) => (
          <span className="text-muted">{row.original.active_project ?? "—"}</span>
        ),
      },
      {
        accessorKey: "portal_enabled",
        header: "Portal",
        cell: ({ row }) =>
          row.original.portal_enabled ? (
            <Pill tone="success">On</Pill>
          ) : (
            <Pill tone="neutral">Off</Pill>
          ),
      },
      {
        accessorKey: "created_at",
        header: "Added",
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted">
            {formatDate(row.original.created_at)}
          </span>
        ),
      },
    ],
    [adminPath],
  );

  return (
    <DataTable
      columns={columns}
      data={clients}
      getRowId={(c) => c.id}
      searchPlaceholder="Search business, contact, email, trade…"
      emptyTitle="No clients yet"
      emptyBody="Convert a lead, or add a client by hand."
      csv={{
        filename: `clients-${new Date().toISOString().slice(0, 10)}.csv`,
        columns: [
          { key: "business", header: "Business" },
          { key: "contact", header: "Contact" },
          { key: "email", header: "Email" },
          { key: "phone", header: "Phone" },
          { key: "trade", header: "Trade" },
          { key: "projects", header: "Projects" },
          { key: "portal", header: "Portal" },
          { key: "added", header: "Added" },
        ],
        map: (c) => ({
          business: c.business_name,
          contact: c.contact_name,
          email: c.email,
          phone: c.phone ?? "",
          trade: c.trade ?? "",
          projects: c.project_count,
          portal: c.portal_enabled ? "On" : "Off",
          added: new Date(c.created_at).toLocaleDateString("en-GB"),
        }),
      }}
      renderCard={(c) => (
        <Link
          href={adminPath(`clients/${c.id}`)}
          className="block rounded-lg border-2 border-edge bg-surface p-4 no-underline"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="min-w-0 truncate font-bold text-navy-text">
              {c.business_name}
            </p>
            {c.portal_enabled ? <Pill tone="success">Portal</Pill> : null}
          </div>
          <p className="mt-1 truncate text-sm text-muted">
            {c.contact_name} · {c.email}
          </p>
          <p className="mt-2 text-sm text-muted">
            {c.trade ?? "No trade set"} ·{" "}
            {c.project_count === 1 ? "1 project" : `${c.project_count} projects`}
            {c.active_project ? ` · ${c.active_project}` : ""}
          </p>
        </Link>
      )}
    />
  );
}
