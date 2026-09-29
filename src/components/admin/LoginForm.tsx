"use client";

import { useActionState } from "react";
import { signIn, type SignInState } from "@/app/(admin)/[adminPath]/actions";

const initial: SignInState = { error: null };

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, initial);

  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-2">
        <label htmlFor="email" className="text-sm font-medium text-muted">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="border border-edge bg-surface px-4 py-3 text-ink outline-none transition focus:border-navy focus:shadow-[0_0_0_3px_rgb(15_42_71/0.15)]"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="password" className="text-sm font-medium text-muted">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="border border-edge bg-surface px-4 py-3 text-ink outline-none transition focus:border-navy focus:shadow-[0_0_0_3px_rgb(15_42_71/0.15)]"
        />
      </div>

      {state.error ? (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 bg-navy px-6 py-3.5 text-sm font-bold tracking-wide text-white transition hover:bg-navy-deep disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
