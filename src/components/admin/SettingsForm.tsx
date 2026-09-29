"use client";

import { useActionState, useState } from "react";
import {
  saveSettings,
  type SettingsState,
} from "@/app/(admin)/[adminPath]/settings/actions";
import type { BusinessSettings } from "@/lib/db/types";

const initial: SettingsState = { error: null, success: null };

const field =
  "w-full border border-edge bg-surface px-4 py-3 text-ink outline-none transition focus:border-navy focus:shadow-[0_0_0_3px_rgb(15_42_71/0.15)]";
const label = "mb-2 block text-sm font-medium text-muted";

export function SettingsForm({ settings }: { settings: BusinessSettings }) {
  const [state, action, pending] = useActionState(saveSettings, initial);
  const [vatRegistered, setVatRegistered] = useState(settings.vat_registered);

  return (
    <form action={action} className="grid gap-8">
      <section>
        <h2 className="mb-4 text-lg font-bold text-navy">Business identity</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="trading_name" className={label}>
              Trading name
            </label>
            <input
              id="trading_name"
              name="trading_name"
              required
              defaultValue={settings.trading_name}
              className={field}
            />
          </div>
          <div>
            <label htmlFor="legal_name" className={label}>
              Your name (sole trader) or legal name
            </label>
            <input
              id="legal_name"
              name="legal_name"
              defaultValue={settings.legal_name}
              placeholder="Darshan Subramaniyam"
              className={field}
            />
          </div>
          <div>
            <label htmlFor="company_number" className={label}>
              Company number (if incorporated)
            </label>
            <input
              id="company_number"
              name="company_number"
              defaultValue={settings.company_number ?? ""}
              placeholder="Leave blank as a sole trader"
              className={field}
            />
          </div>
          <div>
            <label htmlFor="email" className={label}>
              Contact email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={settings.email}
              className={field}
            />
          </div>
          <div>
            <label htmlFor="phone" className={label}>
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              defaultValue={settings.phone ?? ""}
              className={field}
            />
          </div>
          <div>
            <label htmlFor="address" className={label}>
              Address
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              defaultValue={settings.address_lines.join("\n")}
              placeholder="One line per row"
              className={field}
            />
          </div>
        </div>
      </section>

      <section className="border-t border-edge pt-8">
        <h2 className="mb-4 text-lg font-bold text-navy">Bank details</h2>
        <p className="mb-5 text-sm text-muted">
          Printed on every invoice — this is how clients pay you.
        </p>
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label htmlFor="bank_account_name" className={label}>
              Account name
            </label>
            <input
              id="bank_account_name"
              name="bank_account_name"
              defaultValue={settings.bank_account_name ?? ""}
              className={field}
            />
          </div>
          <div>
            <label htmlFor="bank_sort_code" className={label}>
              Sort code
            </label>
            <input
              id="bank_sort_code"
              name="bank_sort_code"
              defaultValue={settings.bank_sort_code ?? ""}
              placeholder="00-00-00"
              className={field}
            />
          </div>
          <div>
            <label htmlFor="bank_account_no" className={label}>
              Account number
            </label>
            <input
              id="bank_account_no"
              name="bank_account_no"
              defaultValue={settings.bank_account_no ?? ""}
              className={field}
            />
          </div>
        </div>
      </section>

      <section className="border-t border-edge pt-8">
        <h2 className="mb-4 text-lg font-bold text-navy">VAT</h2>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="vat_registered"
            checked={vatRegistered}
            onChange={(e) => setVatRegistered(e.target.checked)}
            className="h-4 w-4"
          />
          <span className="text-sm font-medium text-ink">
            Registered for VAT
          </span>
        </label>

        {vatRegistered ? (
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="vat_number" className={label}>
                VAT number
              </label>
              <input
                id="vat_number"
                name="vat_number"
                defaultValue={settings.vat_number ?? ""}
                className={field}
              />
            </div>
            <div>
              <label htmlFor="vat_rate" className={label}>
                VAT rate (%)
              </label>
              <input
                id="vat_rate"
                name="vat_rate"
                inputMode="decimal"
                defaultValue={String(settings.vat_rate)}
                className={field}
              />
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted">
            Invoices will state that no VAT is charged.
          </p>
        )}
      </section>

      <section className="border-t border-edge pt-8">
        <h2 className="mb-4 text-lg font-bold text-navy">Invoicing</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="invoice_prefix" className={label}>
              Invoice number prefix
            </label>
            <input
              id="invoice_prefix"
              name="invoice_prefix"
              defaultValue={settings.invoice_prefix}
              className={field}
            />
            <p className="mt-2 text-xs text-muted">
              Changing this does not renumber invoices already issued.
            </p>
          </div>
          <div>
            <label htmlFor="payment_terms_days" className={label}>
              Payment terms (days)
            </label>
            <input
              id="payment_terms_days"
              name="payment_terms_days"
              inputMode="numeric"
              defaultValue={String(settings.payment_terms_days)}
              className={field}
            />
          </div>
        </div>
        <div className="mt-5">
          <label htmlFor="invoice_footer" className={label}>
            Invoice footer
          </label>
          <input
            id="invoice_footer"
            name="invoice_footer"
            defaultValue={settings.invoice_footer ?? ""}
            placeholder="e.g. Thank you for your business."
            className={field}
          />
        </div>
      </section>

      {state.error ? (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p role="status" className="text-sm font-semibold text-success">
          {state.success}
        </p>
      ) : null}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="bg-navy px-6 py-3.5 text-sm font-bold tracking-wide text-white transition hover:bg-navy-deep disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save settings"}
        </button>
      </div>
    </form>
  );
}
