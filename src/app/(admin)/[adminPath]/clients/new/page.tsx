import Link from "next/link";
import { requireOwner } from "@/lib/admin/auth";
import { adminPath } from "@/lib/admin/paths";
import { unconvertedLeads } from "@/lib/admin/clients";
import { serviceClient } from "@/lib/db/server";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ClientForm } from "@/components/admin/ClientForm";
import type { Lead } from "@/lib/db/types";

export default async function NewClientPage({
  searchParams,
}: {
  searchParams: Promise<{ lead?: string }>;
}) {
  const owner = await requireOwner();
  const { lead: leadId } = await searchParams;

  let fromLead: Lead | undefined;
  if (leadId) {
    const { data } = await serviceClient()
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .maybeSingle();
    fromLead = (data as Lead) ?? undefined;
  }

  const leads = fromLead ? [] : await unconvertedLeads();

  return (
    <div className="min-h-screen">
      <AdminHeader email={owner.email} current="clients" />

      <main className="mx-auto w-[94%] max-w-[900px] py-8">
        <Link
          href={adminPath("clients")}
          className="text-sm font-semibold text-muted no-underline hover:text-navy-text"
        >
          ← Clients
        </Link>

        <h1 className="mt-3 mb-1 text-3xl font-bold tracking-display text-navy-text">
          {fromLead ? "Convert lead to client" : "Add client"}
        </h1>
        <p className="mb-8 text-muted">
          {fromLead
            ? `Details prefilled from ${fromLead.name}'s enquiry.`
            : "Create a client record, then add their project."}
        </p>

        {leads.length > 0 ? (
          <section className="mb-8 border-l-4 border-amber bg-surface p-5">
            <p className="mb-3 text-sm font-bold text-navy-text">
              Convert an existing lead instead?
            </p>
            <div className="flex flex-wrap gap-2">
              {leads.slice(0, 6).map((l) => (
                <Link
                  key={l.id}
                  href={`${adminPath("clients/new")}?lead=${l.id}`}
                  className="border border-edge rounded-lg px-3 py-1.5 text-sm text-navy-text no-underline transition hover:border-navy"
                >
                  {l.name}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <div className="border-2 border-edge rounded-lg bg-surface p-6">
          <ClientForm fromLead={fromLead} />
        </div>
      </main>
    </div>
  );
}
