import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

const base =
  "inline-flex items-center justify-center rounded-lg px-6 py-3 font-semibold no-underline transition duration-300 " +
  "hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60";

const variants = {
  primary:
    "border-0 bg-linear-to-r from-brand to-brand-dark text-fg shadow-[0_4px_15px_rgb(139_92_246/0.25)] " +
    "hover:brightness-110 hover:shadow-[0_8px_25px_rgb(139_92_246/0.4)]",
  secondary:
    "border border-edge bg-edge/50 text-fg backdrop-blur-sm " +
    "hover:border-white/20 hover:shadow-[0_8px_25px_rgb(0_0_0/0.2)]",
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
