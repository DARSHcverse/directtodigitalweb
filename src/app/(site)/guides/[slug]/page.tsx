import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";
import { FinalCta } from "@/components/guides/GuideBlocks";
import { blogPostingSchema, breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";
import { getGuide, listGuides, relatedGuides } from "@/lib/guides";
import { getLanding } from "@/lib/landings";
import { formatDate } from "@/lib/admin/shared";
import { site } from "@/lib/site";

/** Only guides that exist are built; any other slug is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return listGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  const base = pageMetadata({
    title: guide.metaTitle,
    description: guide.metaDescription,
    path: `/guides/${guide.slug}`,
    // Keep the suffix unless it would push the title past 60 characters.
    absoluteTitle: `${guide.metaTitle} | ${site.name}`.length > 60,
    noIndex: guide.status === "draft",
  });
  // Article rather than website, with the guide's own share image.
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: guide.publishedAt,
      modifiedTime: guide.updatedAt,
      authors: [site.founder],
      images: [
        {
          url: `/guides/${guide.slug}/og`,
          width: 1200,
          height: 630,
          alt: guide.title,
        },
      ],
    },
    twitter: {
      ...base.twitter,
      images: [`/guides/${guide.slug}/og`],
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const trade =
    guide.relatedTrade === "none" ? undefined : getLanding(guide.relatedTrade);
  const more = relatedGuides(guide);
  const { Body } = guide;

  return (
    <>
      <JsonLd
        data={[
          blogPostingSchema(guide),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
            { name: guide.title, path: `/guides/${guide.slug}` },
          ]),
        ]}
      />

      <article>
        <header className="bg-blueprint border-b-2 border-navy py-12">
          <Container>
            <div className="mx-auto max-w-[46rem]">
              <nav aria-label="Breadcrumb" className="mb-5 text-sm text-muted">
                <Link href="/" className="text-muted no-underline hover:text-navy-text">
                  Home
                </Link>{" "}
                /{" "}
                <Link href="/guides" className="text-muted no-underline hover:text-navy-text">
                  Guides
                </Link>
              </nav>
              {guide.status === "draft" ? (
                <p className="mb-4 inline-block rounded bg-amber px-2 py-0.5 text-xs font-bold text-on-amber">
                  DRAFT — not published, visible only in development
                </p>
              ) : null}
              <h1 className="text-[clamp(2rem,4.6vw,3rem)] leading-[1.1] font-bold tracking-display text-navy-text">
                {guide.title}
              </h1>
              <p className="mt-4 text-sm text-muted">
                By <Link href="/about" className="font-semibold text-navy-text">Shan</Link>
                {" · "}Updated{" "}
                <time dateTime={guide.updatedAt}>{formatDate(guide.updatedAt)}</time>
                {" · "}
                {guide.readMinutes} min read
              </p>
            </div>
          </Container>
        </header>

        <Container>
          <div className="mx-auto max-w-[46rem] py-10">
            <div className="mb-8 rounded-lg border-l-4 border-amber bg-surface p-5">
              <p className="mb-1 text-xs font-bold tracking-[0.18em] text-muted uppercase">
                Short answer
              </p>
              <p className="text-lg leading-relaxed text-ink">{guide.shortAnswer}</p>
            </div>

            <Body />

            {/* Who wrote it. A named author with a face is what separates
                a guide worth trusting from content-farm filler. */}
            <aside className="mt-12 flex items-center gap-4 rounded-lg border-2 border-edge bg-surface p-5">
              <Image
                src="/shan.webp"
                alt={`${site.founder}, who runs ${site.name}`}
                width={64}
                height={80}
                className="h-20 w-16 shrink-0 rounded-lg border-2 border-navy object-cover"
              />
              <p className="text-sm leading-relaxed text-muted">
                <span className="block font-bold text-navy-text">Written by Shan</span>
                I build websites for UK tradespeople, and I answer the phone
                myself. <Link href="/about" className="font-semibold text-navy-text">More about me</Link>
              </p>
            </aside>

            {/* Always shown: a trade page or pricing, plus other guides. */}
            <nav aria-labelledby="related" className="mt-10">
              <h2 id="related" className="mb-4 text-xl font-bold text-navy-text">
                Related
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {trade ? (
                  <li>
                    <Link
                      href={`/for/${trade.slug}`}
                      className="block rounded-lg border-2 border-edge bg-surface p-4 font-semibold text-navy-text no-underline hover:border-navy"
                    >
                      {trade.heading} →
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link
                      href="/pricing"
                      className="block rounded-lg border-2 border-edge bg-surface p-4 font-semibold text-navy-text no-underline hover:border-navy"
                    >
                      What a site costs with me →
                    </Link>
                  </li>
                )}
                {more.map((g) => (
                  <li key={g.slug}>
                    <Link
                      href={`/guides/${g.slug}`}
                      className="block rounded-lg border-2 border-edge bg-surface p-4 font-semibold text-navy-text no-underline hover:border-navy"
                    >
                      {g.title} →
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>


            <FinalCta slug={guide.slug} trade={guide.relatedTrade} />
          </div>
        </Container>
      </article>
    </>
  );
}
