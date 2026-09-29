"use client";

import { useActionState, useState } from "react";
import {
  createInvoice,
  updateDraft,
  type InvoiceFormState,
} from "@/app/(admin)/[adminPath]/invoices/actions";
import type { Client, Invoice, InvoiceLine, Project } from "@/lib/db/types";

const initial: InvoiceFormState = { error: null };

const field =
  "w-full border border-edge bg-surface px-3 py-2.5 text-ink outline-none transition focus:border-navy focus:shadow-[0_0_0_3px_rgb(15_42_71/0.15)]";
const label = "mb-2 block text-sm font-medium text-muted";

type Row = { description: string; quantity: string; unit_price: string };

export function InvoiceForm({
  invoice,
  lines,
  clients,
  projects,
  presetClientId,
}: {
  invoice?: Invoice;
  lines?: InvoiceLine[];
  clients: Pick<Client, "id" | "business_name" | "contact_name">[];
  projects: Pick<Project, "id" | "title" | "client_id" | "agreed_price">[];
  presetClientId?: string;
}) {
  const editing = Boolean(invoice);
  const [state, action, pending] = useActionState(
    editing ? updateDraft : createInvoice,
    initial,
  );

  const [clientId, setClientId] = useState(
    invoice?.client_id ?? presetClientId ?? "",
  );
  const [rows, setRows] = useState<Row[]>(
    lines && lines.length > 0
      ? lines.map((l) => ({
          description: l.description,
          quantity: String(l.quantity),
          unit_price: String(l.unit_price),
        }))
      : [{ description: "", quantity: "1", unit_price: "" }],
  );

  // Only the chosen client's projects are offered, so an invoice cannot be
  // attached to someone else's job.
  const clientProjects = projects.filter((p) => p.client_id === clientId);

  const subtotal = rows.reduce((sum, r) => {
    const q = Number(r.quantity);
    const p = Number(r.unit_price);
    return sum + (Number.isNaN(q) || Number.isNaN(p) ? 0 : q * p);
  }, 0);

  function update(i: number, key: keyof Row, value: string) {
    setRows((prev) =>
      prev.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)),
    );
  }

  return (
    <form action={action} className="grid gap-6">
      {editing ? <input type="hidden" name="id" value={invoice!.id} /> : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="client_id" className={label}>
            Client
          </label>
          <select
            id="client_id"
            name="client_id"
            required
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className={field}
          >
            <option value="" disabled>
              Choose a client…
            </option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.business_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="project_id" className={label}>
            Project (optional)
          </label>
          <select
            id="project_id"
            name="project_id"
            defaultValue={invoice?.project_id ?? ""}
            className={field}
          >
            <option value="">No specific project</option>
            {clientProjects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <p className={label}>Lines</p>
        <div className="grid gap-3">
          {rows.map((row, i) => (
            <div
              key={i}
              className="grid gap-2 border border-edge p-3 sm:grid-cols-[1fr_5rem_7rem_2.5rem]"
            >
              <input
                name="line_description"
                value={row.description}
                onChange={(e) => update(i, "description", e.target.value)}
                placeholder="Description"
                aria-label={`Line ${i + 1} description`}
                className={field}
              />
              <input
                name="line_quantity"
                value={row.quantity}
                onChange={(e) => update(i, "quantity", e.target.value)}
                inputMode="decimal"
                aria-label={`Line ${i + 1} quantity`}
                className={field}
              />
              <input
                name="line_price"
                value={row.unit_price}
                onChange={(e) => update(i, "unit_price", e.target.value)}
                inputMode="decimal"
                placeholder="0.00"
                aria-label={`Line ${i + 1} unit price`}
                className={field}
              />
              <button
                type="button"
                onClick={() =>
                  setRows((prev) =>
                    prev.length === 1 ? prev : prev.filter((_, x) => x !== i),
                  )
                }
                aria-label={`Remove line ${i + 1}`}
                className="border border-edge px-2 py-2 text-muted transition hover:border-danger hover:text-danger"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            setRows((prev) => [
              ...prev,
              { description: "", quantity: "1", unit_price: "" },
            ])
          }
          className="mt-3 border-2 border-navy px-4 py-2 text-sm font-bold text-navy transition hover:bg-navy hover:text-white"
        >
          Add line
        </button>
      </div>

      <div className="border-l-4 border-amber bg-bg p-4">
        <p className="text-sm text-muted">Subtotal</p>
        <p className="text-2xl font-bold text-navy">
          {new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: "GBP",
          }).format(subtotal)}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="payment_ref" className={label}>
            Payment reference
          </label>
          <input
            id="payment_ref"
            name="payment_ref"
            defaultValue={invoice?.payment_ref ?? ""}
            placeholder="What they should quote on the transfer"
            className={field}
          />
        </div>
        <div>
          <label htmlFor="notes" className={label}>
            Notes on the invoice
          </label>
          <input
            id="notes"
            name="notes"
            defaultValue={invoice?.notes ?? ""}
            className={field}
          />
        </div>
      </div>

      {state.error ? (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      ) : null}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="bg-navy px-6 py-3.5 text-sm font-bold tracking-wide text-white transition hover:bg-navy-deep disabled:opacity-60"
        >
          {pending ? "Saving…" : editing ? "Save draft" : "Create draft"}
        </button>
      </div>
    </form>
  );
}
