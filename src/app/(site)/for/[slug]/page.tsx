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
            name: landing.title,
            description: landing.metaDescription,
            path: `/for/${landing.slug}`,
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
              <h1 className="max-w-[16ch] text-[clamp(2.1rem,5vw,3.4rem)] leading-[1.07] font-bold tracking-display text-navy">
                {landing.heading}
              </h1>
              <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-muted">
                {landing.intro}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/quote" variant="primary">
                  Get a fixed quote
                </ButtonLink>
                <ButtonLink href="/pricing" variant="secondary">
                  See pricing
                </ButtonLink>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="mx-auto max-w-sm border-2 border-navy bg-surface">
                <div className="flex items-center justify-between border-b-2 border-navy bg-navy px-5 py-3">
                  <span className="text-xs font-bold tracking-[0.2em] text-white/70 uppercase">
                    What you get
                  </span>
                  <span className="h-2 w-2 bg-amber" />
                </div>
                <div className="p-6">
                  <Image
                    src="/TradeIcon.png"
                    alt=""
                    width={1080}
                    height={1080}
                    priority
                    className="h-12 w-12"
                  />
                  <p className="mt-5 text-xl font-bold text-navy">
                    {landing.card.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {landing.card.body}
                  </p>
                  <dl className="mt-6 divide-y divide-edge border-t border-edge">
                    {landing.card.rows.map(([label, value]) => (
                      <div key={label} className="flex justify-between gap-4 py-2.5">
                        <dt className="text-sm text-muted">{label}</dt>
                        <dd className="text-right text-sm font-semibold text-navy">
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
            <h2 id="problems" className="mb-6 text-3xl font-bold tracking-display text-navy">
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
            <h2 id="solutions" className="mb-2 text-3xl font-bold tracking-display text-navy">
              How I fix it
            </h2>
            <p className="mb-8 text-muted">
              What you actually get, and why it matters.
            </p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
              {landing.solutions.map((solution) => (
                <article
                  key={solution.title}
                  className="border-2 border-edge bg-surface p-6 transition duration-300 hover:border-navy"
                >
                  <h3 className="mb-3 text-lg font-semibold">
                    {solution.title}
                  </h3>
                  <p className="leading-relaxed text-muted">{solution.body}</p>
                </article>
              ))}
            </div>
          </section>

          {proof.length > 0 ? (
            <section aria-labelledby="proof" className="border-t border-edge py-16">
              <h2 id="proof" className="mb-2 text-3xl font-bold tracking-display text-navy">
                I&apos;ve built this before
              </h2>
              <p className="mb-8 text-muted">
                Live sites doing exactly this, in use today.
              </p>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
                {proof.map((project) => (
                  <article
                    key={project.slug}
                    className="group overflow-hidden border-2 border-edge bg-surface transition duration-300 hover:-translate-y-0.5 hover:border-navy"
                  >
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="block overflow-hidden border-b border-edge"
                    >
                      <Image
                        src={project.image}
                        alt={`Screenshot of the ${project.title} website`}
                        width={project.imageWidth}
                        height={project.imageHeight}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="aspect-[16/10] w-full object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                      />
                    </a>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold">{project.title}</h3>
                      <p className="mt-1 text-sm text-muted">
                        {project.client}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
              <div className="mt-8">
                <Link
                  href="/design"
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
            <h2 id="landing-faq" className="mb-8 text-3xl font-bold tracking-display text-navy">
              Common questions
            </h2>
            <div className="grid gap-4">
              {landing.faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group border-2 border-edge bg-surface p-6 transition hover:border-navy"
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
            <h2 className="mb-4 text-3xl font-bold tracking-display text-navy">
              Let&apos;s talk about your project
            </h2>
            <p className="mx-auto mb-8 max-w-[520px] text-muted">
              Tell me what you need and I&apos;ll send a fixed quote, usually
              within one working day.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <ButtonLink href="/quote" variant="primary">
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
