"use client";

import Link from "next/link";
import { useState } from "react";
import { NAV, type NavKey } from "@/lib/admin/nav";
import { useAdminPath } from "@/components/admin/AdminPathProvider";
import { cn } from "@/lib/cn";

function Icon({ d }: { d: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d={d} />
    </svg>
  );
}

/**
 * The nav itself, shared by the fixed desktop rail and the mobile drawer so
 * there is only one list to keep in step.
 *
 * Counts are optional and only passed where a number means "this needs you"
 * — unactioned leads, unpaid invoices. A count on every item would be noise.
 */
export function SidebarNav({
  current,
  counts,
  onNavigate,
}: {
  current: NavKey;
  counts?: Partial<Record<NavKey, number>>;
  onNavigate?: () => void;
}) {
  const adminPath = useAdminPath();

  return (
    <nav aria-label="Admin" className="grid gap-5 px-3 py-4">
      {NAV.map((group) => (
        <div key={group.label}>
          <p className="px-2 pb-1.5 text-[0.65rem] font-bold tracking-[0.16em] text-white/40 uppercase">
            {group.label}
          </p>
          <ul className="grid gap-0.5">
            {group.items.map((item) => {
              const active = current === item.key;
              const n = counts?.[item.key];
              return (
                <li key={item.key}>
                  <Link
                    href={adminPath(item.path)}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm no-underline transition",
                      active
                        ? "bg-white/15 font-semibold text-white"
                        : "text-white/70 hover:bg-white/8 hover:text-white",
                    )}
                  >
                    <Icon d={item.icon} />
                    <span className="truncate">{item.label}</span>
                    {n ? (
                      <span
                        className={cn(
                          "ml-auto rounded-full px-1.5 py-0.5 text-[0.65rem] font-bold tabular-nums",
                          active
                            ? "bg-white/25 text-white"
                            : "bg-amber text-navy-deep",
                        )}
                      >
                        {n}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function Brand({ onNavigate }: { onNavigate?: () => void }) {
  const adminPath = useAdminPath();

  return (
    <Link
      href={adminPath("dashboard")}
      onClick={onNavigate}
      className="flex items-center gap-2 px-1 no-underline"
    >
      <span className="flex flex-col leading-none">
        <span className="text-sm font-bold tracking-tight text-white">
          Trade Web <span className="text-amber">Co.</span>
        </span>
        <span className="mt-0.5 text-[0.6rem] font-bold tracking-[0.18em] text-white/45 uppercase">
          Admin
        </span>
      </span>
    </Link>
  );
}

/**
 * Mobile navigation. The desktop rail is always visible, so on a phone the
 * same list opens as a drawer from the menu button in the topbar.
 */
export function MobileNav({
  current,
  counts,
}: {
  current: NavKey;
  counts?: Partial<Record<NavKey, number>>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        aria-expanded={open}
        className="rounded-md border-2 border-edge p-2 text-navy-text transition hover:border-navy md:hidden"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 7h16M4 12h16M4 17h16"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-navy-deep/60"
          />
          <div className="absolute inset-y-0 left-0 w-[17rem] overflow-y-auto bg-navy-deep">
            <div className="flex h-14 items-center justify-between border-b border-white/10 px-4">
              <Brand onNavigate={() => setOpen(false)} />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
                className="rounded p-1 text-white/70 hover:text-white"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <SidebarNav
              current={current}
              counts={counts}
              onNavigate={() => setOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
