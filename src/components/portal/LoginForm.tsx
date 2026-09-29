"use client";

import { useActionState } from "react";
import { sendMagicLink, type LoginState } from "@/app/portal/actions";

const initial: LoginState = { error: null, sent: false };

export function PortalLoginForm() {
  const [state, action, pending] = useActionState(sendMagicLink, initial);

  if (state.sent) {
    return (
      <div role="status" className="border-l-4 border-amber bg-bg p-5">
        <p className="font-bold text-navy">Check your email</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          If that address has access, a sign-in link is on its way. It works
          once and expires after an hour.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-2">
        <label htmlFor="email" className="text-sm font-medium text-muted">
          Your email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="border border-edge bg-surface px-4 py-3 text-ink outline-none transition focus:border-navy focus:shadow-[0_0_0_3px_rgb(15_42_71/0.15)]"
        />
        <p className="text-xs text-muted">
          No password needed — we email you a link.
        </p>
      </div>

      {state.error ? (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 bg-navy px-6 py-3.5 text-sm font-bold tracking-wide text-white transition hover:bg-navy-deep disabled:opacity-60"
      >
        {pending ? "Sending…" : "Email me a link"}
      </button>
    </form>
  );
}
