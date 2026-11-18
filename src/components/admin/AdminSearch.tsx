"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { searchAdmin, type SearchResult } from "@/app/(admin)/[adminPath]/search-actions";
import { useAdminPath } from "@/components/admin/AdminPathProvider";
import { Sheet } from "@/components/admin/Sheet";
import { NAV_FLAT } from "@/lib/admin/nav";

const GROUPS: SearchResult["group"][] = ["Leads", "Clients", "Projects", "Invoices"];
const DEBOUNCE_MS = 220;

/** One search across leads, clients, projects and invoices. Cmd/Ctrl+K opens it. */
export function AdminSearch({ variant }: { variant: "icon" | "bar" }) {
  const adminPath = useAdminPath();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [busy, setBusy] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const latest = useRef(0);

  useEffect(() => {
    if (variant !== "bar") return;
    function onKey(e: globalThis.KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [variant]);

  function close() {
    window.clearTimeout(timer.current);
    latest.current += 1;
    setOpen(false);
    setQuery("");
    setResults([]);
    setBusy(false);
  }

  function change(value: string) {
    setQuery(value);
    window.clearTimeout(timer.current);
    const id = ++latest.current;
    if (value.trim().length < 2) {
      setResults([]);
      setBusy(false);
      return;
    }
    setBusy(true);
    timer.current = window.setTimeout(async () => {
      try {
        const found = await searchAdmin(value);
        // A slower, older answer must not replace a newer one.
        if (id === latest.current) setResults(found);
      } finally {
        if (id === latest.current) setBusy(false);
      }
    }, DEBOUNCE_MS);
  }

  function moveFocus(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const items = [
      ...e.currentTarget.querySelectorAll<HTMLElement>("input, a"),
    ];
    const at = items.indexOf(document.activeElement as HTMLElement);
    const next = items[at + (e.key === "ArrowDown" ? 1 : -1)];
    if (next) {
      e.preventDefault();
      next.focus();
    }
  }

  const row = "flex min-h-12 items-center justify-between gap-3 rounded-lg px-2 no-underline hover:bg-bg focus:bg-bg";
  const searching = query.trim().length >= 2;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search everything"
        className={
          variant === "icon"
            ? "grid size-11 place-items-center rounded-full bg-surface text-white"
            : "flex min-h-10 w-full max-w-md items-center gap-2 rounded-lg bg-bg px-3 text-sm text-muted transition hover:text-navy-text"
        }
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        {variant === "bar" ? (
          <>
            Search leads, clients, projects, invoices
            <kbd className="ml-auto font-mono text-xs">⌘K</kbd>
          </>
        ) : null}
      </button>

      <Sheet open={open} onClose={close} label="Search">
        <div onKeyDown={moveFocus}>
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(e) => change(e.target.value)}
            placeholder="Search everything"
            aria-label="Search everything"
            className="min-h-12 w-full rounded-lg border border-edge bg-bg px-3 text-base text-ink outline-none focus:border-navy"
          />
          <div className="mt-3 min-h-48" aria-live="polite">
            {!searching ? (
              <>
                <p className="mb-1 px-2 font-mono text-xs text-muted">Go to</p>
                {NAV_FLAT.map((item) => (
                  <Link key={item.key} href={adminPath(item.path)} onClick={close} className={`${row} font-semibold text-navy-text`}>
                    {item.label}
                  </Link>
                ))}
              </>
            ) : busy && results.length === 0 ? (
              <p className="p-2 text-sm text-muted">Searching…</p>
            ) : results.length === 0 ? (
              <p className="p-2 text-sm text-muted">Nothing found for “{query.trim()}”.</p>
            ) : (
              GROUPS.map((group) => {
                const items = results.filter((r) => r.group === group);
                if (items.length === 0) return null;
                return (
                  <section key={group} className="mb-2">
                    <h3 className="mb-1 px-2 font-mono text-xs font-medium text-muted">{group}</h3>
                    {items.map((r) => (
                      <Link key={r.href} href={r.href} onClick={close} className={row}>
                        <span className="truncate font-semibold text-navy-text">{r.title}</span>
                        <span className="shrink-0 text-sm text-muted">{r.detail}</span>
                      </Link>
                    ))}
                  </section>
                );
              })
            )}
          </div>
        </div>
      </Sheet>
    </>
  );
}
