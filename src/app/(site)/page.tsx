import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/Button";
import { Container, SectionLabel } from "@/components/Container";
import { FaqSection } from "@/components/FaqSection";
import { FeaturedWork } from "@/components/FeaturedWork";
import { LiveBuild } from "@/components/LiveBuild";
import { ProofBand } from "@/components/ProofBand";
import { MeetShan } from "@/components/MeetShan";
import { GuidesTeaser } from "@/components/GuidesTeaser";
import { Testimonials } from "@/components/Testimonials";
import { JsonLd } from "@/components/JsonLd";
import { faqSchema } from "@/lib/schema";
import { faqs } from "@/lib/faqs";
import { pageMetadata } from "@/lib/metadata";
import { formatFrom } from "@/lib/pricing";
import { serviceCatalogue, site, telHref } from "@/lib/site";
import { landings, type LandingGroup } from "@/lib/landings";

export const metadata: Metadata = pageMetadata({
  title: "Websites, Booking & Apps for Trades and Garages",
  description: site.description,
  path: "/",
});

function landingLinks(group: LandingGroup) {
  return landings
    .filter((l) => l.group === group)
    .map((l) => ({ href: `/for/${l.slug}`, label: l.heading }));
}

/**
 * The three ways in. Garages lead: online booking is where they feel the
 * pain most, and the hero picture is already a garage. Trades keep their
 * own door so the pages that already rank are still found. Apps are the
 * step up, open to anyone with an idea.
 */
const paths = [
  {
    label: "Garages & automotive",
    title: "Let drivers book their MOT online.",
    body: "Websites with booking for MOTs, servicing and repairs, for garages, detailers and mobile mechanics.",
    href: "/for/garages",
    cta: "Garage websites",
    links: landingLinks("automotive"),
  },
  {
    label: "Trades",
    title: "More of the jobs you want, fewer time-wasters.",
    body: "Websites for plumbers, electricians, builders and roofers, written and set up for you, from £800.",
    href: "/for#trades",
    cta: "Trade websites",
    links: landingLinks("trades"),
  },
  {
    label: "Booking systems & apps",
    title: "Got an app idea? I'll build it.",
    body: "Web and mobile apps, from booking systems to subscriptions, like DoBook and MyMathsHero.",
    href: "/apps",
    cta: "Apps",
    links: [
      { href: "/apps#web-apps", label: "Web apps" },
      { href: "/apps#mobile-apps", label: "Mobile apps for iPhone and Android" },
      { href: "/services#booking-systems", label: "Online booking systems" },
    ],
  },
] as const;

const steps = [
  {
    title: "Tell me what you need",
    body: "A short call, or a few emails if you are on site. A website, online booking or an app idea: I learn how the business works and what it has to do.",
  },
  {
    title: "You get a fixed price",
    body: "A number and a date, agreed before any work starts. No hourly billing, no scope creep, no surprise invoice at the end.",
  },
  {
    title: "I build it",
    body: "You see it early and say what you think. I write the words for websites, and with apps you try each part as it is built.",
  },
  {
    title: "It goes live",
    body: "Tested and handed over: the site online, the app in the stores. Support afterwards if you want it, and you own all of it.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />

      <section className="surface-navy overflow-hidden pb-16">
        <Container>
          <div className="pt-12 lg:pt-16">
            <p className="mb-5 font-mono text-sm text-amber">
              Websites, booking and apps for trades and garages
            </p>
            <h1 className="max-w-[12ch] text-[clamp(3.5rem,9vw,8.25rem)] leading-[0.92] font-extrabold tracking-display lg:max-w-none">
              Pick a business.
              <span className="block text-amber">Watch me build it.</span>
            </h1>
            <div className="mt-8 flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
              <div className="max-w-[38rem]">
                <p className="text-xl leading-snug text-muted">
                  I&apos;m Shan, a developer in Swansea. I build your website,
                  online booking and app. Fixed price, no monthly fee, and
                  it&apos;s yours.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <ButtonLink href="/quote" variant="primary">
                    Get a fixed quote
                  </ButtonLink>
                  <a
                    href={telHref}
                    className="lift inline-flex min-h-12 items-center rounded-full border-2 border-white px-6 font-bold text-white no-underline hover:bg-white hover:text-navy-deep"
                  >
                    Call {site.phone.display}
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-10">
              <LiveBuild />
            </div>
          </div>
        </Container>
      </section>

      <MeetShan />

      <section aria-labelledby="paths-heading" className="border-b border-edge py-16 lg:py-20">
        <Container>
          <SectionLabel>Who I build for</SectionLabel>
          <h2
            id="paths-heading"
            className="mb-10 max-w-[40rem] text-4xl leading-none font-extrabold tracking-display text-navy-text lg:text-6xl"
          >
            Pick the one that sounds like you
          </h2>
          <div className="grid gap-5 lg:grid-cols-3">
            {paths.map((path, i) => (
              <article
                key={path.label}
                className="sweep flex flex-col rounded-lg border-2 border-edge bg-surface p-7"
              >
                <p className="font-mono text-sm text-amber-deep">
                  {String(i + 1).padStart(2, "0")} / {path.label}
                </p>
                <h3 className="mt-12 text-4xl leading-none font-extrabold tracking-display text-navy-text">
                  {path.title}
                </h3>
                <p className="mt-4 leading-relaxed text-muted">{path.body}</p>
                {path.links.length > 0 ? (
                  <ul className="mt-6 divide-y divide-edge border-y border-edge text-sm">
                    {path.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="flex items-center justify-between py-2.5 font-semibold text-navy-text no-underline"
                        >
                          {link.label}
                          <span aria-hidden="true">→</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div className="mt-auto pt-7">
                  <Link
                    href={path.href}
                    className="lift inline-flex min-h-12 items-center rounded-full border-2 border-navy-text px-5 font-bold text-navy-text no-underline"
                  >
                    {path.cta} →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="services-heading" className="border-b border-edge py-16 lg:py-20">
        <Container>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionLabel>What I build</SectionLabel>
              <h2
                id="services-heading"
                className="max-w-[40rem] text-4xl leading-none font-extrabold tracking-display text-navy-text lg:text-6xl"
              >
                From a first website to a full app
              </h2>
            </div>
            <Link
              href="/pricing"
              className="text-sm font-bold text-navy-text hover:text-amber-deep"
            >
              See all prices →
            </Link>
          </div>
          <div className="grid gap-px overflow-hidden rounded-lg border-2 border-edge bg-edge sm:grid-cols-2 lg:grid-cols-3">
            {serviceCatalogue.map((service) => (
              <Link
                key={service.slug}
                href={`/services#${service.slug}`}
                className="sweep group flex flex-col bg-bg p-7 no-underline"
              >
                <h3 className="text-xl font-bold text-navy-text">{service.name}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-muted">
                  {service.description}
                </p>
                <p className="mt-5 flex items-center justify-between text-sm">
                  <span className="font-bold text-navy-text">
                    {"from" in service ? `From ${formatFrom(service.from)}` : "Fixed quote"}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-amber-deep transition group-hover:translate-x-1"
                  >
                    →
                  </span>
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <ProofBand />

      <Container>
        <FeaturedWork />
      </Container>

      <section aria-labelledby="process-heading" className="surface-navy py-20">
        <Container>
          <p className="rule-label mb-4 text-xs font-bold tracking-[0.2em] text-white uppercase">
            How it works
          </p>
          <h2
            id="process-heading"
            className="mb-10 max-w-[46rem] text-4xl leading-none font-extrabold tracking-display lg:text-6xl"
          >
            Four steps. No jargon.
          </h2>
          <ol className="grid gap-px bg-white/15 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <li key={step.title} className="bg-bg p-6">
                <span className="block text-4xl font-bold tracking-display text-amber">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <Container>
        <Testimonials />
        <GuidesTeaser />
        <FaqSection />
      </Container>

      <section className="surface-navy py-20">
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <h2 className="max-w-[46rem] text-4xl leading-none font-extrabold tracking-display text-navy-text lg:text-6xl">
                Find out what it would cost
              </h2>
              <p className="mt-3 max-w-[30rem] text-muted">
                Tell me what you need, a website, booking or an app, and
                I&apos;ll send a fixed price, usually within one working day.
                No obligation.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <ButtonLink href="/quote" variant="primary">
                Get a fixed quote
              </ButtonLink>
              <ButtonLink href="/booking" variant="secondary">
                Request a call
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
