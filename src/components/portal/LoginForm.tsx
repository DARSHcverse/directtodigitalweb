"use client";

import { useActionState, useState } from "react";
import { signInWithCode, type LoginState } from "@/app/portal/actions";

const initial: LoginState = { error: null };

export function PortalLoginForm() {
  const [state, action, pending] = useActionState(signInWithCode, initial);
  const [value, setValue] = useState("");

  /**
   * Formats as they type: uppercase, dashes inserted automatically.
   *
   * The server accepts any shape, but showing the canonical form as it is
   * typed tells them immediately whether what they are entering looks like
   * the code on their email.
   */
  function onChange(input: string) {
    const body = input
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .replace(/^TWC/, "")
      .slice(0, 8);

    if (body.length <= 4) {
      setValue(body ? `TWC-${body}` : "");
      return;
    }
    setValue(`TWC-${body.slice(0, 4)}-${body.slice(4)}`);
  }

  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-2">
        <label htmlFor="code" className="text-sm font-medium text-muted">
          Your code
        </label>
        <input
          id="code"
          name="code"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="TWC-XXXX-XXXX"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          required
          className="w-full rounded-lg border-2 border-edge bg-surface px-4 py-4 text-center font-mono text-xl tracking-[0.2em] text-navy-text outline-none transition focus:border-navy focus:shadow-[0_0_0_3px_rgb(15_42_71/0.15)]"
        />
        <p className="text-xs text-muted">
          It&apos;s in the email I sent you when your project started.
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
        className="mt-1 w-full rounded-md bg-navy px-6 py-3.5 text-sm font-bold tracking-wide text-white transition hover:bg-navy-deep disabled:opacity-60"
      >
        {pending ? "Signing you in…" : "Sign in"}
      </button>
    </form>
  );
}
