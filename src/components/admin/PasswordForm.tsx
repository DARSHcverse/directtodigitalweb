"use client";

import { useActionState } from "react";
import {
  changePassword,
  type PasswordState,
} from "@/app/(admin)/[adminPath]/account/actions";

const initial: PasswordState = { error: null, success: null };

const field =
  "border border-edge bg-surface px-4 py-3 text-ink outline-none transition focus:border-navy focus:shadow-[0_0_0_3px_rgb(15_42_71/0.15)]";

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, initial);

  return (
    <form action={action} className="grid max-w-sm gap-4">
      <div className="grid gap-2">
        <label htmlFor="current" className="text-sm font-medium text-muted">
          Current password
        </label>
        <input
          id="current"
          name="current"
          type="password"
          autoComplete="current-password"
          required
          className={field}
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="next" className="text-sm font-medium text-muted">
          New password
        </label>
        <input
          id="next"
          name="next"
          type="password"
          autoComplete="new-password"
          minLength={12}
          required
          className={field}
        />
        <p className="text-xs text-muted">At least 12 characters.</p>
      </div>

      <div className="grid gap-2">
        <label htmlFor="confirm" className="text-sm font-medium text-muted">
          Confirm new password
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          minLength={12}
          required
          className={field}
        />
      </div>

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

      <button
        type="submit"
        disabled={pending}
        className="mt-1 bg-navy px-6 py-3.5 text-sm font-bold tracking-wide text-white transition hover:bg-navy-deep disabled:opacity-60"
      >
        {pending ? "Updating…" : "Change password"}
      </button>
    </form>
  );
}
