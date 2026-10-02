import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Shared admin building blocks.
 *
 * Each list and detail page previously repeated its own header, empty state
 * and status pill, so they drifted apart in spacing and wording. These are
 * the single definition.
 */

export function PageHeader({
  title,
  subtitle,
  action,
  back,
}: {
  title: string;
  subtitle?: string;
  action?: { href: string; label: string };
  back?: { href: string; label: string };
}) {
  return (
    <div className="mb-6">
      {back ? (
        <Link
          href={back.href}
          className="mb-3 inline-block text-sm font-semibold text-muted no-underline hover:text-navy-text"
        >
          ← {back.label}
        </Link>
      ) : null}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-display text-navy-text">
            {title}
          </h1>
          {subtitle ? <p className="mt-1 text-muted">{subtitle}</p> : null}
        </div>
        {action ? (
          <Link
            href={action.href}
            className="bg-navy rounded-md px-5 py-3 text-sm font-bold text-white no-underline transition hover:bg-navy-deep"
          >
            {action.label}
          </Link>
        ) : null}
      </div>
    </div>
  );
}

/** A card for a form or a block of detail. */
export function Panel({
  title,
  description,
  tone = "default",
  children,
}: {
  title?: string;
  description?: string;
  tone?: "default" | "warning" | "danger";
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "bg-surface p-6",
        tone === "default" && "border-2 border-edge rounded-lg",
        tone === "warning" && "border-l-4 border-amber",
        tone === "danger" && "border-l-4 border-danger",
      )}
    >
      {title ? (
        <h2 className="mb-1 text-xl font-bold text-navy-text">{title}</h2>
      ) : null}
      {description ? (
        <p className="mb-5 text-sm leading-relaxed text-muted">{description}</p>
      ) : title ? (
        <div className="mb-5" />
      ) : null}
      {children}
    </section>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="border-2 border-edge rounded-lg bg-surface p-10 text-center">
      <p className="text-lg font-bold text-navy-text">{title}</p>
      <p className="mx-auto mt-2 max-w-[420px] leading-relaxed text-muted">
        {body}
      </p>
      {action ? (
        <Link
          href={action.href}
          className="mt-6 inline-block bg-amber rounded-md px-5 py-3 text-sm font-bold text-on-amber no-underline transition hover:bg-amber-deep"
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}

/** Filter tabs with counts, used by every list. */
export function FilterTabs({
  basePath,
  param,
  current,
  tabs,
  counts,
}: {
  basePath: string;
  param: string;
  current: string;
  tabs: { key: string; label: string }[];
  counts: Record<string, number>;
}) {
  return (
    <nav aria-label="Filter" className="mb-5 flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const active = current === tab.key;
        return (
          <Link
            key={tab.key}
            href={`${basePath}?${param}=${tab.key}`}
            aria-current={active ? "page" : undefined}
            className={cn(
              "border-2 px-4 py-2 text-sm font-semibold no-underline transition",
              active
                ? "border-navy bg-navy text-white"
                : "border-edge text-muted hover:border-navy hover:text-navy-text",
            )}
          >
            {tab.label}
            <span className={cn("ml-2", active ? "text-white/70" : "text-muted")}>
              {counts[tab.key] ?? 0}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

const PILL_TONES = {
  neutral: "bg-edge text-muted",
  navy: "bg-navy text-white",
  amber: "bg-amber text-on-amber",
  success: "bg-success text-white",
  danger: "bg-danger text-white",
} as const;

export function Pill({
  tone = "neutral",
  children,
}: {
  tone?: keyof typeof PILL_TONES;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "px-2 py-0.5 text-xs font-bold tracking-wide uppercase",
        PILL_TONES[tone],
      )}
    >
      {children}
    </span>
  );
}

/** A clickable row in a list. */
export function RowLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex flex-wrap items-start justify-between gap-4 border-2 border-edge rounded-lg bg-surface p-5 no-underline transition hover:border-navy"
    >
      {children}
    </Link>
  );
}

export function StatTile({
  label,
  value,
  tone = "navy",
}: {
  label: string;
  value: string;
  tone?: "navy" | "danger" | "success";
}) {
  return (
    <div className="bg-surface p-5">
      <p className="text-xs font-bold tracking-[0.2em] text-muted uppercase">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 text-2xl font-bold",
          tone === "danger" && "text-danger",
          tone === "success" && "text-success",
          tone === "navy" && "text-navy-text",
        )}
      >
        {value}
      </p>
    </div>
  );
}

export function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Relative for recent dates, absolute once it stops being useful. */
export function relativeDate(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return formatDate(iso);
}
