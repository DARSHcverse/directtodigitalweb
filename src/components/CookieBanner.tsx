"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  readConsent,
  setConsent,
  subscribeConsent,
  type Consent,
} from "@/lib/analytics";

/**
 * Asks once whether analytics cookies may be used.
 *
 * Accept and Reject carry equal weight — the ICO expects refusing to be as
 * easy as agreeing — and nothing from Google loads while the question is
 * unanswered. Shown until a choice is made; "Cookie settings" in the footer
 * clears the choice to bring it back.
 *
 * Renders nothing on the server and on first paint (the server snapshot is
 * "undecided but hidden"), so it never flashes for visitors who have already
 * chosen.
 */
const HIDDEN = "hidden" as const;

export function CookieBanner() {
  const consent = useSyncExternalStore<Consent | typeof HIDDEN>(
    subscribeConsent,
    readConsent,
    () => HIDDEN,
  );
  if (consent !== null) return null;

  return (
    <div
      role="region"
      aria-label="Cookie choice"
      className="fixed inset-x-3 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-50 mx-auto max-w-xl rounded-lg border-2 border-navy bg-surface p-4 shadow-lg lg:bottom-4 print:hidden"
    >
      <p className="text-sm leading-relaxed text-ink">
        Can I use analytics cookies to see which pages help people? They only
        count visits — no adverts, nothing sold.{" "}
        <Link href="/privacy#cookies" className="font-semibold text-navy-text underline underline-offset-2">
          Privacy policy
        </Link>
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => setConsent("granted")}
          className="flex-1 rounded-md border-2 border-navy bg-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-navy-deep"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => setConsent("denied")}
          className="flex-1 rounded-md border-2 border-navy px-4 py-2 text-sm font-bold text-navy-text transition hover:bg-navy hover:text-white"
        >
          Reject
        </button>
      </div>
    </div>
  );
}

/** Footer link that clears the choice so the banner asks again. */
export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={() => setConsent(null)} className={className}>
      Cookie settings
    </button>
  );
}
