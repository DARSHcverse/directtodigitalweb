import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Full pills that lift under the pointer, matching the homepage's choosers. */
const base =
  "lift inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3 text-base font-bold no-underline " +
  "disabled:pointer-events-none disabled:opacity-60";

const variants = {
  primary: "bg-amber text-on-amber hover:bg-amber-deep",
  navy: "bg-navy text-white hover:bg-navy-deep",
  secondary:
    "border-2 border-navy-text bg-transparent text-navy-text hover:bg-navy-text hover:text-bg",
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
