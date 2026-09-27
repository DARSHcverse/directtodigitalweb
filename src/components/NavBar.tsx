"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

const links = [
  { href: "/", label: "Home" },
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
    <header
      className={cn(
        "sticky top-0 z-20 border-navy-soft/40 bg-navy",
        "border-b lg:h-screen lg:w-sidebar lg:shrink-0 lg:border-r lg:border-b-0",
      )}
    >
      <div
        className={cn(
          "mx-auto flex w-[92%] max-w-[1100px] items-center justify-between gap-5 py-4",
          "lg:w-full lg:max-w-none lg:flex-col lg:items-center lg:gap-10 lg:px-6 lg:py-8",
        )}
      >
        {/* TODO(Darshan): swap for the Trade Web Co logo once the SVG exists.
            Until then this is set in type — the old D2D mark is the wrong
            brand and the wrong palette. */}
        <Link
          href="/"
          aria-label={`${site.name} — home`}
          className="inline-flex flex-col leading-none no-underline"
        >
          <span className="text-xl font-bold tracking-tight text-white lg:text-2xl">
            Trade Web
          </span>
          <span className="text-xl font-bold tracking-tight text-amber lg:text-2xl">
            Co.
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="primary-navigation"
          className="rounded-lg border border-white/25 p-2 text-white lg:hidden"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>

        <nav
          id="primary-navigation"
          className={cn(
            "w-full flex-col gap-2 pb-4 lg:flex lg:w-full lg:pb-0",
            open ? "flex" : "hidden",
            "lg:!flex",
          )}
        >
          {links.map(({ href, label }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-4 py-3 no-underline transition duration-200",
                  "hover:bg-white/10 hover:text-white lg:hover:translate-x-1",
                  active
                    ? "bg-white/10 text-white shadow-[inset_3px_0_0_0_var(--color-amber)]"
                    : "text-white/70",
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
