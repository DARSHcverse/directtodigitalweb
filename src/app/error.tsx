"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Runtime error boundary. Without this a visitor sees Next's unstyled error
 * screen, which looks broken and offers them no way forward.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaces in Vercel logs so failures are not silent.
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <main className="bg-blueprint flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="rule-label mb-4 text-xs font-bold tracking-[0.2em] text-navy uppercase">
        Something went wrong
      </p>
      <h1 className="mb-4 text-[clamp(2rem,5vw,3rem)] leading-[1.07] font-bold tracking-display text-navy">
        That didn&apos;t load properly
      </h1>
      <p className="mb-8 max-w-[440px] leading-relaxed text-muted">
        Try again — it may have been a temporary glitch. If it keeps happening,
        get in touch and I&apos;ll sort it.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center bg-amber px-6 py-3.5 text-sm font-bold tracking-wide text-navy-deep transition hover:bg-amber-deep"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center border-2 border-navy px-6 py-3.5 text-sm font-bold tracking-wide text-navy no-underline transition hover:bg-navy hover:text-white"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
