import Link from "next/link";
import type { ReactNode } from "react";
import type { RelatedTrade } from "@/lib/guides/types";
import { site, telHref, whatsappHref } from "@/lib/site";

/**
 * The pieces a guide is written with. Kept small and plain so guides read
 * like articles, and styled once here so every guide matches.
 */

const TRADE_PARAM: Record<Exclude<RelatedTrade, "none">, string> = {
  plumbers: "plumber",
  electricians: "electrician",
  builders: "builder",
  roofers: "roofer",
};

/**
 * Quote link for a guide. The ref records which guide produced an enquiry,
 * and the trade is pre-selected where the guide is about one.
 */
export function guideQuoteHref(slug: string, trade: RelatedTrade): string {
  const q = new URLSearchParams({ ref: `guide-${slug}` });
  if (trade !== "none") q.set("trade", TRADE_PARAM[trade]);
  return `/quote?${q.toString()}`;
}

export function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="mt-12 mb-4 scroll-mt-24 text-2xl font-bold tracking-display text-navy-text sm:text-3xl"
    >
      {children}
    </h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return <h3 className="mt-8 mb-3 text-xl font-bold text-navy-text">{children}</h3>;
}

export function P({ children }: { children: ReactNode }) {
  return <p className="mb-4 text-lg leading-relaxed text-ink">{children}</p>;
}

export function List({
  ordered = false,
  children,
}: {
  ordered?: boolean;
  children: ReactNode;
}) {
  const cls = "mb-5 grid gap-2 pl-6 text-lg leading-relaxed text-ink marker:text-amber-deep";
  return ordered ? (
    <ol className={`list-decimal ${cls}`}>{children}</ol>
  ) : (
    <ul className={`list-disc ${cls}`}>{children}</ul>
  );
}

/** A link inside guide copy, internal or external. */
export function A({ href, children }: { href: string; children: ReactNode }) {
  const external = /^https?:\/\//.test(href);
  return external ? (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="font-semibold text-navy-text underline underline-offset-2 hover:text-amber-deep"
    >
      {children}
    </a>
  ) : (
    <Link
      href={href}
      className="font-semibold text-navy-text underline underline-offset-2 hover:text-amber-deep"
    >
      {children}
    </Link>
  );
}

/**
 * A table that scrolls inside itself on a phone rather than making the whole
 * page scroll sideways.
 */
export function Table({
  caption,
  head,
  rows,
}: {
  caption: string;
  head: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="mb-6 overflow-x-auto rounded-lg border-2 border-edge">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-bg">
          <tr>
            {head.map((h) => (
              <th
                key={h}
                scope="col"
                className="border-b-2 border-edge px-4 py-3 font-bold text-navy-text"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-edge last:border-0">
              {row.map((cell, j) => {
                const content = <span className="leading-relaxed">{cell}</span>;
                return j === 0 ? (
                  <th
                    key={j}
                    scope="row"
                    className="px-4 py-3 align-top font-semibold text-navy-text"
                  >
                    {content}
                  </th>
                ) : (
                  <td key={j} className="px-4 py-3 align-top text-ink">
                    {content}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Placed after the second H2: where a reader has enough to act on. */
export function InlineCta({
  slug,
  trade,
  children,
}: {
  slug: string;
  trade: RelatedTrade;
  children?: ReactNode;
}) {
  return (
    <aside className="my-8 flex flex-col gap-4 rounded-lg border-2 border-navy bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="font-bold text-navy-text">
        {children ?? "Want a fixed price for yours? It takes about a minute."}
      </p>
      <div className="flex shrink-0 flex-wrap gap-2">
        <Link
          href={guideQuoteHref(slug, trade)}
          className="rounded-md bg-amber px-4 py-2.5 text-sm font-bold text-on-amber no-underline transition hover:bg-amber-deep"
        >
          Get a fixed quote
        </Link>
        <a
          href={telHref}
          className="rounded-md border-2 border-navy px-4 py-2 text-sm font-bold text-navy-text no-underline transition hover:bg-navy hover:text-white"
        >
          {site.phone.display}
        </a>
      </div>
    </aside>
  );
}

/** Closing call to action at the foot of every guide. */
export function FinalCta({ slug, trade }: { slug: string; trade: RelatedTrade }) {
  return (
    <section
      aria-labelledby="guide-cta"
      className="mt-12 rounded-lg border-2 border-navy bg-navy p-6 text-white sm:p-8"
    >
      <h2 id="guide-cta" className="text-2xl font-bold">
        Want an exact number?
      </h2>
      <p className="mt-2 max-w-[40rem] text-white/80">
        Tell me your trade and where you work, and I&apos;ll send a fixed price,
        usually within one working day.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={guideQuoteHref(slug, trade)}
          className="rounded-md bg-amber px-5 py-3 text-sm font-bold text-on-amber no-underline transition hover:bg-amber-deep"
        >
          Get a fixed quote
        </Link>
        <a
          href={telHref}
          className="rounded-md border-2 border-white/60 px-5 py-3 text-sm font-bold text-white no-underline transition hover:bg-white/10"
        >
          Call {site.phone.display}
        </a>
        <a
          href={whatsappHref()}
          target="_blank"
          rel="noreferrer noopener"
          className="rounded-md border-2 border-white/60 px-5 py-3 text-sm font-bold text-white no-underline transition hover:bg-white/10"
        >
          WhatsApp
        </a>
      </div>
    </section>
  );
}
