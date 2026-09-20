import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="mb-4 text-sm font-semibold tracking-widest text-brand uppercase">
        404
      </p>
      <h1 className="mb-4 text-4xl font-bold">That page doesn&apos;t exist</h1>
      <p className="mb-8 max-w-[480px] text-muted">
        The link may be out of date. Try the homepage, or get in touch if you
        were looking for something specific.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-linear-to-r from-brand to-brand-dark px-6 py-3 font-semibold text-white no-underline transition hover:brightness-110"
        >
          Back to home
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-lg border border-edge bg-edge/50 px-6 py-3 font-semibold text-fg no-underline transition hover:border-white/20"
        >
          Contact
        </Link>
      </div>
    </main>
  );
}
