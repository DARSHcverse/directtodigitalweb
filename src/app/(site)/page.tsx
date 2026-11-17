import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/Button";
import { Container, SectionLabel } from "@/components/Container";
import { FaqSection } from "@/components/FaqSection";
import { FeaturedWork } from "@/components/FeaturedWork";
import { HeroDevices } from "@/components/HeroDevices";
import { ProofBand } from "@/components/ProofBand";
import { MeetShan } from "@/components/MeetShan";
import { GuidesTeaser } from "@/components/GuidesTeaser";
import { Testimonials } from "@/components/Testimonials";
import { JsonLd } from "@/components/JsonLd";
import { cn } from "@/lib/cn";
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

      <section className="bg-blueprint border-b-2 border-navy">
        <Container>
          <div className="grid items-center gap-12 py-16 lg:grid-cols-12 lg:py-24">
            <div className="lg:col-span-7">
              <SectionLabel>Web &amp; app developer · Swansea · UK-wide</SectionLabel>
              <h1 className="max-w-[17ch] text-[clamp(2.4rem,5.4vw,3.9rem)] leading-[1.07] font-bold tracking-display text-navy-text">
                Websites, booking and apps for{" "}
                <span className="relative inline-block whitespace-nowrap">
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-[0.16em] h-[0.4em] dark-highlight"
                  />
                  <span className="relative">trades and garages.</span>
                </span>
              </h1>
              <p className="mt-7 max-w-[34rem] text-lg leading-relaxed text-muted">
                I&apos;m Shan, a developer in Swansea. I build your website,
                online booking and app. Fixed price, no monthly fee, and
                it&apos;s yours.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <ButtonLink href="/quote" variant="primary">
                  Get a fixed quote
                </ButtonLink>
                <a
                  href={telHref}
                  className="inline-flex items-center justify-center rounded-md border-2 border-navy px-6 py-3.5 text-sm font-bold tracking-wide text-navy-text no-underline transition hover:bg-navy hover:text-white"
                >
                  Call {site.phone.display}
                </a>
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-2 text-sm text-muted">
                {[
                  "Fixed price up front",
                  "No monthly fees",
                  "You own the code",
                  "Reply within one working day",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span aria-hidden="true" className="h-1.5 w-1.5 bg-amber" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-5">
              <HeroDevices />
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
            className="mb-10 max-w-[40rem] text-3xl font-bold tracking-display text-navy-text lg:text-4xl"
          >
            Pick the one that sounds like you
          </h2>
          <div className="grid gap-5 lg:grid-cols-3">
            {paths.map((path, i) => {
              const lead = i === 0;
              return (
                <article
                  key={path.label}
                  className={cn(
                    "flex flex-col rounded-lg border-2 p-7",
                    lead ? "border-navy bg-navy text-white" : "border-edge bg-surface",
                  )}
                >
                  <p
                    className={cn(
                      "text-xs font-bold tracking-[0.2em] uppercase",
                      lead ? "text-amber" : "text-amber-deep",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")} · {path.label}
                  </p>
                  <h3
                    className={cn(
                      "mt-4 text-2xl leading-tight font-bold tracking-display",
                      lead ? "text-white" : "text-navy-text",
                    )}
                  >
                    {path.title}
                  </h3>
                  <p className={cn("mt-3 leading-relaxed", lead ? "text-white/80" : "text-muted")}>
                    {path.body}
                  </p>
                  {path.links.length > 0 ? (
                    <ul
                      className={cn(
                        "mt-6 divide-y border-y text-sm",
                        lead ? "divide-white/15 border-white/15" : "divide-edge border-edge",
                      )}
                    >
                      {path.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className={cn(
                              "flex items-center justify-between py-2.5 font-semibold no-underline transition",
                              lead ? "text-white hover:text-amber" : "text-navy-text hover:text-amber-deep",
                            )}
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
                      className={cn(
                        "inline-flex rounded-md px-5 py-3 text-sm font-bold no-underline transition",
                        lead
                          ? "bg-amber text-on-amber hover:bg-white"
                          : "border-2 border-navy text-navy-text hover:bg-navy hover:text-white",
                      )}
                    >
                      {path.cta} →
                    </Link>
                  </div>
                </article>
              );
            })}
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
                className="max-w-[40rem] text-3xl font-bold tracking-display text-navy-text lg:text-4xl"
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
                className="group flex flex-col bg-bg p-7 no-underline transition hover:bg-surface"
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

      <section className="border-t-2 border-navy bg-blueprint py-16">
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <h2 className="max-w-[26rem] text-3xl font-bold tracking-display text-navy-text lg:text-4xl">
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
