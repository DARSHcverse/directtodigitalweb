import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOwner } from "@/lib/admin/auth";
import { adminPath } from "@/lib/admin/paths";
import {
  getInvoice,
  invoiceTargets,
  displayStatus,
  formatDate,
  STATUS_LABEL,
} from "@/lib/admin/invoices";
import { getSettings, missingForInvoicing } from "@/lib/admin/settings";
import {
  issueInvoice,
  sendInvoice,
  markPaid,
  cancelInvoice,
} from "@/app/(admin)/[adminPath]/invoices/actions";
import { AdminShell } from "@/components/admin/AdminShell";
import { InvoiceForm } from "@/components/admin/InvoiceForm";
import { InvoiceDocument } from "@/components/admin/InvoiceDocument";
import { PrintButton } from "@/components/admin/PrintButton";

export default async function InvoiceDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ send?: string }>;
}) {
  const owner = await requireOwner();
  const { id } = await params;
  const { send } = await searchParams;

  const result = await getInvoice(id);
  if (!result) notFound();

  const { invoice, client, lines } = result;
  const [settings, { clients, projects }] = await Promise.all([
    getSettings(),
    invoiceTargets(),
  ]);

  const isDraft = invoice.status === "draft";
  const missing = missingForInvoicing(settings);
  const shown = displayStatus(invoice);

  return (
    <AdminShell email={owner.email} current="invoices">
<div className="mx-auto max-w-[900px] print:max-w-none">
        <div className="print:hidden">
          <Link
            href={adminPath("invoices")}
            className="text-sm font-semibold text-muted no-underline hover:text-navy-text"
          >
            ← Invoices
          </Link>

          <div className="mt-3 mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-display text-navy-text">
                {invoice.invoice_number ?? "Draft invoice"}
              </h1>
              <p className="text-muted">
                {STATUS_LABEL[shown]}
                {client ? ` · ${client.business_name}` : ""}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {isDraft && missing.length === 0 ? (
                <form action={issueInvoice}>
                  <input type="hidden" name="id" value={invoice.id} />
                  <button
                    type="submit"
                    className="bg-amber rounded-md px-5 py-2.5 text-sm font-bold text-on-amber transition hover:bg-amber-deep"
                  >
                    Issue invoice
                  </button>
                </form>
              ) : null}

              {invoice.status === "issued" ? (
                <form action={markPaid}>
                  <input type="hidden" name="id" value={invoice.id} />
                  <button
                    type="submit"
                    className="bg-success px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-110"
                  >
                    Mark paid
                  </button>
                </form>
              ) : null}

              {invoice.status === "paid" ? (
                <form action={markPaid}>
                  <input type="hidden" name="id" value={invoice.id} />
                  <input type="hidden" name="undo" value="1" />
                  <button
                    type="submit"
                    className="border-2 border-edge rounded-lg px-5 py-2.5 text-sm font-bold text-muted transition hover:border-navy hover:text-navy-text"
                  >
                    Mark unpaid
                  </button>
                </form>
              ) : null}

              {/* Sending is what the client actually needs; the PDF is for
                  records. Issuing already emails it, so after that this reads
                  as a resend. */}
              {!isDraft && invoice.status !== "cancelled" ? (
                <form action={sendInvoice}>
                  <input type="hidden" name="id" value={invoice.id} />
                  <button
                    type="submit"
                    className="rounded-md border-2 border-navy px-5 py-2.5 text-sm font-bold text-navy-text transition hover:bg-navy hover:text-white"
                  >
                    {invoice.sent_at ? "Send again" : "Send to client"}
                  </button>
                </form>
              ) : null}

              {!isDraft ? <PrintButton /> : null}
            </div>
          </div>

          {send === "ok" ? (
            <p
              role="status"
              className="mb-6 rounded-lg border-l-4 border-success bg-surface px-5 py-3 font-semibold text-success"
            >
              Invoice emailed to the client.
            </p>
          ) : null}

          {send === "failed" ? (
            <p
              role="alert"
              className="mb-6 rounded-lg border-l-4 border-danger bg-surface px-5 py-3 text-danger"
            >
              <span className="font-bold">Could not send.</span> Check the
              client has an email address and that Resend is configured, then
              try again.
            </p>
          ) : null}

          {!isDraft ? (
            <p className="mb-6 text-sm text-muted">
              {invoice.sent_at
                ? `Emailed to ${invoice.sent_to ?? "the client"} on ${formatDate(invoice.sent_at)}.`
                : "Not emailed yet."}
            </p>
          ) : null}

          {isDraft && missing.length > 0 ? (
            <div className="mb-6 border-l-4 border-amber bg-surface p-5">
              <p className="font-bold text-navy-text">Cannot issue yet</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                Add {missing.join(", ")} in business settings first.
              </p>
              <Link
                href={adminPath("settings")}
                className="mt-3 inline-block border-2 border-navy rounded-lg px-4 py-2 text-sm font-bold text-navy-text no-underline transition hover:bg-navy hover:text-white"
              >
                Business settings
              </Link>
            </div>
          ) : null}
        </div>

        <InvoiceDocument
          invoice={invoice}
          lines={lines}
          client={client}
          settings={settings}
        />

        {isDraft ? (
          <section className="mt-8 border-2 border-edge rounded-lg bg-surface p-6 print:hidden">
            <h2 className="mb-1 text-xl font-bold text-navy-text">Edit draft</h2>
            <p className="mb-6 text-sm text-muted">
              Only drafts can be changed. Once issued, corrections are made
              with a credit note.
            </p>
            <InvoiceForm
              invoice={invoice}
              lines={lines}
              clients={clients}
              projects={projects}
            />
          </section>
        ) : null}

        <section className="mt-6 border-l-4 border-danger bg-surface p-6 print:hidden">
          <h2 className="mb-2 text-lg font-bold text-navy-text">
            {isDraft ? "Delete draft" : "Cancel invoice"}
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-muted">
            {isDraft
              ? "A draft was never sent, so it can be removed."
              : "The invoice keeps its number in the sequence and is marked cancelled. Numbers are never reused."}
          </p>
          <form action={cancelInvoice}>
            <input type="hidden" name="id" value={invoice.id} />
            <button
              type="submit"
              className="border-2 border-danger px-4 py-2 text-sm font-bold text-danger transition hover:bg-danger hover:text-white"
            >
              {isDraft ? "Delete draft" : "Cancel invoice"}
            </button>
          </form>
        </section>
      </div>
</AdminShell>
  );
}
