"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site, telHref, whatsappHref } from "@/lib/site";
import { cn } from "@/lib/cn";

/**
 * Call, WhatsApp and Quote, pinned to the bottom of the screen on phones.
 *
 * The trade pages tell plumbers to keep a tap-to-call button visible while
 * customers scroll; this is the same advice applied to this site. It replaces
 * a single floating "Get a quote" tab, because most tradespeople would rather
 * ring or message than fill in a form for someone they have never heard of.
 *
 * Hidden from lg upwards, where the header carries the same actions.
 */
export function ContactBar() {
  const pathname = usePathname();
  // The quote page is the form, so a Quote button there goes nowhere.
  const onQuote = pathname === "/quote";

  const item =
    "flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-xs font-bold no-underline transition";

  return (
    <nav
      aria-label="Contact"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t-2 border-navy bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden print:hidden"
    >
      <a href={telHref} className={cn(item, "text-navy-text hover:bg-bg")}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
        Call
      </a>
      <a
        href={whatsappHref()}
        target="_blank"
        rel="noreferrer noopener"
        className={cn(item, "border-l border-edge text-navy-text hover:bg-bg")}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 20l1.3-4A8 8 0 1 1 8 18.7L4 20Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
        WhatsApp
      </a>
      {onQuote ? null : (
        <Link href="/quote" className={cn(item, "bg-amber text-on-amber hover:bg-amber-deep")}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M7 3h10v18l-5-3-5 3V3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          </svg>
          Get a quote
        </Link>
      )}
      <span className="sr-only">Phone answered {site.phone.hours.toLowerCase()}.</span>
    </nav>
  );
}
