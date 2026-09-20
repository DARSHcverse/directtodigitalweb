import type { Metadata } from "next";
import { ButtonLink } from "@/components/Button";
import { Container } from "@/components/Container";
import { FaqSection } from "@/components/FaqSection";
import { FeaturedWork } from "@/components/FeaturedWork";
import { Testimonials } from "@/components/Testimonials";
import { JsonLd } from "@/components/JsonLd";
import { faqSchema } from "@/lib/schema";
import { faqs } from "@/lib/faqs";
import { pageMetadata } from "@/lib/metadata";
import { serviceCatalogue, site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `${site.tagline}`,
  description: site.description,
  path: "/",
});

const steps = [
  {
    title: "Tell me about your business",
    body: "A short call or a few emails. I learn what you do, who you sell to, and what the site needs to achieve.",
  },
  {
    title: "You get a fixed quote",
    body: "A clear price and timeline agreed before any work starts. No hourly billing, no scope creep, no surprise invoices.",
  },
  {
    title: "Design and build",
    body: "You see the design early and give feedback as it takes shape, rather than waiting until the end to find out what you got.",
  },
  {
    title: "Launch and handover",
    body: "Your site goes live, and you get everything you need to run it. Ongoing support is available if you want it.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />

      <section className="pt-24 pb-16 text-center">
        <Container>
          <p className="mb-4 text-sm font-semibold tracking-widest text-brand uppercase">
            Freelance web design · UK-wide
          </p>
          <h1 className="mb-6 bg-linear-45 from-fg to-muted bg-clip-text text-[clamp(2.5rem,6vw,4rem)] leading-tight font-bold text-transparent">
            Websites that win you customers
          </h1>
          <p className="mx-auto mb-8 max-w-[640px] text-lg leading-relaxed text-muted">
            I design and build fast, modern websites for small businesses across
            the UK. Fixed quotes, clear timelines, and no jargon — just a site
            that makes your business look the part and brings in enquiries.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <ButtonLink href="/quote" variant="primary">
              Get a free quote
            </ButtonLink>
            <ButtonLink href="/design">See recent work</ButtonLink>
          </div>
          <p className="mt-6 text-sm text-muted">
            Free, no-obligation quote · Reply within one business day
          </p>
        </Container>
      </section>

      <Container>
        <section aria-labelledby="services-heading" className="py-16">
          <h2 id="services-heading" className="mb-2 text-3xl font-bold">
            What I build
          </h2>
          <p className="mb-8 text-muted">
            Whatever your business needs online, built properly from the start.
          </p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
            {serviceCatalogue.map((service) => (
              <article
                key={service.name}
                className="rounded-2xl border border-edge bg-card/60 p-6 backdrop-blur-md transition duration-300 hover:-translate-y-1.5 hover:border-brand/40"
              >
                <h3 className="mb-3 text-xl font-semibold">{service.name}</h3>
                <p className="leading-relaxed text-muted">
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <FeaturedWork />

        <section aria-labelledby="process-heading" className="py-16">
          <h2 id="process-heading" className="mb-2 text-3xl font-bold">
            How it works
          </h2>
          <p className="mb-8 text-muted">
            Four steps from first conversation to a live website.
          </p>
          <ol className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="rounded-2xl border border-edge bg-card/60 p-6 backdrop-blur-md"
              >
                <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-r from-brand to-brand-dark font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <Testimonials />

        <FaqSection />

        <section className="border-t border-edge py-16 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Ready to get started?
          </h2>
          <p className="mx-auto mb-8 max-w-[520px] text-muted">
            Tell me what you need and I&apos;ll send over a fixed quote — usually
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
    </>
  );
}
