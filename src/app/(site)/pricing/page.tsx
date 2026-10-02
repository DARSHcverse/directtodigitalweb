import type { Metadata } from "next";
import { ButtonLink } from "@/components/Button";
import { Container, SectionLabel } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";
import { tiers, formatFrom, adminExplainer } from "@/lib/pricing";
import { cn } from "@/lib/cn";

export const metadata: Metadata = pageMetadata({
  title: "Tradesman Website Cost",
  description:
    "What a tradesman website costs in the UK: fixed prices from £800, no monthly fees and no retainer. See exactly what each package includes.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" },
        ])}
      />
      <section className="bg-blueprint border-b-2 border-navy py-14">
        <Container>
          <SectionLabel>Fixed prices, agreed up front</SectionLabel>
          <h1 className="mb-3 text-[clamp(2.1rem,5vw,3.2rem)] leading-[1.07] font-bold tracking-display text-navy-text">
            What a trade website costs
          </h1>
          <p className="mb-10 max-w-[640px] text-lg text-muted">
            Every project is quoted as a fixed price agreed before work starts.
            The figures below are starting points — tell me what you need and
            you&apos;ll get an exact number.
          </p>
        </Container>
      </section>

      <section className="py-14">
        <Container>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-6">
            {tiers.map((tier) => (
              <article
                key={tier.name}
                className={cn(
                  "relative flex h-full flex-col border-2 bg-surface p-8 transition duration-300",
                  tier.featured
                    ? "border-amber shadow-none"
                    : "border-edge hover:border-navy",
                )}
              >
                {tier.featured ? (
                  <span className="absolute -top-3 left-8 bg-amber rounded-md px-3 py-1 text-xs font-bold tracking-wide text-on-amber uppercase">
                    Most popular
                  </span>
                ) : null}

                <h2 className="text-xl font-semibold">{tier.name}</h2>
                <p className="mt-1 text-sm text-muted">{tier.tagline}</p>

                <p className="mt-6 flex items-baseline gap-2">
                  <span className="text-sm text-muted">from</span>
                  <span className="text-4xl font-bold">
                    {formatFrom(tier.from)}
                  </span>
                </p>
                <p className="mt-2 text-sm text-muted">{tier.bestFor}</p>

                <div className="mt-5 border-l-4 border-amber bg-bg py-3 pl-4">
                  <p className="text-sm font-bold text-navy-text">
                    {tier.admin.label}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {tier.admin.summary}
                  </p>
                </div>

                <ul className="mt-6 grid flex-1 gap-3 text-sm">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <span aria-hidden="true" className="text-amber-deep">
                        ✓
                      </span>
                      <span className="text-muted">{feature}</span>
                    </li>
                  ))}
                </ul>

                <ButtonLink
                  href="/quote"
                  variant={tier.featured ? "primary" : "secondary"}
                  className="mt-8 w-full"
                >
                  Get a quote
                </ButtonLink>
              </article>
            ))}
          </div>

          <section
            aria-labelledby="admin-explainer"
            className="mt-16 border-t-2 border-navy pt-12"
          >
            <SectionLabel>Updating your own site</SectionLabel>
            <h2
              id="admin-explainer"
              className="mb-3 text-3xl font-bold tracking-display text-navy-text"
            >
              {adminExplainer.heading}
            </h2>
            <p className="mb-10 max-w-[44rem] text-lg leading-relaxed text-muted">
              {adminExplainer.intro}
            </p>

            <div className="grid gap-px bg-edge sm:grid-cols-2">
              {adminExplainer.points.map((point) => (
                <article key={point.title} className="bg-bg p-6">
                  <h3 className="mb-2 text-lg font-bold text-navy-text">
                    {point.title}
                  </h3>
                  <p className="leading-relaxed text-muted">{point.body}</p>
                </article>
              ))}
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {adminExplainer.comparison.map((row) => (
                <article
                  key={row.tier}
                  className="border-2 border-edge rounded-lg bg-surface p-6"
                >
                  <p className="text-xs font-bold tracking-[0.2em] text-muted uppercase">
                    {row.tier}
                  </p>
                  <p className="mt-2 text-xl font-bold text-navy-text">{row.has}</p>
                  <p className="mt-3 leading-relaxed text-muted">
                    {row.detail}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <div className="mt-12 border-2 border-edge rounded-lg bg-surface p-8">
            <h2 className="mb-3 text-xl font-bold text-navy-text">
              What affects the price?
            </h2>
            <p className="leading-relaxed text-muted">
              Mostly the number of pages, whether the design is custom or
              adapted, and any features that need building — bookings, payments,
              logins or integrations. Hosting is typically a few pounds a month
              and billed to you directly, never marked up. If a project is
              outside what I can do well, I&apos;ll tell you rather than take it
              on.
            </p>
          </div>

          <div className="mt-12 border-t border-edge pt-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-display text-navy-text">
              Not sure which fits?
            </h2>
            <p className="mx-auto mb-8 max-w-[520px] text-muted">
              Tell me about your business and I&apos;ll recommend the right
              option — even if it&apos;s the cheapest one.
            </p>
            <ButtonLink href="/quote" variant="primary">
              Get a fixed quote
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
