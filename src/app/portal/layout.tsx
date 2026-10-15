import type { Metadata } from "next";

/**
 * Applies to every client-portal page.
 *
 * The root layout sets the canonical to "/", so any page without its own
 * inherited it — the sign-in page was telling search engines it was a copy of
 * the homepage, and borrowing the homepage description too. Portal pages are
 * private, so they get no canonical and are kept out of the index.
 */
export const metadata: Metadata = {
  alternates: { canonical: null },
  description: "Sign in to see your Trade Web Co project, invoices and messages.",
  robots: { index: false, follow: false },
};

export default function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
