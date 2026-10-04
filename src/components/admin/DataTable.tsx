"use client";

import { useState, type ReactNode } from "react";
import {
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { cn } from "@/lib/cn";

/**
 * The admin list table.
 *
 * The lists were previously stacks of cards: readable, but with no way to sort
 * by value or date, no way to narrow by typing, and nothing to get the data
 * out. Those are the three things you actually want when chasing money or
 * looking something up, so they are built in here once rather than
 * reimplemented per screen.
 *
 * Filtering and sorting run on the client against an already-fetched page of
 * rows. At this scale — tens to low hundreds — that is instant and avoids a
 * round trip per keystroke. If a list ever outgrows that, the server already
 * supports a `q` parameter to narrow before it reaches here.
 *
 * On a phone the table collapses to the caller's `renderCard`, because a
 * horizontally scrolling table is unusable on the device most of this gets
 * read on.
 */

export type CsvSpec<T> = {
  filename: string;
  columns: { key: string; header: string }[];
  map: (row: T) => Record<string, unknown>;
};

function toCsv(rows: Record<string, unknown>[], columns: { key: string; header: string }[]) {
  const esc = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    // Quote whenever the value could otherwise break the row or the cell.
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const head = columns.map((c) => esc(c.header)).join(",");
  const body = rows.map((r) => columns.map((c) => esc(r[c.key])).join(",")).join("\n");
  return `${head}\n${body}`;
}

function downloadCsv(filename: string, csv: string) {
  // A BOM so Excel opens UTF-8 (pound signs, accented names) correctly rather
  // than mangling it.
  const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function DataTable<T>({
  columns,
  data,
  getRowId,
  searchPlaceholder = "Search…",
  renderCard,
  toolbar,
  csv,
  pageSize = 25,
  emptyTitle = "Nothing here yet",
  emptyBody,
}: {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  getRowId: (row: T) => string;
  searchPlaceholder?: string;
  /** Phone layout. Without it the table simply scrolls. */
  renderCard?: (row: T) => ReactNode;
  toolbar?: ReactNode;
  csv?: CsvSpec<T>;
  pageSize?: number;
  emptyTitle?: string;
  emptyBody?: string;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [showCols, setShowCols] = useState(false);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, columnVisibility },
    getRowId,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  const rows = table.getRowModel().rows;
  const total = table.getFilteredRowModel().rows.length;
  const pageCount = table.getPageCount();

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <svg
            viewBox="0 0 24 24"
            width="15"
            height="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="w-full rounded-md border-2 border-edge bg-surface py-2 pr-3 pl-9 text-sm text-ink outline-none transition focus:border-navy"
          />
        </div>

        {toolbar}

        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCols((v) => !v)}
              aria-expanded={showCols}
              className="rounded-md border-2 border-edge px-3 py-2 text-sm font-bold text-muted transition hover:border-navy hover:text-navy-text"
            >
              Columns
            </button>
            {showCols ? (
              <>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setShowCols(false)}
                  className="fixed inset-0 z-10 cursor-default"
                />
                <div className="absolute right-0 z-20 mt-1 w-52 rounded-lg border-2 border-edge bg-surface p-2 shadow-lg">
                  {table.getAllLeafColumns().map((col) => (
                    <label
                      key={col.id}
                      className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm text-ink hover:bg-bg"
                    >
                      <input
                        type="checkbox"
                        checked={col.getIsVisible()}
                        onChange={col.getToggleVisibilityHandler()}
                        className="accent-navy"
                      />
                      {typeof col.columnDef.header === "string"
                        ? col.columnDef.header
                        : col.id}
                    </label>
                  ))}
                </div>
              </>
            ) : null}
          </div>

          {csv ? (
            <button
              type="button"
              onClick={() =>
                downloadCsv(
                  csv.filename,
                  toCsv(
                    table.getFilteredRowModel().rows.map((r) => csv.map(r.original)),
                    csv.columns,
                  ),
                )
              }
              className="rounded-md border-2 border-edge px-3 py-2 text-sm font-bold text-muted transition hover:border-navy hover:text-navy-text"
            >
              Export
            </button>
          ) : null}
        </div>
      </div>

      {total === 0 ? (
        <div className="rounded-lg border-2 border-edge bg-surface p-10 text-center">
          <p className="text-lg font-bold text-navy-text">{emptyTitle}</p>
          {emptyBody ? (
            <p className="mx-auto mt-2 max-w-[420px] text-muted">{emptyBody}</p>
          ) : null}
        </div>
      ) : (
        <>
          {/* Phone: stacked cards. A wide table cannot be read on a phone. */}
          {renderCard ? (
            <ul className="grid gap-2 md:hidden">
              {rows.map((r) => (
                <li key={r.id}>{renderCard(r.original)}</li>
              ))}
            </ul>
          ) : null}

          <div
            className={cn(
              "overflow-x-auto rounded-lg border-2 border-edge bg-surface",
              renderCard && "hidden md:block",
            )}
          >
            <table className="w-full border-collapse text-sm">
              <thead>
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id} className="border-b-2 border-edge">
                    {hg.headers.map((h) => {
                      const sortable = h.column.getCanSort();
                      const dir = h.column.getIsSorted();
                      return (
                        <th
                          key={h.id}
                          scope="col"
                          aria-sort={
                            dir === "asc"
                              ? "ascending"
                              : dir === "desc"
                                ? "descending"
                                : undefined
                          }
                          className="px-3 py-2.5 text-left text-xs font-bold tracking-wide text-muted uppercase"
                        >
                          {sortable ? (
                            <button
                              type="button"
                              onClick={h.column.getToggleSortingHandler()}
                              className="inline-flex items-center gap-1 transition hover:text-navy-text"
                            >
                              {flexRender(h.column.columnDef.header, h.getContext())}
                              <span aria-hidden="true" className="text-[0.7em]">
                                {dir === "asc" ? "▲" : dir === "desc" ? "▼" : "↕"}
                              </span>
                            </button>
                          ) : (
                            flexRender(h.column.columnDef.header, h.getContext())
                          )}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-edge transition last:border-0 hover:bg-bg"
                  >
                    {r.getVisibleCells().map((c) => (
                      <td key={c.id} className="px-3 py-2.5 align-middle text-ink">
                        {flexRender(c.column.columnDef.cell, c.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-muted">
              {total} {total === 1 ? "row" : "rows"}
              {globalFilter ? ` matching “${globalFilter}”` : ""}
            </p>
            {pageCount > 1 ? (
              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="rounded-md border-2 border-edge px-3 py-1.5 text-sm font-bold text-muted transition hover:border-navy hover:text-navy-text disabled:pointer-events-none disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-sm text-muted tabular-nums">
                  {table.getState().pagination.pageIndex + 1} / {pageCount}
                </span>
                <button
                  type="button"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="rounded-md border-2 border-edge px-3 py-1.5 text-sm font-bold text-muted transition hover:border-navy hover:text-navy-text disabled:pointer-events-none disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
