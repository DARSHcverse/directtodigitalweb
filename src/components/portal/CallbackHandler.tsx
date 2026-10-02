"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";

type State = "working" | "failed";

export function CallbackHandler() {
  const [state, setState] = useState<State>("working");
  const [reason, setReason] = useState<string | null>(null);
  // React runs effects twice in development; without this the one-time code
  // is consumed by the first run and the second reports it as invalid.
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    async function run() {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key =
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!url || !key) {
        setReason("Sign-in is not configured.");
        setState("failed");
        return;
      }

      const supabase = createBrowserClient(url, key);

      const params = new URLSearchParams(window.location.search);
      // The fragment is where the implicit flow puts everything, including
      // its errors — and it never reaches the server.
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));

      const hashError = hash.get("error_description") ?? hash.get("error");
      if (hashError) {
        setReason(
          /expired|invalid/i.test(hashError)
            ? "That link has expired or has already been used."
            : hashError,
        );
        setState("failed");
        return;
      }

      // PKCE: a code in the query string, exchanged for a session.
      const code = params.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setReason("That link has expired or has already been used.");
          setState("failed");
          return;
        }
        window.location.replace("/portal");
        return;
      }

      // Implicit: tokens in the fragment, set directly.
      const access_token = hash.get("access_token");
      const refresh_token = hash.get("refresh_token");
      if (access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });
        if (error) {
          setReason("That link has expired or has already been used.");
          setState("failed");
          return;
        }
        window.location.replace("/portal");
        return;
      }

      setReason("That link is missing its sign-in details.");
      setState("failed");
    }

    void run();
  }, []);

  if (state === "working") {
    return (
      <>
        <p className="rule-label mb-3 text-xs font-bold tracking-[0.2em] text-navy-text uppercase">
          Trade Web Co
        </p>
        <h1 className="mb-2 text-2xl font-bold tracking-display text-navy-text">
          Signing you in…
        </h1>
        <p className="text-sm text-muted">This takes a second.</p>
      </>
    );
  }

  return (
    <>
      <p className="rule-label mb-3 text-xs font-bold tracking-[0.2em] text-navy-text uppercase">
        Trade Web Co
      </p>
      <h1 className="mb-2 text-2xl font-bold tracking-display text-navy-text">
        That didn&apos;t work
      </h1>
      <p className="mb-6 text-sm leading-relaxed text-muted">
        {reason ?? "Something went wrong signing you in."}
      </p>
      <Link
        href="/portal/login"
        className="inline-block bg-navy rounded-md px-5 py-3 text-sm font-bold text-white no-underline transition hover:bg-navy-deep"
      >
        Send me a new link
      </Link>
    </>
  );
}
