import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/Button";
import { Container, SectionLabel } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";
import { landings, getLanding, proofFor } from "@/lib/landings";
import { ProjectCard } from "@/components/ProjectCard";
import { RichText } from "@/components/RichText";
import { guideForTrade } from "@/lib/guides";
import { whatsappHref } from "@/lib/site";

export function generateStaticParams() {
  return landings.map((landing) => ({ slug: landing.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const landing = getLanding(slug);
  if (!landing) return {};

  return pageMetadata({
    title: landing.title,
    description: landing.metaDescription,
    path: `/for/${landing.slug}`,
    image: `/for/${landing.slug}/og`,
  });
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const landing = getLanding(slug);
  if (!landing) notFound();

  const proof = proofFor(landing);
  const guide = guideForTrade(landing.slug);
  const quoteHref = landing.tradeParam
    ? `/quote?trade=${landing.tradeParam}`
    : "/quote";

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: landing.heading, path: `/for/${landing.slug}` },
          ]),
          faqSchema(landing.faqs),
          serviceSchema({
            // The plain service, not the title tag: "Websites for plumbers"
            // rather than "Plumber Website Design UK, from £800".
            name: landing.heading,
            description: landing.metaDescription,
            path: `/for/${landing.slug}`,
            audience: landing.audience,
          }),
        ]}
      />

      {/* Hero mirrors the homepage: asymmetric split against the blueprint
          field, with a spec card carrying trade-specific detail. Previously
          the right half was empty, which made these pages look unfinished
          next to the homepage. */}
      <section className="bg-blueprint border-b-2 border-navy">
        <Container>
          <div className="grid items-center gap-12 py-14 lg:grid-cols-12 lg:py-20">
            <div className="lg:col-span-7">
              <SectionLabel>{landing.audience}</SectionLabel>
              <h1 className="max-w-[16ch] text-[clamp(2.1rem,5vw,3.4rem)] leading-[1.07] font-bold tracking-display text-navy-text">
                {landing.heading}
              </h1>
              <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-muted">
                {landing.intro}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href={quoteHref} variant="primary">
                  Get a fixed quote
                </ButtonLink>
                <ButtonLink href="/pricing" variant="secondary">
                  See pricing
                </ButtonLink>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="mx-auto max-w-sm overflow-hidden rounded-lg border-2 border-navy bg-surface">
                <div className="flex items-center justify-between border-b-2 border-navy bg-navy px-5 py-3">
                  <span className="text-xs font-bold tracking-[0.2em] text-white/70 uppercase">
                    What you get
                  </span>
                  <span className="h-2 w-2 bg-amber" />
                </div>
                <div className="p-6">
                  <span className="logo-swap inline-grid">
                  <Image
                    src="/TradeIcon.png"
                    alt=""
                    width={48}
                    height={48}
                    priority
                    className="logo-light h-12 w-12"
                  />
                  <Image
                    src="/TradeIcon-dark.png"
                    alt=""
                    aria-hidden="true"
                    width={48}
                    height={48}
                    className="logo-dark h-12 w-12"
                  />
                  </span>
                  <p className="mt-5 text-xl font-bold text-navy-text">
                    {landing.card.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {landing.card.body}
                  </p>
                  <dl className="mt-6 divide-y divide-edge border-t border-edge">
                    {landing.card.rows.map(([label, value]) => (
                      <div key={label} className="flex justify-between gap-4 py-2.5">
                        <dt className="text-sm text-muted">{label}</dt>
                        <dd className="text-right text-sm font-semibold text-navy-text">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <section aria-labelledby="problems" className="py-16">
            <h2 id="problems" className="mb-6 text-3xl font-bold tracking-display text-navy-text">
              Sound familiar?
            </h2>
            <ul className="grid gap-3">
              {landing.painPoints.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 border-l-4 border-amber bg-surface px-5 py-4"
                >
                  <span aria-hidden="true" className="text-amber-deep">
                    —
                  </span>
                  <span className="text-muted">{point}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="solutions" className="py-4 pb-16">
            <h2 id="solutions" className="mb-2 text-3xl font-bold tracking-display text-navy-text">
              How I fix it
            </h2>
            <p className="mb-8 text-muted">
              What you actually get, and why it matters.
            </p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
              {landing.solutions.map((solution) => (
                <article
                  key={solution.title}
                  className="border-2 border-edge rounded-lg bg-surface p-6 transition duration-300 hover:border-navy"
                >
                  <h3 className="mb-3 text-lg font-semibold">
                    {solution.title}
                  </h3>
                  <p className="leading-relaxed text-muted">{solution.body}</p>
                </article>
              ))}
            </div>

            {/* Mid-page next step. The page persuades in the middle, and the
                only buttons were at the top and the bottom. */}
            <div className="mt-10 flex flex-col gap-4 rounded-lg border-2 border-navy bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-lg font-bold text-navy-text">
                {landing.tradeParam
                  ? `${/^[aeiou]/i.test(landing.tradeParam) ? "An" : "A"} ${landing.tradeParam} site like this`
                  : "A site like this"}
                : from £800, live in 2–4 weeks.
              </p>
              <div className="flex shrink-0 flex-wrap gap-3">
                <ButtonLink href={quoteHref} variant="primary">
                  Get a fixed quote
                </ButtonLink>
                <a
                  href={whatsappHref(
                    landing.tradeParam
                      ? `Hi Shan, I'm ${/^[aeiou]/i.test(landing.tradeParam) ? "an" : "a"} ${landing.tradeParam} and I'd like a price for a website.`
                      : undefined,
                  )}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center justify-center rounded-md border-2 border-navy px-6 py-3.5 text-sm font-bold tracking-wide text-navy-text no-underline transition hover:bg-navy hover:text-white"
                >
                  WhatsApp me
                </a>
              </div>
            </div>

            {guide ? (
              <p className="mt-5 text-muted">
                Comparing prices first? Read:{" "}
                <Link
                  href={`/guides/${guide.slug}`}
                  className="font-semibold text-navy-text underline underline-offset-2 hover:text-amber-deep"
                >
                  {guide.title}
                </Link>
              </p>
            ) : null}
          </section>

          {landing.sections?.map((section) => (
            <section
              key={section.id}
              aria-labelledby={section.id}
              className="border-t border-edge py-14"
            >
              <div className="max-w-[46rem]">
                <h2
                  id={section.id}
                  className="mb-4 text-3xl font-bold tracking-display text-navy-text"
                >
                  {section.heading}
                </h2>
                {section.paragraphs?.map((para) => (
                  <p key={para.slice(0, 40)} className="mb-4 text-lg leading-relaxed text-ink">
                    <RichText text={para} />
                  </p>
                ))}
                {section.bullets ? (
                  <ul className="mb-4 grid list-disc gap-2 pl-6 text-lg leading-relaxed text-ink marker:text-amber-deep">
                    {section.bullets.map((b) => (
                      <li key={b.slice(0, 40)}>
                        <RichText text={b} />
                      </li>
                    ))}
                  </ul>
                ) : null}
                {section.after?.map((para) => (
                  <p key={para.slice(0, 40)} className="mb-4 text-lg leading-relaxed text-ink">
                    <RichText text={para} />
                  </p>
                ))}
              </div>
            </section>
          ))}

          {proof.length > 0 ? (
            <section aria-labelledby="proof" className="border-t border-edge py-16">
              <h2 id="proof" className="mb-2 text-3xl font-bold tracking-display text-navy-text">
                Similar builds
              </h2>
              <p className="mb-8 text-muted">{landing.proofIntro}</p>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
                {proof.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </div>
              <div className="mt-8">
                <Link
                  href="/work"
                  className="text-sm font-semibold text-amber-deep no-underline hover:underline"
                >
                  See all work →
                </Link>
              </div>
            </section>
          ) : null}

          <section
            aria-labelledby="landing-faq"
            className="border-t border-edge py-16"
          >
            <h2 id="landing-faq" className="mb-8 text-3xl font-bold tracking-display text-navy-text">
              Common questions
            </h2>
            <div className="grid gap-4">
              {landing.faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group border-2 border-edge rounded-lg bg-surface p-6 transition hover:border-navy"
                >
                  <summary className="cursor-pointer list-none text-lg font-semibold marker:content-none">
                    <span className="flex items-center justify-between gap-4">
                      {faq.question}
                      <span
                        aria-hidden="true"
                        className="shrink-0 text-amber-deep transition-transform duration-300 group-open:rotate-45"
                      >
                        +
                      </span>
                    </span>
                  </summary>
                  <p className="mt-4 leading-relaxed text-muted">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="border-t border-edge py-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-display text-navy-text">
              Let&apos;s talk about your project
            </h2>
            <p className="mx-auto mb-8 max-w-[520px] text-muted">
              Tell me what you need and I&apos;ll send a fixed quote, usually
              within one working day.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <ButtonLink href={quoteHref} variant="primary">
                Get a fixed quote
              </ButtonLink>
              <ButtonLink href="/contact">Ask a question</ButtonLink>
            </div>
          </section>
        </Container>
      </section>
    </>
  );
}
