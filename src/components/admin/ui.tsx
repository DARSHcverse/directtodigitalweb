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
          className="mb-1 inline-flex min-h-11 items-center text-sm font-semibold text-muted no-underline hover:text-navy-text"
        >
          ← {back.label}
        </Link>
      ) : null}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0 max-w-full">
          <h1 className="text-[2.5rem] leading-none font-extrabold tracking-display wrap-anywhere text-navy-text md:text-5xl">
            {title}
          </h1>
          {subtitle ? <p className="mt-1 text-muted">{subtitle}</p> : null}
        </div>
        {action ? (
          <Link
            href={action.href}
            className="lift hidden min-h-11 items-center rounded-full bg-navy px-5 text-sm font-bold text-white no-underline hover:bg-navy-deep sm:inline-flex"
          >
            {action.label}
          </Link>
        ) : null}
      </div>
    </div>
  );
}

/** Thumb-sized action on a list card. */
export function actionClass(primary = false): string {
  return cn(
    "inline-flex min-h-11 min-w-0 items-center justify-center rounded-lg px-2 text-sm font-bold no-underline transition",
    primary
      ? "bg-navy text-white hover:bg-navy-deep"
      : "bg-bg text-navy-text hover:bg-edge",
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
        "rounded-xl bg-surface p-4 sm:p-6",
        tone === "default" && "border border-edge",
        tone === "warning" && "border border-amber",
        tone === "danger" && "border border-danger",
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
    <div className="rounded-xl border border-edge bg-surface p-8 text-center sm:p-10">
      <p className="text-lg font-bold text-navy-text">{title}</p>
      <p className="mx-auto mt-2 max-w-[420px] leading-relaxed text-muted">
        {body}
      </p>
      {action ? (
        <Link
          href={action.href}
          className="lift mt-6 inline-flex min-h-11 items-center rounded-full bg-amber px-5 text-sm font-bold text-on-amber no-underline"
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
  label = "Filter",
}: {
  label?: string;
  basePath: string;
  param: string;
  current: string;
  tabs: { key: string; label: string }[];
  counts?: Record<string, number>;
}) {
  return (
    <nav
      aria-label={label}
      className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0"
    >
      {tabs.map((tab) => {
        const active = current === tab.key;
        return (
          <Link
            key={tab.key}
            href={`${basePath}?${param}=${tab.key}`}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 text-sm font-semibold whitespace-nowrap no-underline transition",
              active
                ? "border-navy bg-navy text-white"
                : "border-edge bg-surface text-muted hover:border-navy hover:text-navy-text",
            )}
          >
            {tab.label}
            {counts ? (
              <span className={cn("ml-2", active ? "text-white/75" : "text-muted")}>
                {counts[tab.key] ?? 0}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

const PILL_TONES = {
  neutral: "bg-edge text-ink",
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
        "inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold",
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
      className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-edge bg-surface p-4 no-underline transition hover:border-navy sm:p-5"
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
    <div className="min-w-36 flex-1 rounded-xl border border-edge bg-surface p-4">
      <p className="text-sm text-muted">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 text-[1.65rem] leading-tight font-extrabold tabular-nums",
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
