import Link from "next/link";
import { listGuides } from "@/lib/guides";
import { formatDate } from "@/lib/admin/shared";

/** The three newest guides, above the homepage FAQ. Hidden until one exists. */
export function GuidesTeaser() {
  const guides = listGuides().slice(0, 3);
  if (guides.length === 0) return null;

  return (
    <section aria-labelledby="guides-heading" className="py-16">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <h2 id="guides-heading" className="text-3xl font-bold tracking-display text-navy-text">
          Guides for tradespeople
        </h2>
        <Link href="/guides" className="text-sm font-bold text-navy-text no-underline hover:text-amber-deep">
          All guides →
        </Link>
      </div>
      <ul className="grid gap-6 md:grid-cols-3">
        {guides.map((g) => (
          <li key={g.slug}>
            <Link
              href={`/guides/${g.slug}`}
              className="flex h-full flex-col rounded-lg border-2 border-edge bg-surface p-6 no-underline transition hover:border-navy"
            >
              <h3 className="text-lg font-bold text-navy-text">{g.title}</h3>
              <p className="mt-2 flex-1 leading-relaxed text-muted">{g.excerpt}</p>
              <p className="mt-4 text-sm text-muted">
                {formatDate(g.updatedAt)} · {g.readMinutes} min read
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
