"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, use, useState } from "react";
import { signOut } from "@/app/(admin)/[adminPath]/actions";
import { useAdminPath } from "@/components/admin/AdminPathProvider";
import { Sheet } from "@/components/admin/Sheet";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MOBILE_TABS, NAV, NAV_FLAT, QUICK_ADD, type NavKey } from "@/lib/admin/nav";
import type { NavCounts } from "@/lib/admin/badges";
import { cn } from "@/lib/cn";

type Counts = Promise<NavCounts>;

function Icon({ d, size = 18 }: { d: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
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

function Badge({ counts, item, className }: { counts: Counts; item: NavKey; className: string }) {
  const n = use(counts)[item];
  return n ? <span className={className}>{n}</span> : null;
}

/** The desktop rail. Numbers appear only where something is waiting on Shan. */
export function SidebarNav({ current, counts }: { current: NavKey; counts: Counts }) {
  const adminPath = useAdminPath();

  return (
    <nav aria-label="Admin" className="grid gap-5 px-3 py-4">
      {NAV.map((group) => (
        <div key={group.label}>
          {group.label === "Overview" ? null : (
            <p className="px-2.5 pb-1.5 font-mono text-xs text-muted">{group.label}</p>
          )}
          <ul className="grid gap-0.5">
            {group.items.map((item) => {
              const active = current === item.key;
              return (
                <li key={item.key}>
                  <Link
                    href={adminPath(item.path)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-10 items-center gap-2.5 rounded-lg px-2.5 text-[0.95rem] font-semibold no-underline transition",
                      active
                        ? "bg-white text-[#0f2a47]"
                        : "text-white/85 hover:translate-x-0.5 hover:bg-surface hover:text-white",
                    )}
                  >
                    <Icon d={item.icon} />
                    <span className="truncate">{item.label}</span>
                    <Suspense fallback={null}>
                      <Badge
                        counts={counts}
                        item={item.key}
                        className="ml-auto min-w-5 rounded-full bg-amber px-1.5 text-center text-xs leading-5 font-bold text-on-amber tabular-nums"
                      />
                    </Suspense>
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

export function Brand() {
  const adminPath = useAdminPath();
  return (
    <Link href={adminPath("dashboard")} aria-label="Admin home" className="block no-underline">
      <Image src="/TradeHorizontal-dark.png" alt="Trade Web Co" width={100} height={40} className="h-9 w-auto" />
    </Link>
  );
}

const sheetRow =
  "flex min-h-13 items-center gap-3 border-b border-edge px-1 font-semibold text-navy-text no-underline last:border-0";

/** The phone's bottom bar, with everything else tucked under More. */
export function MobileTabs({ current, counts }: { current: NavKey; counts: Counts }) {
  const adminPath = useAdminPath();
  const [more, setMore] = useState(false);
  const tabKeys = MOBILE_TABS.map((t) => t.key);
  const inMore = !tabKeys.includes(current);
  const extras = NAV_FLAT.filter((i) => !tabKeys.includes(i.key));
  const tabClass = (active: boolean) =>
    cn(
      "relative flex min-h-16 flex-col items-center justify-center gap-0.5 text-xs font-bold no-underline transition",
      active ? "text-navy-text" : "text-muted",
    );
  const marker = <span aria-hidden="true" className="absolute top-0 h-0.5 w-7 rounded-full bg-amber" />;

  return (
    <>
      <nav
        aria-label="Admin"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-edge bg-surface pb-[env(safe-area-inset-bottom)] md:hidden print:hidden"
      >
        {MOBILE_TABS.map((tab) => {
          const item = NAV_FLAT.find((i) => i.key === tab.key)!;
          const active = current === tab.key;
          return (
            <Link
              key={tab.key}
              href={adminPath(item.path)}
              aria-current={active ? "page" : undefined}
              className={tabClass(active)}
            >
              {active ? marker : null}
              <Icon d={item.icon} size={22} />
              {tab.label}
              <Suspense fallback={null}>
                <Badge
                  counts={counts}
                  item={tab.key}
                  className="absolute top-1.5 left-1/2 ml-1.5 min-w-4 rounded-full bg-amber px-1 text-center text-[0.68rem] leading-4 text-on-amber"
                />
              </Suspense>
            </Link>
          );
        })}
        <button type="button" onClick={() => setMore(true)} className={tabClass(inMore)}>
          {inMore ? marker : null}
          <Icon d="M5 12h.01M12 12h.01M19 12h.01" size={22} />
          More
        </button>
      </nav>

      <Sheet open={more} onClose={() => setMore(false)} label="More">
        <h2 className="mb-1 text-xl font-extrabold text-navy-text">More</h2>
        <div>
          {extras.map((item) => (
            <Link key={item.key} href={adminPath(item.path)} onClick={() => setMore(false)} className={sheetRow}>
              <Icon d={item.icon} size={20} />
              {item.label}
              <Suspense fallback={null}>
                <Badge
                  counts={counts}
                  item={item.key}
                  className="ml-auto min-w-5 rounded-full bg-amber px-1.5 text-center text-xs leading-5 font-bold text-on-amber"
                />
              </Suspense>
            </Link>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 border-t border-edge pt-3">
          <ThemeToggle />
          <form action={signOut}>
            <button type="submit" className="min-h-11 rounded-full border border-edge px-4 text-sm font-bold text-muted">
              Sign out
            </button>
          </form>
        </div>
      </Sheet>
    </>
  );
}

/** Add anything from anywhere: a floating button on phones, a pill on desktop. */
export function QuickAdd({ variant }: { variant: "fab" | "button" }) {
  const adminPath = useAdminPath();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Add new"
        className={
          variant === "fab"
            ? "lift fixed right-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-30 grid size-14 place-items-center rounded-full bg-amber text-3xl leading-none text-on-amber shadow-lg md:hidden print:hidden"
            : "lift inline-flex min-h-10 items-center rounded-full bg-amber px-4 text-sm font-extrabold text-on-amber"
        }
      >
        {variant === "fab" ? <span aria-hidden="true">+</span> : "+ New"}
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} label="Add new">
        <h2 className="mb-3 text-xl font-extrabold text-navy-text">Add new</h2>
        <div className="grid grid-cols-2 gap-2">
          {QUICK_ADD.map((item, i) => (
            <Link
              key={item.path}
              href={adminPath(item.path)}
              onClick={() => setOpen(false)}
              className={cn(
                "lift grid min-h-16 place-items-center rounded-xl font-bold no-underline",
                i === 0 ? "bg-navy text-white" : "bg-bg text-navy-text",
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </Sheet>
    </>
  );
}
