"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { site, telHref } from "@/lib/site";
import { ThemeToggle } from "@/components/ThemeToggle";

/** Industry pages for the automotive side, so "Garages" lights up on them. */
const AUTOMOTIVE = ["/for/garages", "/for/car-detailing", "/for/mobile-mechanics", "/for/car-dealers"];

/**
 * Audiences first, then the pages every buyer checks. Services and Contact
 * are one tap away in the footer and the mobile menu; the quote button and
 * the phone number cover "get in touch".
 */
const links: { href: string; label: string; active: (path: string) => boolean }[] = [
  {
    href: "/for/garages",
    label: "Garages",
    active: (p) => AUTOMOTIVE.some((a) => p.startsWith(a)),
  },
  {
    href: "/for",
    label: "Trades",
    active: (p) => p.startsWith("/for") && !AUTOMOTIVE.some((a) => p.startsWith(a)),
  },
  { href: "/apps", label: "Apps", active: (p) => p.startsWith("/apps") },
  { href: "/pricing", label: "Pricing", active: (p) => p.startsWith("/pricing") },
  { href: "/work", label: "Work", active: (p) => p.startsWith("/work") },
  { href: "/about", label: "About", active: (p) => p.startsWith("/about") },
];

/** Extra links only the mobile menu has room for. */
const mobileExtras = [
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
] as const;

export function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="surface-navy sticky top-0 z-30 border-b border-edge">
      <div className="mx-auto flex w-[92%] max-w-[1200px] items-center justify-between gap-6 py-4">
        <Link
          href="/"
          aria-label={`${site.name} — home`}
          onClick={() => setOpen(false)}
          className="logo-swap shrink-0"
        >
          <Image
            src="/TradeHorizontal.png"
            alt={site.name}
            width={110}
            height={44}
            priority
            className="logo-light h-10 w-auto sm:h-11"
          />
          <Image
            src="/TradeHorizontal-dark.png"
            alt=""
            aria-hidden="true"
            width={110}
            height={44}
            className="logo-dark h-10 w-auto sm:h-11"
          />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {links.map(({ href, label, active: isActive }) => {
            const active = isActive(pathname);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative px-4 py-2 text-sm font-semibold no-underline transition",
                  active ? "text-navy-text" : "text-muted hover:text-navy-text",
                )}
              >
                {label}
                {/* Amber underline marks position without a filled pill. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-3 -bottom-0.5 h-0.5 bg-amber transition-transform duration-200",
                    active ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </Link>
            );
          })}
          <ThemeToggle className="ml-2" />
          <Link
            href="/portal"
            className="lift ml-2 rounded-full border border-edge px-4 py-2 text-sm font-semibold text-navy-text no-underline hover:border-white"
          >
            Client login
          </Link>
          {/* The number itself, only from xl: below that there is no room
              beside five links, the theme switch and two buttons. */}
          <a
            href={telHref}
            className="ml-2 hidden px-1 py-2 text-sm font-bold whitespace-nowrap text-navy-text no-underline transition hover:text-amber-deep xl:inline"
          >
            {site.phone.display}
          </a>
          <Link
            href="/quote"
            className="lift ml-2 rounded-full bg-amber px-5 py-2.5 text-sm font-extrabold text-on-amber no-underline"
          >
            Get a quote
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="rounded-lg border border-edge p-2.5 text-navy-text lg:hidden"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Primary"
          className="border-t border-edge bg-surface lg:hidden"
        >
          <div className="mx-auto w-[92%] max-w-[1200px] py-2">
            {links.map(({ href, label, active: isActive }) => {
              const active = isActive(pathname);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "block border-l-4 py-3 pl-4 font-semibold no-underline transition",
                    active
                      ? "border-amber text-navy-text"
                      : "border-transparent text-muted hover:border-edge hover:text-navy-text",
                  )}
                >
                  {label}
                </Link>
              );
            })}
            {mobileExtras.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                aria-current={pathname.startsWith(href) ? "page" : undefined}
                className="block border-l-4 border-transparent py-3 pl-4 font-semibold text-muted no-underline transition hover:border-edge hover:text-navy-text"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/portal"
              onClick={() => setOpen(false)}
              className="mt-3 block rounded-full border border-edge py-3 text-center font-semibold text-navy-text no-underline transition hover:border-white"
            >
              Client login
            </Link>
            <Link
              href="/quote"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-full bg-amber py-3 text-center font-extrabold text-on-amber no-underline"
            >
              Get a quote
            </Link>
            <div className="mt-3">
              <a
                href={telHref}
                className="block rounded-full border-2 border-white py-3 text-center font-bold text-navy-text no-underline"
              >
                Call {site.phone.display}
              </a>
            </div>
            <p className="mt-2 text-center text-xs text-muted">
              {site.phone.display} · {site.phone.hours}
            </p>
            <div className="mt-3 mb-3 flex items-center justify-between border-t border-edge pt-3">
              <span className="text-sm font-semibold text-muted">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
