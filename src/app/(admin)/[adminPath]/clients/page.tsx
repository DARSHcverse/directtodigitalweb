import Link from "next/link";
import { requireOwner } from "@/lib/admin/auth";
import { adminPath } from "@/lib/admin/paths";
import { listClients } from "@/lib/admin/clients";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SearchBox } from "@/components/admin/SearchBox";
import { PageHeader, EmptyState } from "@/components/admin/ui";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const owner = await requireOwner();
  const { q } = await searchParams;
  const clients = await listClients(q);

  return (
    <div className="min-h-screen">
      <AdminHeader email={owner.email} current="clients" />

      <main className="mx-auto w-[94%] max-w-[1100px] py-8">
        <PageHeader
          title="Clients"
          subtitle={`${clients.length} ${clients.length === 1 ? "client" : "clients"}`}
          action={{ href: adminPath("clients/new"), label: "Add client" }}
        />

        <SearchBox
          basePath={adminPath("clients")}
          placeholder="Search by business, contact, email or trade…"
        />

        {clients.length === 0 ? (
          <div className="border-2 border-edge rounded-lg bg-surface p-10 text-center">
            <p className="text-lg font-bold text-navy-text">No clients yet</p>
            <p className="mt-2 text-muted">
              Convert a won lead, or add a client directly.
            </p>
            <Link
              href={adminPath("clients/new")}
              className="mt-6 inline-block bg-amber rounded-md px-5 py-3 text-sm font-bold text-on-amber no-underline transition hover:bg-amber-deep"
            >
              Add your first client
            </Link>
          </div>
        ) : (
          <div className="grid gap-3">
            {clients.map((c) => (
              <Link
                key={c.id}
                href={adminPath(`clients/${c.id}`)}
                className="flex flex-wrap items-center justify-between gap-4 border-2 border-edge rounded-lg bg-surface p-5 no-underline transition hover:border-navy"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-bold text-navy-text">
                      {c.business_name}
                    </h2>
                    {c.trade ? (
                      <span className="border border-edge rounded-lg px-2 py-0.5 text-xs text-muted">
                        {c.trade}
                      </span>
                    ) : null}
                    {c.portal_enabled ? (
                      <span className="bg-success px-2 py-0.5 text-xs font-bold text-white uppercase">
                        Portal
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {c.contact_name} · {c.email}
                  </p>
                </div>

                <div className="text-right text-sm">
                  <p className="font-semibold text-navy-text">
                    {c.project_count}{" "}
                    {c.project_count === 1 ? "project" : "projects"}
                  </p>
                  {c.active_project ? (
                    <p className="text-muted">{c.active_project}</p>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
