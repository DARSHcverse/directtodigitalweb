import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

const base =
  "inline-flex items-center justify-center rounded-lg px-6 py-3 font-semibold no-underline transition duration-200 " +
  "hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60";

const variants = {
  /** Amber on navy text: the highest-contrast CTA in the palette. */
  primary:
    "bg-amber text-navy-deep shadow-sm hover:bg-amber-deep hover:shadow-md",
  secondary:
    "border border-edge bg-surface text-navy hover:border-navy/30 hover:shadow-sm",
  /** For use on navy backgrounds. */
  onDark:
    "border border-white/25 bg-white/5 text-white hover:border-white/50 hover:bg-white/10",
} as const;

type Variant = keyof typeof variants;

export function ButtonLink({
  href,
  variant = "secondary",
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={cn(base, variants[variant], className)}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "secondary",
  className,
  children,
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
