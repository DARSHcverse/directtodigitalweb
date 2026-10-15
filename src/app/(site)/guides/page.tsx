import type { Metadata } from "next";
import Link from "next/link";
import { Container, SectionLabel } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";
import { listGuides } from "@/lib/guides";
import { formatDate } from "@/lib/admin/shared";

const guides = listGuides();

export const metadata: Metadata = pageMetadata({
  title: "Website Guides for Tradespeople",
  description:
    "Plain-English guides for UK tradespeople on websites, Google and getting more of the jobs you want. Written by Shan at Trade Web Co.",
  path: "/guides",
  // An empty index is a thin page; keep it out of search until there is
  // something on it.
  noIndex: guides.length === 0,
});

export default function GuidesIndex() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
        ])}
      />
      <section className="bg-blueprint border-b-2 border-navy py-14">
        <Container>
          <SectionLabel>Plain English, no jargon</SectionLabel>
          <h1 className="mb-3 text-[clamp(2.1rem,5vw,3.2rem)] leading-[1.07] font-bold tracking-display text-navy-text">
            Guides for tradespeople
          </h1>
          <p className="max-w-[640px] text-lg text-muted">
            Straight answers on websites, Google and getting more of the jobs
            you actually want.
          </p>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          {guides.length === 0 ? (
            <p className="text-muted">The first guides are on their way.</p>
          ) : (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {guides.map((g) => (
                <li key={g.slug}>
                  <Link
                    href={`/guides/${g.slug}`}
                    className="flex h-full flex-col rounded-lg border-2 border-edge bg-surface p-6 no-underline transition hover:border-navy"
                  >
                    {g.status === "draft" ? (
                      <span className="mb-2 self-start rounded bg-amber px-2 py-0.5 text-xs font-bold text-on-amber">
                        DRAFT
                      </span>
                    ) : null}
                    <h2 className="text-lg font-bold text-navy-text">{g.title}</h2>
                    <p className="mt-2 flex-1 leading-relaxed text-muted">{g.excerpt}</p>
                    <p className="mt-4 text-sm text-muted">
                      {formatDate(g.updatedAt)} · {g.readMinutes} min read
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>
    </>
  );
}
