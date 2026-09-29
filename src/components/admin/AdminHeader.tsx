import Link from "next/link";
import { adminPath } from "@/lib/admin/paths";
import { signOut } from "@/app/(admin)/[adminPath]/actions";
import { cn } from "@/lib/cn";

export function AdminHeader({
  email,
  current,
}: {
  email: string;
  current: "leads" | "clients" | "projects" | "account";
}) {
  const tabs = [
    { key: "leads" as const, label: "Leads", href: adminPath("leads") },
    { key: "clients" as const, label: "Clients", href: adminPath("clients") },
    { key: "projects" as const, label: "Projects", href: adminPath("projects") },
    { key: "account" as const, label: "Account", href: adminPath("account") },
  ];

  return (
    <header className="border-b-2 border-navy bg-surface">
      <div className="mx-auto flex w-[94%] max-w-[1100px] flex-wrap items-center justify-between gap-4 py-4">
        <div>
          <p className="text-lg font-bold text-navy">
            Trade Web <span className="text-amber-deep">Co.</span>
          </p>
          <p className="text-xs text-muted">{email}</p>
        </div>

        <div className="flex items-center gap-2">
          <nav aria-label="Admin" className="flex gap-2">
            {tabs.map((tab) => (
              <Link
                key={tab.key}
                href={tab.href}
                aria-current={current === tab.key ? "page" : undefined}
                className={cn(
                  "border-2 px-4 py-2 text-sm font-bold no-underline transition",
                  current === tab.key
                    ? "border-navy bg-navy text-white"
                    : "border-edge text-muted hover:border-navy hover:text-navy",
                )}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
          <form action={signOut}>
            <button
              type="submit"
              className="border-2 border-edge px-4 py-2 text-sm font-bold text-muted transition hover:border-navy hover:text-navy"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
