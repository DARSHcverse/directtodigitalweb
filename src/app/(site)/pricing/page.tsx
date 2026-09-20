import type { Metadata } from "next";
import { ButtonLink } from "@/components/Button";
import { Container } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";
import { tiers, formatFrom } from "@/lib/pricing";
import { cn } from "@/lib/cn";

export const metadata: Metadata = pageMetadata({
  title: "Website Pricing",
  description:
    "Transparent website pricing for UK small businesses. Fixed quotes from £800, agreed before any work starts — no hourly billing and no surprise invoices.",
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
      <section className="py-12">
        <Container>
          <h1 className="mb-2 text-4xl font-bold">Pricing</h1>
          <p className="mb-10 max-w-[640px] text-lg text-muted">
            Every project is quoted as a fixed price agreed before work starts.
            The figures below are starting points — tell me what you need and
            you&apos;ll get an exact number.
          </p>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-6">
            {tiers.map((tier) => (
              <article
                key={tier.name}
                className={cn(
                  "relative flex h-full flex-col rounded-2xl border bg-card/60 p-8 backdrop-blur-md transition duration-300",
                  tier.featured
                    ? "border-brand/60 shadow-[0_16px_40px_rgb(139_92_246/0.15)]"
                    : "border-edge hover:border-brand/40",
                )}
              >
                {tier.featured ? (
                  <span className="absolute -top-3 left-8 rounded-full bg-linear-to-r from-brand to-brand-dark px-3 py-1 text-xs font-semibold text-white">
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

                <ul className="mt-6 grid flex-1 gap-3 text-sm">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <span aria-hidden="true" className="text-brand">
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

          <div className="mt-12 rounded-2xl border border-edge bg-card/60 p-8 backdrop-blur-md">
            <h2 className="mb-3 text-xl font-semibold">
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
            <h2 className="mb-4 text-2xl font-bold">
              Not sure which fits?
            </h2>
            <p className="mx-auto mb-8 max-w-[520px] text-muted">
              Tell me about your business and I&apos;ll recommend the right
              option — even if it&apos;s the cheapest one.
            </p>
            <ButtonLink href="/quote" variant="primary">
              Get a free quote
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
