import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/Button";
import { Container, SectionLabel } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";
import { landingGroups, landings } from "@/lib/landings";

export const metadata: Metadata = pageMetadata({
  title: "Websites for Garages, Trades and Small Businesses",
  description:
    "Websites and online booking for UK garages, detailers, mobile mechanics, car dealers, plumbers, electricians, builders and roofers. Fixed price, no monthly fee.",
  path: "/for",
});

/**
 * Every industry page, grouped by audience. The navigation's "Trades" link
 * lands here, and the homepage links to #trades, so each group carries an
 * id. Apps get a line at the end rather than a group: they are for anyone.
 */
export default function ForIndexPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Who I build for", path: "/for" },
        ])}
      />
      <section className="bg-blueprint border-b-2 border-navy py-14">
        <Container>
          <SectionLabel>Who I build for</SectionLabel>
          <h1 className="max-w-[20ch] text-[clamp(2.1rem,5vw,3.2rem)] leading-[1.07] font-bold tracking-display text-navy-text">
            Websites for garages, trades and small businesses
          </h1>
          <p className="mt-4 max-w-[640px] text-lg text-muted">
            Each page below is written for one kind of business: what its
            customers look for, and what the site has to do. Pick yours.
          </p>
        </Container>
      </section>

      <Container className="py-14">
        {landingGroups.map((group) => {
          const pages = landings.filter((l) => l.group === group.id);
          if (pages.length === 0) return null;
          return (
            <section
              key={group.id}
              id={group.id}
              aria-labelledby={`${group.id}-heading`}
              className="mb-14 scroll-mt-24"
            >
              <h2
                id={`${group.id}-heading`}
                className="mb-6 text-2xl font-bold tracking-display text-navy-text lg:text-3xl"
              >
                {group.label}
              </h2>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
                {pages.map((landing) => (
                  <Link
                    key={landing.slug}
                    href={`/for/${landing.slug}`}
                    className="group flex flex-col rounded-lg border-2 border-edge bg-surface p-6 no-underline transition duration-300 hover:-translate-y-1 hover:border-navy"
                  >
                    <h3 className="text-lg font-bold text-navy-text">{landing.heading}</h3>
                    <p className="mt-2 flex-1 text-sm text-muted">{landing.audience}</p>
                    <span className="mt-4 text-sm font-bold text-amber-deep">
                      Read more <span aria-hidden="true">→</span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        <section className="flex flex-col gap-4 rounded-lg border-2 border-navy bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-navy-text">Need an app rather than a website?</h2>
            <p className="mt-1 text-muted">
              Web and mobile apps for any business, or for an idea of your own.
            </p>
          </div>
          <ButtonLink href="/apps" variant="primary" className="shrink-0">
            Apps
          </ButtonLink>
        </section>
      </Container>
    </>
  );
}
