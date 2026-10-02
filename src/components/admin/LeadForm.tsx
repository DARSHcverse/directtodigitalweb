"use client";

import { useActionState } from "react";
import {
  createLead,
  type LeadFormState,
} from "@/app/(admin)/[adminPath]/leads/actions";

const initial: LeadFormState = { error: null };

const field =
  "w-full border border-edge rounded-lg bg-surface px-4 py-3 text-ink outline-none transition focus:border-navy focus:shadow-[0_0_0_3px_rgb(15_42_71/0.15)]";
const label = "mb-2 block text-sm font-medium text-muted";

export function LeadForm() {
  const [state, action, pending] = useActionState(createLead, initial);

  return (
    <form action={action} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={label}>
            Name
          </label>
          <input id="name" name="name" required className={field} />
        </div>
        <div>
          <label htmlFor="email" className={label}>
            Email
          </label>
          <input id="email" name="email" type="email" required className={field} />
        </div>
        <div>
          <label htmlFor="phone" className={label}>
            Phone
          </label>
          <input id="phone" name="phone" type="tel" className={field} />
        </div>
        <div>
          <label htmlFor="topic" className={label}>
            What they want
          </label>
          <input
            id="topic"
            name="topic"
            placeholder="Website, redesign, e-commerce…"
            className={field}
          />
        </div>
        <div>
          <label htmlFor="budget" className={label}>
            Budget
          </label>
          <input
            id="budget"
            name="budget"
            placeholder="e.g. £800–£2,000"
            className={field}
          />
        </div>
        <div>
          <label htmlFor="timeline" className={label}>
            Timeline
          </label>
          <input
            id="timeline"
            name="timeline"
            placeholder="e.g. 4–6 weeks"
            className={field}
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className={label}>
          Notes
        </label>
        <textarea id="message" name="message" rows={4} className={field} />
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
          className="bg-navy rounded-md px-6 py-3.5 text-sm font-bold tracking-wide text-white transition hover:bg-navy-deep disabled:opacity-60"
        >
          {pending ? "Saving…" : "Add lead"}
        </button>
      </div>
    </form>
  );
}
