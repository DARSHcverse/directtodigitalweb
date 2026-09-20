import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/Button";
import { Container } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
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
        ]}
      />

      <section className="py-12">
        <Container>
          <p className="mb-3 text-sm font-semibold tracking-widest text-brand uppercase">
            {landing.audience}
          </p>
          <h1 className="mb-4 text-[clamp(2rem,5vw,3rem)] leading-tight font-bold">
            {landing.heading}
          </h1>
          <p className="mb-8 max-w-[680px] text-lg leading-relaxed text-muted">
            {landing.intro}
          </p>
          <div className="flex flex-wrap gap-4">
            <ButtonLink href="/quote" variant="primary">
              Get a free quote
            </ButtonLink>
            <ButtonLink href="/pricing">See pricing</ButtonLink>
          </div>

          <section aria-labelledby="problems" className="py-16">
            <h2 id="problems" className="mb-6 text-2xl font-bold">
              Sound familiar?
            </h2>
            <ul className="grid gap-3">
              {landing.painPoints.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 rounded-xl border border-edge bg-card/60 px-5 py-4 backdrop-blur-md"
                >
                  <span aria-hidden="true" className="text-brand">
                    —
                  </span>
                  <span className="text-muted">{point}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="solutions" className="py-4 pb-16">
            <h2 id="solutions" className="mb-2 text-2xl font-bold">
              How I fix it
            </h2>
            <p className="mb-8 text-muted">
              What you actually get, and why it matters.
            </p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
              {landing.solutions.map((solution) => (
                <article
                  key={solution.title}
                  className="rounded-2xl border border-edge bg-card/60 p-6 backdrop-blur-md transition duration-300 hover:border-brand/40"
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
              <h2 id="proof" className="mb-2 text-2xl font-bold">
                I&apos;ve built this before
              </h2>
              <p className="mb-8 text-muted">
                Live sites doing exactly this, in use today.
              </p>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
                {proof.map((project) => (
                  <article
                    key={project.slug}
                    className="group overflow-hidden rounded-2xl border border-edge bg-card/60 backdrop-blur-md transition duration-300 hover:-translate-y-1.5 hover:border-brand/40"
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
                        className="w-full transition duration-500 group-hover:scale-[1.03]"
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
                  className="text-sm font-semibold text-brand no-underline hover:underline"
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
            <h2 id="landing-faq" className="mb-8 text-2xl font-bold">
              Common questions
            </h2>
            <div className="grid gap-4">
              {landing.faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-2xl border border-edge bg-card/60 p-6 backdrop-blur-md transition hover:border-brand/40"
                >
                  <summary className="cursor-pointer list-none text-lg font-semibold marker:content-none">
                    <span className="flex items-center justify-between gap-4">
                      {faq.question}
                      <span
                        aria-hidden="true"
                        className="shrink-0 text-brand transition-transform duration-300 group-open:rotate-45"
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
            <h2 className="mb-4 text-2xl font-bold">
              Let&apos;s talk about your project
            </h2>
            <p className="mx-auto mb-8 max-w-[520px] text-muted">
              Tell me what you need and I&apos;ll send a fixed quote, usually
              within one business day.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <ButtonLink href="/quote" variant="primary">
                Get a free quote
              </ButtonLink>
              <ButtonLink href="/contact">Ask a question</ButtonLink>
            </div>
          </section>
        </Container>
      </section>
    </>
  );
}
