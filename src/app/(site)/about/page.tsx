import type { Metadata } from "next";
import { ButtonLink } from "@/components/Button";
import { Container, SectionLabel } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";
import { Testimonials } from "@/components/Testimonials";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Trade Web Co is run by Darshan Subramaniam, a developer building websites for tradespeople and small businesses. Real sites, live and in use — not just portfolio pieces.",
  path: "/about",
});

/** TODO(Darshan): verify every claim here reflects your current situation. */
const facts = [
  { label: "Degree", value: "BSc Information Technology (Distinction)" },
  { label: "Focus", value: "Application development" },
  { label: "Works with", value: "Trades and small businesses" },
  { label: "Based", value: "UK, working remotely" },
  { label: "Also serving", value: "Long-standing clients in Australia" },
] as const;

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <section className="bg-blueprint border-b-2 border-navy py-14">
        <Container>
          <SectionLabel>Who you&apos;re dealing with</SectionLabel>
          <h1 className="mb-3 text-[clamp(2.1rem,5vw,3.2rem)] leading-[1.07] font-bold tracking-display text-navy">About</h1>
          <p className="mb-10 max-w-[640px] text-lg text-muted">
            {site.name} is run by {site.founder} — one developer, working
            directly with you.
          </p>
        </Container>
      </section>

      <section className="py-14">
        <Container>

          <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
            <div className="grid gap-4 text-muted">
              <p className="leading-relaxed">
                I&apos;m a developer with a distinction-grade degree in
                Information Technology. More usefully for you: I build things
                businesses actually run on, not portfolio exercises.
              </p>
              <p className="leading-relaxed">
                That includes a 24/7 booking and CRM platform handling staff
                scheduling, invoicing and payments, and an event booking site
                with Stripe checkout that started taking bookings in its first
                week live. Both are still running and still maintained.
              </p>
              <p className="leading-relaxed">
                I studied in Australia and built up a client base there, and I
                still look after those sites today. Working across two markets
                is useful in a way that might not be obvious: the same handful
                of things decide whether a small business gets found and gets
                called, wherever it trades. You get the benefit of having seen
                that work, and fail, more than once.
              </p>
              <p className="leading-relaxed">
                Working with me means dealing with the person who actually
                builds your site. No account managers, no work quietly passed to
                someone else, and no jargon unless you want the detail. You get
                a fixed price before anything starts, and you see the design
                early enough to change your mind.
              </p>
              <p className="leading-relaxed">
                If your project isn&apos;t something I can do well, I&apos;ll
                say so and point you elsewhere. That&apos;s cheaper for both of
                us than finding out halfway through.
              </p>
            </div>

            <aside className="h-fit border-2 border-edge bg-surface p-8">
              <h2 className="mb-6 text-sm font-semibold tracking-widest text-amber-deep uppercase">
                At a glance
              </h2>
              <dl className="grid gap-5">
                {facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="text-xs tracking-wider text-muted uppercase">
                      {fact.label}
                    </dt>
                    <dd className="mt-1 font-medium">{fact.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 border-t border-edge pt-6">
                <p className="mb-3 text-xs font-bold tracking-[0.2em] text-navy uppercase">
                  Check me out
                </p>
                <ul className="grid gap-2">
                  {site.sameAs.map((url) => (
                    <li key={url}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-sm font-semibold text-navy no-underline hover:text-amber-deep"
                      >
                        {url.includes("linkedin") ? "LinkedIn" : "GitHub"} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>

          <Testimonials />

          <div className="border-t border-edge pt-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-display text-navy">Let&apos;s talk</h2>
            <p className="mx-auto mb-8 max-w-[520px] text-muted">
              Tell me what your business needs and I&apos;ll tell you honestly
              whether I can help.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <ButtonLink href="/quote" variant="primary">
                Get a fixed quote
              </ButtonLink>
              <ButtonLink href="/contact">Ask a question</ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
