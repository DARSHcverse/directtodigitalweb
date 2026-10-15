import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/Button";
import { Container, SectionLabel } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";
import { Testimonials } from "@/components/Testimonials";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";
import { identityLine, site, telHref, whatsappHref } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "About Shan, Web Designer in Swansea",
  description:
    "I'm Shan. I build every Trade Web Co site myself, answer the phone myself, and you own everything I build. Based in Swansea.",
  path: "/about",
});

const facts = [
  {
    label: "Degree",
    value: "Bachelor of Information Technology, majoring in Application Development, with Distinction",
  },
  { label: "Works with", value: "Trades and small businesses" },
  { label: "Based", value: `${site.locality}, ${site.region}` },
  { label: "Covers", value: "Swansea, Watford and London in person; the rest of the UK remotely" },
  { label: "Also", value: "Clients in Australia, where I studied" },
] as const;

/**
 * The question behind every sole-trader purchase: what happens if this one
 * person disappears? Answered plainly rather than left to worry about.
 */
const handover = [
  "You own the domain, registered in your name.",
  "You own the code and the hosting account, with the logins handed over at launch.",
  "Nothing is locked to me, so any developer can pick it up if you ever need one.",
];

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
          <div className="flex flex-col-reverse gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <SectionLabel>Who you&apos;re dealing with</SectionLabel>
              <h1 className="mb-3 text-[clamp(2.1rem,5vw,3.2rem)] leading-[1.07] font-bold tracking-display text-navy-text">
                I&apos;m Shan. I build every site myself.
              </h1>
              <p className="mb-6 max-w-[600px] text-lg text-muted">
                {site.name} is me — {site.founder}. I build your site, I answer
                the phone, and you own what I build.
              </p>
              <div className="mb-10 flex flex-wrap gap-3">
                <a
                  href={telHref}
                  className="rounded-md border-2 border-navy bg-navy px-5 py-3 text-sm font-bold text-white no-underline transition hover:bg-navy-deep"
                >
                  Call {site.phone.display}
                </a>
                <a
                  href={whatsappHref()}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-md border-2 border-navy px-5 py-3 text-sm font-bold text-navy-text no-underline transition hover:bg-navy hover:text-white"
                >
                  WhatsApp
                </a>
              </div>
            </div>
            {/* Tradespeople buy from a face. */}
            <Image
              src="/shan.webp"
              alt={`${site.founder}, who runs ${site.name}`}
              width={240}
              height={300}
              priority
              className="h-auto w-40 shrink-0 rounded-lg border-2 border-navy object-cover sm:w-52"
            />
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>

          <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
            <div className="grid content-start gap-4 text-muted">
              <p className="leading-relaxed">
                I&apos;m a developer with a Bachelor of Information Technology,
                majoring in application development, with distinction. More
                usefully for you: I build things businesses actually run on,
                not portfolio exercises.
              </p>
              <p className="leading-relaxed">
                For clients I&apos;ve built a local accountancy site in Watford,
                a car dealership and workshop site, and DoBook, a booking and
                invoicing platform for service businesses. I also run
                booking-led businesses of my own — The Shan Booth and Photo
                Booth Hire Swansea — so I know what a missed enquiry costs,
                because it costs me too.
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

            <aside className="h-fit border-2 border-edge rounded-lg bg-surface p-8">
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
                <p className="mb-3 text-xs font-bold tracking-[0.2em] text-navy-text uppercase">
                  If I&apos;m ever unavailable
                </p>
                <ul className="grid gap-2 text-sm text-muted">
                  {handover.map((line) => (
                    <li key={line} className="flex gap-2">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 bg-amber" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 border-t border-edge pt-6">
                <p className="mb-3 text-xs font-bold tracking-[0.2em] text-navy-text uppercase">
                  Check me out
                </p>
                <ul className="grid gap-2">
                  {site.sameAs.map((url) => (
                    <li key={url}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-sm font-semibold text-navy-text no-underline hover:text-amber-deep"
                      >
                        {url.includes("linkedin")
                          ? "LinkedIn"
                          : "GitHub (for the technically curious)"}{" "}
                        ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>

          <Testimonials />

          <div className="border-t border-edge pt-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-display text-navy-text">Let&apos;s talk</h2>
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
