import Link from "next/link";
import { requireOwner } from "@/lib/admin/auth";
import { adminPath } from "@/lib/admin/paths";
import { invoiceTargets } from "@/lib/admin/invoices";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { InvoiceForm } from "@/components/admin/InvoiceForm";

export default async function NewInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ client?: string }>;
}) {
  const owner = await requireOwner();
  const { client } = await searchParams;
  const { clients, projects } = await invoiceTargets();

  return (
    <div className="min-h-screen">
      <AdminHeader email={owner.email} current="invoices" />

      <main className="mx-auto w-[94%] max-w-[900px] py-8">
        <Link
          href={adminPath("invoices")}
          className="text-sm font-semibold text-muted no-underline hover:text-navy"
        >
          ← Invoices
        </Link>

        <h1 className="mt-3 mb-1 text-3xl font-bold tracking-display text-navy">
          New invoice
        </h1>
        <p className="mb-8 text-muted">
          Saved as a draft. It gets its number when you issue it, and cannot be
          edited after that.
        </p>

        {clients.length === 0 ? (
          <div className="border-2 border-edge bg-surface p-8 text-center">
            <p className="font-bold text-navy">Add a client first</p>
            <Link
              href={adminPath("clients/new")}
              className="mt-5 inline-block bg-amber px-5 py-3 text-sm font-bold text-navy-deep no-underline transition hover:bg-amber-deep"
            >
              Add a client
            </Link>
          </div>
        ) : (
          <div className="border-2 border-edge bg-surface p-6">
            <InvoiceForm
              clients={clients}
              projects={projects}
              presetClientId={client}
            />
          </div>
        )}
      </main>
    </div>
  );
}
