import type { ReactNode } from "react";
import { signOut } from "@/app/(admin)/[adminPath]/actions";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Brand, MobileNav, SidebarNav } from "@/components/admin/Sidebar";
import type { NavKey } from "@/lib/admin/nav";

/**
 * The admin chrome: a fixed navy rail, a topbar, and the page beside them.
 *
 * This replaces a horizontal strip of seven equal tabs, which gave no sense of
 * structure and pushed the page content down on every screen. A rail keeps the
 * whole map visible without competing with the page, and leaves the top of the
 * content area for the page's own heading and actions.
 */
export function AdminShell({
  email,
  current,
  counts,
  children,
}: {
  email: string;
  current: NavKey;
  counts?: Partial<Record<NavKey, number>>;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh">
      <a
        href="#admin-main"
        className="sr-only z-50 rounded-md bg-navy px-3 py-1.5 text-sm text-white focus:not-sr-only focus:absolute focus:top-3 focus:left-3"
      >
        Skip to content
      </a>

      <aside className="hidden w-60 shrink-0 flex-col bg-navy-deep md:flex">
        <div className="flex h-14 shrink-0 items-center border-b border-white/10 px-4">
          <Brand />
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarNav current={current} counts={counts} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b-2 border-edge bg-surface px-4 md:px-6">
          <MobileNav current={current} counts={counts} />

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden text-sm text-muted sm:inline">{email}</span>
            <ThemeToggle />
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-md border-2 border-edge px-3 py-1.5 text-sm font-bold text-muted transition hover:border-navy hover:text-navy-text"
              >
                Sign out
              </button>
            </form>
          </div>
        </header>

        <main id="admin-main" className="flex-1 px-4 py-6 md:px-6">
          <div className="mx-auto max-w-[1200px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
