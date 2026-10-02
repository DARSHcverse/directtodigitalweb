import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Flat fills with a moderate radius: softened enough to read as current,
 *  well short of the rounded-pill default that every template ships with. */
const base =
  "inline-flex items-center justify-center rounded-md px-6 py-3.5 text-sm font-bold tracking-wide no-underline transition duration-150 " +
  "disabled:pointer-events-none disabled:opacity-60";

const variants = {
  primary: "bg-amber text-on-amber hover:bg-amber-deep",
  navy: "bg-navy text-white hover:bg-navy-deep",
  secondary:
    "border-2 border-navy rounded-lg bg-transparent text-navy-text hover:bg-navy hover:text-white",
  onDark:
    "border-2 border-white/40 bg-transparent text-white hover:border-white hover:bg-white/10",
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
