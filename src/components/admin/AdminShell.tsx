import type { ReactNode } from "react";
import { signOut } from "@/app/(admin)/[adminPath]/actions";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AdminSearch } from "@/components/admin/AdminSearch";
import { Brand, MobileTabs, QuickAdd, SidebarNav } from "@/components/admin/Sidebar";
import { getNavCounts } from "@/lib/admin/badges";
import type { NavKey } from "@/lib/admin/nav";

/**
 * The admin chrome. Desktop gets a navy rail and a working top bar; phones get
 * an app layout, with daily screens on a bottom bar within thumb reach.
 *
 * Counts are handed over as a promise, so the page never waits for them.
 */
export function AdminShell({
  email,
  current,
  children,
}: {
  email: string;
  current: NavKey;
  children: ReactNode;
}) {
  const counts = getNavCounts();

  return (
    <div className="flex min-h-dvh">
      <a
        href="#admin-main"
        className="sr-only z-50 rounded-md bg-navy px-3 py-1.5 text-sm text-white focus:not-sr-only focus:absolute focus:top-3 focus:left-3"
      >
        Skip to content
      </a>

      <aside className="surface-navy sticky top-0 hidden h-dvh w-58 shrink-0 flex-col md:flex print:hidden">
        <div className="flex h-16 shrink-0 items-center px-5">
          <Brand />
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarNav current={current} counts={counts} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="surface-navy sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between px-4 md:hidden print:hidden">
          <Brand />
          <AdminSearch variant="icon" />
        </header>

        <header className="sticky top-0 z-30 hidden h-16 shrink-0 items-center gap-3 border-b border-edge bg-surface px-6 md:flex print:hidden">
          <AdminSearch variant="bar" />
          <div className="ml-auto flex items-center gap-2">
            <QuickAdd variant="button" />
            <ThemeToggle />
            <span className="hidden max-w-44 truncate text-sm text-muted xl:inline">{email}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="min-h-10 rounded-full border border-edge px-4 text-sm font-bold text-muted transition hover:border-navy hover:text-navy-text"
              >
                Sign out
              </button>
            </form>
          </div>
        </header>

        <main
          id="admin-main"
          className="flex-1 px-4 pt-5 pb-[calc(6.5rem+env(safe-area-inset-bottom))] md:px-6 md:py-7 print:p-0"
        >
          <div key={current} className="admin-enter mx-auto max-w-[1200px]">
            {children}
          </div>
        </main>
      </div>

      <QuickAdd variant="fab" />
      <MobileTabs current={current} counts={counts} />
    </div>
  );
}
