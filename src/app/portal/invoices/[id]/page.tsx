import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePortalClient } from "@/lib/portal/auth";
import { serviceClient } from "@/lib/db/server";
import { getSettings } from "@/lib/admin/settings";
import { PortalHeader } from "@/components/portal/PortalHeader";
import { InvoiceDocument } from "@/components/admin/InvoiceDocument";
import { PrintButton } from "@/components/admin/PrintButton";
import type { Invoice, InvoiceLine } from "@/lib/db/types";

/** Reads the session cookie, so it can never be static. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Invoice",
  robots: { index: false, follow: false },
};

export default async function PortalInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const client = await requirePortalClient();
  const { id } = await params;

  const db = serviceClient();

  // Scoped to this client, and drafts are excluded — an unissued invoice is
  // a working document, not something the client should ever see.
  const { data: invoice } = await db
    .from("invoices")
    .select("*")
    .eq("id", id)
    .eq("client_id", client.id)
    .is("deleted_at", null)
    .neq("status", "draft")
    .maybeSingle();

  if (!invoice) notFound();

  const [{ data: lines }, settings] = await Promise.all([
    db.from("invoice_lines").select("*").eq("invoice_id", id).order("position"),
    getSettings(),
  ]);

  return (
    <div className="min-h-screen">
      <div className="print:hidden">
        <PortalHeader businessName={client.business_name} />
      </div>

      <main className="mx-auto w-[94%] max-w-[900px] py-8 print:w-full print:max-w-none print:py-0">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
          <Link
            href="/portal"
            className="text-sm font-semibold text-muted no-underline hover:text-navy"
          >
            ← Back
          </Link>
          <PrintButton />
        </div>

        <InvoiceDocument
          invoice={invoice as Invoice}
          lines={(lines ?? []) as InvoiceLine[]}
          client={client}
          settings={settings}
        />
      </main>
    </div>
  );
}
