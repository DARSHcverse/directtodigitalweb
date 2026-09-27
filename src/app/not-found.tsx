import Link from "next/link";
import type { Metadata } from "next";

// Next emits the noindex robots tag for not-found automatically.
export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="bg-blueprint flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="rule-label mb-4 text-xs font-bold tracking-[0.2em] text-navy uppercase">
        Error 404
      </p>
      <h1 className="mb-4 text-[clamp(2rem,5vw,3rem)] leading-[1.07] font-bold tracking-display text-navy">
        That page doesn&apos;t exist
      </h1>
      <p className="mb-8 max-w-[440px] leading-relaxed text-muted">
        The link may be out of date. Try the homepage, or tell me what you were
        looking for and I&apos;ll point you at it.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center bg-amber px-6 py-3.5 text-sm font-bold tracking-wide text-navy-deep no-underline transition hover:bg-amber-deep"
        >
          Back to home
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center border-2 border-navy px-6 py-3.5 text-sm font-bold tracking-wide text-navy no-underline transition hover:bg-navy hover:text-white"
        >
          Get in touch
        </Link>
      </div>
    </main>
  );
}
