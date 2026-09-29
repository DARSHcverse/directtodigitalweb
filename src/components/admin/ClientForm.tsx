"use client";

import { useActionState } from "react";
import {
  createClient,
  updateClient,
  type ClientFormState,
} from "@/app/(admin)/[adminPath]/clients/actions";
import type { Client, Lead } from "@/lib/db/types";

const initial: ClientFormState = { error: null };

const field =
  "w-full border border-edge bg-surface px-4 py-3 text-ink outline-none transition focus:border-navy focus:shadow-[0_0_0_3px_rgb(15_42_71/0.15)]";
const label = "mb-2 block text-sm font-medium text-muted";

export function ClientForm({
  client,
  fromLead,
}: {
  client?: Client;
  fromLead?: Lead;
}) {
  const editing = Boolean(client);
  const [state, action, pending] = useActionState(
    editing ? updateClient : createClient,
    initial,
  );

  // Prefill from a lead when converting, so nothing is retyped.
  const defaults = {
    business_name: client?.business_name ?? "",
    contact_name: client?.contact_name ?? fromLead?.name ?? "",
    email: client?.email ?? fromLead?.email ?? "",
    phone: client?.phone ?? fromLead?.phone ?? "",
    trade: client?.trade ?? "",
    address: client?.address_lines?.join("\n") ?? "",
    notes: client?.notes ?? fromLead?.message ?? "",
  };

  return (
    <form action={action} className="grid gap-5">
      {editing ? <input type="hidden" name="id" value={client!.id} /> : null}
      {fromLead ? (
        <input type="hidden" name="lead_id" value={fromLead.id} />
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="business_name" className={label}>
            Business name
          </label>
          <input
            id="business_name"
            name="business_name"
            defaultValue={defaults.business_name}
            required
            className={field}
          />
        </div>
        <div>
          <label htmlFor="contact_name" className={label}>
            Contact name
          </label>
          <input
            id="contact_name"
            name="contact_name"
            defaultValue={defaults.contact_name}
            required
            className={field}
          />
        </div>
        <div>
          <label htmlFor="email" className={label}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={defaults.email}
            required
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
            type="tel"
            defaultValue={defaults.phone}
            className={field}
          />
        </div>
        <div>
          <label htmlFor="trade" className={label}>
            Trade
          </label>
          <input
            id="trade"
            name="trade"
            defaultValue={defaults.trade}
            placeholder="Plumber, electrician, builder…"
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
            defaultValue={defaults.address}
            placeholder="One line per row"
            className={field}
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className={label}>
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          defaultValue={defaults.notes}
          className={field}
        />
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
          {pending
            ? "Saving…"
            : editing
              ? "Save changes"
              : fromLead
                ? "Create client from lead"
                : "Create client"}
        </button>
      </div>
    </form>
  );
}
