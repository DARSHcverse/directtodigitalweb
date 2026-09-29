import Link from "next/link";
import { requireOwner } from "@/lib/admin/auth";
import { adminPath } from "@/lib/admin/paths";
import { listLeads, countByStatus, STATUS_LABEL, LEAD_STATUSES } from "@/lib/admin/leads";
import { signOut } from "@/app/(admin)/[adminPath]/actions";
import { LeadCard } from "@/components/admin/LeadCard";
import { cn } from "@/lib/cn";
import type { LeadStatus } from "@/lib/db/types";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const owner = await requireOwner();
  const { status } = await searchParams;

  const filter = (
    LEAD_STATUSES.includes(status as LeadStatus) ? status : "all"
  ) as LeadStatus | "all";

  const [leads, counts] = await Promise.all([
    listLeads(filter),
    countByStatus(),
  ]);

  const tabs: Array<{ key: LeadStatus | "all"; label: string }> = [
    { key: "all", label: "All" },
    ...LEAD_STATUSES.map((s) => ({ key: s, label: STATUS_LABEL[s] })),
  ];

  return (
    <div className="min-h-screen">
      <header className="border-b-2 border-navy bg-surface">
        <div className="mx-auto flex w-[94%] max-w-[1100px] items-center justify-between gap-4 py-4">
          <div>
            <p className="text-lg font-bold text-navy">
              Trade Web <span className="text-amber-deep">Co.</span>
            </p>
            <p className="text-xs text-muted">{owner.email}</p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="border-2 border-edge px-4 py-2 text-sm font-bold text-muted transition hover:border-navy hover:text-navy"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto w-[94%] max-w-[1100px] py-8">
        <h1 className="mb-1 text-3xl font-bold tracking-display text-navy">
          Leads
        </h1>
        <p className="mb-6 text-muted">
          {counts.all ?? 0} total ·{" "}
          <span className="font-semibold text-navy">{counts.new ?? 0} new</span>
        </p>

        <nav aria-label="Filter by status" className="mb-6 flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const active = filter === tab.key;
            const n = counts[tab.key] ?? 0;
            return (
              <Link
                key={tab.key}
                href={
                  tab.key === "all"
                    ? adminPath("leads")
                    : `${adminPath("leads")}?status=${tab.key}`
                }
                className={cn(
                  "border-2 px-4 py-2 text-sm font-semibold no-underline transition",
                  active
                    ? "border-navy bg-navy text-white"
                    : "border-edge text-muted hover:border-navy hover:text-navy",
                )}
              >
                {tab.label}
                <span className={cn("ml-2", active ? "text-white/70" : "text-muted")}>
                  {n}
                </span>
              </Link>
            );
          })}
        </nav>

        {leads.length === 0 ? (
          <div className="border-2 border-edge bg-surface p-10 text-center">
            <p className="text-lg font-bold text-navy">
              {filter === "all" ? "No leads yet" : `No ${filter} leads`}
            </p>
            <p className="mt-2 text-muted">
              {filter === "all"
                ? "Enquiries from the website will appear here as they arrive."
                : "Try another status filter."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {leads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
