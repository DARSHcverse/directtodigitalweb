"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";
import { ThemeToggle } from "@/components/ThemeToggle";

const links = [
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/design", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b-2 border-navy bg-surface">
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
            width={1080}
            height={431}
            priority
            className="logo-light h-10 w-auto sm:h-11"
          />
          <Image
            src="/TradeHorizontal-dark.png"
            alt=""
            aria-hidden="true"
            width={1080}
            height={431}
            priority
            className="logo-dark h-10 w-auto sm:h-11"
          />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {links.map(({ href, label }) => {
            const active = pathname.startsWith(href);
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
            className="ml-2 rounded-md border-2 border-edge px-4 py-2 text-sm font-semibold text-navy-text no-underline transition hover:border-navy hover:bg-navy hover:text-white"
          >
            Client login
          </Link>
          <Link
            href="/quote"
            className="ml-1 bg-navy rounded-md px-5 py-2.5 text-sm font-bold text-white no-underline transition hover:bg-navy-deep"
          >
            Get a quote
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="border-2 border-navy rounded-lg p-2 text-navy-text lg:hidden"
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
            {links.map(({ href, label }) => {
              const active = pathname.startsWith(href);
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
            <Link
              href="/portal"
              onClick={() => setOpen(false)}
              className="mt-3 block rounded-md border-2 border-edge py-3 text-center font-semibold text-navy-text no-underline transition hover:border-navy"
            >
              Client login
            </Link>
            <Link
              href="/quote"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-md bg-navy py-3 text-center font-bold text-white no-underline"
            >
              Get a quote
            </Link>
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
