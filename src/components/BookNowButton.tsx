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
      className="fixed right-5 bottom-5 z-50 rounded-full bg-linear-[270deg,var(--color-brand-dark),white,black,var(--color-brand-dark)] bg-[length:800%_800%] px-6 py-4 text-lg font-bold text-white no-underline shadow-[0_4px_15px_rgb(0_0_0/0.2)] transition duration-300 animate-gradient-wave hover:scale-110"
    >
      Book Now
    </Link>
  );
}
