"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Floating CTA, hidden where it would duplicate the page's own action. */
export function BookNowButton() {
  const pathname = usePathname();
  if (pathname === "/booking" || pathname === "/quote") return null;

  return (
    <Link
      href="/quote"
      className="fixed right-0 bottom-6 z-40 border-y-2 border-l-2 border-navy bg-amber py-3 pr-5 pl-4 text-sm font-bold text-on-amber no-underline transition hover:bg-amber-deep lg:hidden"
    >
      Get a quote
    </Link>
  );
}
