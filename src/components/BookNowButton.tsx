"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Floating CTA, hidden on the booking page itself. */
export function BookNowButton() {
  const pathname = usePathname();
  if (pathname === "/booking") return null;

  return (
    <Link
      href="/booking"
      className="fixed right-5 bottom-5 z-50 rounded-full bg-amber px-6 py-4 text-base font-bold text-navy-deep no-underline shadow-lg transition duration-200 hover:bg-amber-deep hover:shadow-xl"
    >
      Get a callback
    </Link>
  );
}
