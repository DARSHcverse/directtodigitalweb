"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/cn";

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
        "sticky top-0 z-20 border-edge bg-[rgb(6,6,8)] backdrop-blur-lg",
        "border-b lg:h-screen lg:w-sidebar lg:shrink-0 lg:border-r lg:border-b-0",
      )}
    >
      <div
        className={cn(
          "mx-auto flex w-[92%] max-w-[1100px] items-center justify-between gap-5 py-4",
          "lg:w-full lg:max-w-none lg:flex-col lg:items-center lg:gap-10 lg:px-6 lg:py-8",
        )}
      >
        <Link href="/" aria-label="D2D Web — home" className="inline-flex items-center">
          <Image
            src="/images/d2d-logo-white.png"
            alt="D2D Web"
            width={150}
            height={150}
            priority
            className="h-12 w-auto lg:h-[150px]"
          />
        </Link>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="primary-navigation"
          className="rounded-lg border border-edge p-2 text-fg lg:hidden"
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
                  "rounded-lg px-4 py-3 no-underline transition duration-300",
                  "hover:bg-white/8 hover:text-fg lg:hover:translate-x-1",
                  active ? "bg-white/8 text-fg" : "text-muted",
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
