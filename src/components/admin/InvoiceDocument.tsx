import { formatMoney, formatDate } from "@/lib/admin/invoices";
import type {
  BusinessSettings,
  Client,
  Invoice,
  InvoiceLine,
} from "@/lib/db/types";

/**
 * The invoice as the client sees it.
 *
 * Printed to PDF from the browser rather than generated server-side: the
 * layout is the same thing the owner just reviewed on screen, so what is sent
 * cannot drift from what was checked. print:* utilities strip the admin
 * furniture.
 *
 * Payment is by bank transfer, so the account details are the call to action
 * and sit directly under the total.
 */
export function InvoiceDocument({
  invoice,
  lines,
  client,
  settings,
}: {
  invoice: Invoice;
  lines: InvoiceLine[];
  client: Client | null;
  settings: BusinessSettings | null;
}) {
  const isDraft = invoice.status === "draft";

  return (
    <article className="border-2 border-navy bg-surface p-8 print:border-0 print:p-0">
      {isDraft ? (
        <p className="mb-6 border-l-4 border-amber bg-bg px-4 py-2 text-sm font-bold text-navy print:hidden">
          DRAFT — not yet issued, and has no invoice number.
        </p>
      ) : null}

      <header className="mb-8 flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-2xl font-bold tracking-display text-navy">
            {settings?.trading_name ?? "Trade Web Co"}
          </p>
          {settings?.legal_name &&
          settings.legal_name !== settings.trading_name ? (
            <p className="text-sm text-muted">{settings.legal_name}</p>
          ) : null}
          <div className="mt-2 text-sm text-muted">
            {(settings?.address_lines ?? []).map((line) => (
              <p key={line}>{line}</p>
            ))}
            {settings?.email ? <p>{settings.email}</p> : null}
            {settings?.phone ? <p>{settings.phone}</p> : null}
          </div>
          {settings?.company_number ? (
            <p className="mt-2 text-xs text-muted">
              Company no. {settings.company_number}
            </p>
          ) : null}
          {settings?.vat_registered && settings.vat_number ? (
            <p className="text-xs text-muted">VAT no. {settings.vat_number}</p>
          ) : null}
        </div>

        <div className="text-right">
          <p className="text-xs font-bold tracking-[0.2em] text-muted uppercase">
            Invoice
          </p>
          <p className="text-2xl font-bold text-navy">
            {invoice.invoice_number ?? "Draft"}
          </p>
          <dl className="mt-3 text-sm">
            <div className="flex justify-end gap-3">
              <dt className="text-muted">Issued</dt>
              <dd className="font-medium text-navy">
                {formatDate(invoice.issued_on)}
              </dd>
            </div>
            <div className="flex justify-end gap-3">
              <dt className="text-muted">Due</dt>
              <dd className="font-medium text-navy">
                {formatDate(invoice.due_on)}
              </dd>
            </div>
          </dl>
        </div>
      </header>

      <section className="mb-8">
        <p className="mb-1 text-xs font-bold tracking-[0.2em] text-muted uppercase">
          Bill to
        </p>
        <p className="font-bold text-navy">{client?.business_name ?? "—"}</p>
        {client?.contact_name ? (
          <p className="text-sm text-muted">{client.contact_name}</p>
        ) : null}
        <div className="text-sm text-muted">
          {(client?.address_lines ?? []).map((line) => (
            <p key={line}>{line}</p>
          ))}
          {client?.email ? <p>{client.email}</p> : null}
        </div>
      </section>

      <table className="mb-6 w-full text-sm">
        <thead>
          <tr className="border-b-2 border-navy text-left">
            <th className="pb-2 font-bold text-navy">Description</th>
            <th className="pb-2 text-right font-bold text-navy">Qty</th>
            <th className="pb-2 text-right font-bold text-navy">Unit</th>
            <th className="pb-2 text-right font-bold text-navy">Amount</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line) => (
            <tr key={line.id} className="border-b border-edge">
              <td className="py-3 text-ink">{line.description}</td>
              <td className="py-3 text-right text-muted">{line.quantity}</td>
              <td className="py-3 text-right text-muted">
                {formatMoney(line.unit_price)}
              </td>
              <td className="py-3 text-right font-medium text-navy">
                {formatMoney(line.line_total)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mb-8 flex justify-end">
        <dl className="w-full max-w-xs text-sm">
          <div className="flex justify-between py-1">
            <dt className="text-muted">Subtotal</dt>
            <dd className="text-navy">{formatMoney(invoice.subtotal)}</dd>
          </div>
          {Number(invoice.vat_rate) > 0 ? (
            <div className="flex justify-between py-1">
              <dt className="text-muted">VAT at {invoice.vat_rate}%</dt>
              <dd className="text-navy">{formatMoney(invoice.vat_amount)}</dd>
            </div>
          ) : null}
          <div className="mt-2 flex justify-between border-t-2 border-navy pt-2">
            <dt className="font-bold text-navy">Total due</dt>
            <dd className="text-xl font-bold text-navy">
              {formatMoney(invoice.total)}
            </dd>
          </div>
        </dl>
      </div>

      <section className="border-2 border-navy p-5">
        <p className="mb-3 text-xs font-bold tracking-[0.2em] text-navy uppercase">
          How to pay — bank transfer
        </p>
        <dl className="grid gap-2 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted">Account name</dt>
            <dd className="font-medium text-navy">
              {settings?.bank_account_name ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-muted">Sort code</dt>
            <dd className="font-medium text-navy">
              {settings?.bank_sort_code ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-muted">Account number</dt>
            <dd className="font-medium text-navy">
              {settings?.bank_account_no ?? "—"}
            </dd>
          </div>
        </dl>
        {invoice.payment_ref ? (
          <p className="mt-3 border-l-4 border-amber pl-3 text-sm">
            <span className="text-muted">Please use reference </span>
            <span className="font-bold text-navy">{invoice.payment_ref}</span>
          </p>
        ) : null}
      </section>

      {invoice.notes ? (
        <p className="mt-6 text-sm leading-relaxed text-muted">
          {invoice.notes}
        </p>
      ) : null}

      {settings?.invoice_footer ? (
        <p className="mt-6 border-t border-edge pt-4 text-xs text-muted">
          {settings.invoice_footer}
        </p>
      ) : null}

      {!settings?.vat_registered ? (
        // Required so the total is not mistaken for a VAT-inclusive figure.
        <p className="mt-4 text-xs text-muted">
          Not registered for VAT. No VAT is charged on this invoice.
        </p>
      ) : null}
    </article>
  );
}
