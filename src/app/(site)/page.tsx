import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/Button";
import { Container, SectionLabel } from "@/components/Container";
import { FaqSection } from "@/components/FaqSection";
import { FeaturedWork } from "@/components/FeaturedWork";
import { ProofBand } from "@/components/ProofBand";
import { Testimonials } from "@/components/Testimonials";
import { JsonLd } from "@/components/JsonLd";
import { faqSchema } from "@/lib/schema";
import { faqs } from "@/lib/faqs";
import { pageMetadata } from "@/lib/metadata";
import { serviceCatalogue, site } from "@/lib/site";
import { landings } from "@/lib/landings";

export const metadata: Metadata = pageMetadata({
  title: site.tagline,
  description: site.description,
  path: "/",
});

const steps = [
  {
    title: "Tell me about the business",
    body: "A short call, or a few emails if you are on site. I learn what you do, who calls you, and what the site needs to bring in.",
  },
  {
    title: "You get a fixed price",
    body: "A number and a date, agreed before any work starts. No hourly billing, no scope creep, no surprise invoice at the end.",
  },
  {
    title: "I build it",
    body: "You see it early and say what you think. I write the words too, so you are not staring at a blank page wondering what to send me.",
  },
  {
    title: "It goes live",
    body: "Set up, tested and handed over. Ongoing support if you want it, and nothing you have to log into if you don't.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />

      {/* Asymmetric hero: content sits left of centre against a blueprint
          field, rather than the centred stack every template produces. */}
      <section className="bg-blueprint border-b-2 border-navy">
        <Container>
          <div className="grid items-center gap-12 py-16 lg:grid-cols-12 lg:py-24">
            <div className="lg:col-span-7">
              <SectionLabel>Websites for UK tradespeople</SectionLabel>
              {/* max-w forces a natural two-line break; a hard <br> orphaned
                  "up" at some widths. The highlight sits on the baseline
                  rather than under the descenders. */}
              <h1 className="max-w-[15ch] text-[clamp(2.4rem,5.4vw,3.9rem)] leading-[1.07] font-bold tracking-display text-navy-text">
                They&apos;re looking you up{" "}
                <span className="relative inline-block whitespace-nowrap">
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-[0.16em] h-[0.4em] dark-highlight"
                  />
                  <span className="relative">right now.</span>
                </span>
              </h1>
              <p className="mt-7 max-w-[34rem] text-lg leading-relaxed text-muted">
                Two thirds of customers check you online before they ring. If
                there&apos;s nothing to find, they call the next name on the
                list. I build websites for plumbers, electricians, builders and
                roofers — written and set up for you.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <ButtonLink href="/quote" variant="primary">
                  Get a fixed quote
                </ButtonLink>
                <ButtonLink href="/design" variant="secondary">
                  See recent work
                </ButtonLink>
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-2 text-sm text-muted">
                {[
                  "Fixed price up front",
                  "No monthly fees",
                  "Reply within one working day",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span aria-hidden="true" className="h-1.5 w-1.5 bg-amber" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Trade-card device: the credibility artefact a tradesperson
                already recognises, rather than a generic hero illustration. */}
            <div className="lg:col-span-5">
              <div className="mx-auto max-w-sm border-2 border-navy rounded-lg bg-surface">
                <div className="flex items-center justify-between border-b-2 border-navy bg-navy px-5 py-3">
                  <span className="text-xs font-bold tracking-[0.2em] text-white/70 uppercase">
                    Your business
                  </span>
                  <span className="h-2 w-2 bg-amber" />
                </div>
                <div className="p-6">
                  <span className="logo-swap inline-grid">
                  <Image
                    src="/TradeIcon.png"
                    alt=""
                    width={1080}
                    height={1080}
                    priority
                    className="logo-light h-14 w-14"
                  />
                  <Image
                    src="/TradeIcon-dark.png"
                    alt=""
                    aria-hidden="true"
                    width={1080}
                    height={1080}
                    priority
                    className="logo-dark h-14 w-14"
                  />
                  </span>
                  <p className="mt-5 text-xl font-bold text-navy-text">
                    Found in seconds
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    Name, trade, area covered, and a number they can tap. That
                    is what wins the job.
                  </p>
                  <dl className="mt-6 divide-y divide-edge border-t border-edge">
                    {[
                      ["Loads in", "Under 1s"],
                      ["Built for", "Phones first"],
                      ["You manage", "Nothing"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between py-2.5">
                        <dt className="text-sm text-muted">{k}</dt>
                        <dd className="text-sm font-semibold text-navy-text">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <ProofBand />

      {/* Trades index: the niche pages, surfaced as a directory row. */}
      <section aria-labelledby="trades" className="border-b border-edge py-16">
        <Container>
          <SectionLabel>Who I build for</SectionLabel>
          <h2
            id="trades"
            className="mb-8 max-w-[30rem] text-3xl font-bold tracking-display text-navy-text lg:text-4xl"
          >
            Built around your trade, not a template
          </h2>
          <div className="grid border-t-2 border-navy sm:grid-cols-2 lg:grid-cols-3">
            {landings.map((landing) => (
              <Link
                key={landing.slug}
                href={`/for/${landing.slug}`}
                className="group border-b border-edge p-6 no-underline transition hover:bg-navy sm:border-r"
              >
                <p className="text-lg font-bold text-navy-text transition group-hover:text-white">
                  {landing.heading}
                </p>
                <p className="mt-1 text-sm text-muted transition group-hover:text-white/70">
                  {landing.audience}
                </p>
                <span className="mt-4 inline-block text-sm font-bold text-amber">
                  View →
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="services-heading" className="border-b border-edge py-16">
        <Container>
          <SectionLabel>What I build</SectionLabel>
          <h2
            id="services-heading"
            className="mb-10 max-w-[32rem] text-3xl font-bold tracking-display text-navy-text lg:text-4xl"
          >
            Trades are what I know best. Any local business, really.
          </h2>
          <div className="grid gap-px bg-edge sm:grid-cols-3">
            {serviceCatalogue.map((service, i) => (
              <article key={service.name} className="bg-bg p-7">
                <span className="block text-5xl font-bold tracking-display text-edge">
                  0{i + 1}
                </span>
                <h3 className="mt-4 text-xl font-bold text-navy-text">
                  {service.name}
                </h3>
                <p className="mt-3 leading-relaxed text-muted">
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <Container>
        <FeaturedWork />
      </Container>

      {/* Process on navy: breaks the page rhythm so it doesn't read as an
          endless scroll of white cards. */}
      <section aria-labelledby="process-heading" className="border-y-2 border-navy bg-navy py-16 text-white">
        <Container>
          <p className="rule-label mb-4 text-xs font-bold tracking-[0.2em] text-white uppercase">
            How it works
          </p>
          <h2
            id="process-heading"
            className="mb-10 max-w-[30rem] text-3xl font-bold tracking-display lg:text-4xl"
          >
            Four steps. No jargon.
          </h2>
          <ol className="grid gap-px bg-white/15 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <li key={step.title} className="bg-navy p-6">
                <span className="block text-4xl font-bold tracking-display text-amber">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <Container>
        <Testimonials />
        <FaqSection />
      </Container>

      <section className="border-t-2 border-navy bg-blueprint py-16">
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <h2 className="max-w-[26rem] text-3xl font-bold tracking-display text-navy-text lg:text-4xl">
                Find out what it would cost
              </h2>
              <p className="mt-3 max-w-[30rem] text-muted">
                Tell me what you do and I&apos;ll send a fixed price, usually
                within one working day. No obligation, no sales call.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <ButtonLink href="/quote" variant="primary">
                Get a fixed quote
              </ButtonLink>
              <ButtonLink href="/contact" variant="secondary">
                Ask a question
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
