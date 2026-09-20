import type { Metadata } from "next";
import { ButtonLink } from "@/components/Button";
import { Container } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";
import { serviceCatalogue } from "@/lib/site";
import { landings } from "@/lib/landings";
import Link from "next/link";

export const metadata: Metadata = pageMetadata({
  title: "Web Design Services",
  description:
    "Website design, redesign and e-commerce development for small businesses across the UK. Fixed quotes, clear timelines, built to be found on Google.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />
      <section className="py-12">
        <Container>
          <h1 className="mb-2 text-4xl font-bold">Services</h1>
          <p className="mb-12 max-w-[640px] text-lg text-muted">
            Three ways I help small businesses get online properly. Not sure
            which you need? Describe your situation and I&apos;ll point you to
            the right one.
          </p>

          <div className="grid gap-8">
            {serviceCatalogue.map((service) => (
              <article
                key={service.slug}
                id={service.slug}
                className="scroll-mt-24 rounded-2xl border border-edge bg-card/60 p-8 backdrop-blur-md transition duration-300 hover:border-brand/40"
              >
                <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
                  <div>
                    <h2 className="mb-3 text-2xl font-semibold">
                      {service.name}
                    </h2>
                    <p className="mb-4 leading-relaxed text-muted">
                      {service.detail}
                    </p>
                    <ButtonLink href="/quote" variant="primary">
                      Get a quote
                    </ButtonLink>
                  </div>

                  <div>
                    <h3 className="mb-4 text-sm font-semibold tracking-widest text-brand uppercase">
                      What&apos;s included
                    </h3>
                    <ul className="grid gap-3 text-sm">
                      {service.includes.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span aria-hidden="true" className="text-brand">
                            ✓
                          </span>
                          <span className="text-muted">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <section
            aria-labelledby="who-for"
            className="mt-16 border-t border-edge pt-12"
          >
            <h2 id="who-for" className="mb-2 text-2xl font-bold">
              Looking for something specific?
            </h2>
            <p className="mb-8 text-muted">
              More detail on the situations I most often get called about.
            </p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
              {landings.map((landing) => (
                <Link
                  key={landing.slug}
                  href={`/for/${landing.slug}`}
                  className="group rounded-2xl border border-edge bg-card/60 p-6 no-underline backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-brand/40"
                >
                  <h3 className="mb-2 text-lg font-semibold text-fg">
                    {landing.heading}
                  </h3>
                  <p className="text-sm text-muted">{landing.audience}</p>
                  <span className="mt-4 inline-block text-sm font-semibold text-brand">
                    Read more →
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <div className="mt-12 border-t border-edge pt-12 text-center">
            <h2 className="mb-4 text-2xl font-bold">
              Something else in mind?
            </h2>
            <p className="mx-auto mb-8 max-w-[520px] text-muted">
              If your project doesn&apos;t fit neatly into one of these, get in
              touch anyway and we&apos;ll work out what you need.
            </p>
            <ButtonLink href="/contact">Ask a question</ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
