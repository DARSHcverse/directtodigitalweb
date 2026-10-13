import type { Metadata } from "next";
import { Container, SectionLabel } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, contactPageSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";
import { identityLine, site, telHref, whatsappHref } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Call, WhatsApp or email about a website for your trade business. You deal with the person who builds it, and get a reply within one working day.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          contactPageSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ]}
      />
      <section className="bg-blueprint border-b-2 border-navy py-14">
        <Container>
          <SectionLabel>Talk to the person who builds it</SectionLabel>
          <h1 className="mb-3 text-[clamp(2.1rem,5vw,3.2rem)] leading-[1.07] font-bold tracking-display text-navy-text">Get in touch about your website</h1>
          <p className="mb-8 max-w-[640px] text-lg text-muted">
            Ring, message or email — whichever suits you. You get me, not a
            receptionist or an account manager.
          </p>

          {/* Direct options first. Tradespeople phone and message; a form
              is the fallback, not the front door. */}
          <div className="grid gap-4 sm:grid-cols-3">
            <a
              href={telHref}
              className="rounded-lg border-2 border-navy bg-surface p-5 no-underline transition hover:border-amber"
            >
              <p className="text-xs font-bold tracking-[0.18em] text-muted uppercase">Call</p>
              <p className="mt-1 text-xl font-bold text-navy-text">{site.phone.display}</p>
              <p className="mt-1 text-sm text-muted">{site.phone.hours}</p>
            </a>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-lg border-2 border-navy bg-surface p-5 no-underline transition hover:border-amber"
            >
              <p className="text-xs font-bold tracking-[0.18em] text-muted uppercase">WhatsApp</p>
              <p className="mt-1 text-xl font-bold text-navy-text">Message me</p>
              <p className="mt-1 text-sm text-muted">Photos and voice notes welcome</p>
            </a>
            <a
              href={`mailto:${site.contactEmail}`}
              className="rounded-lg border-2 border-navy bg-surface p-5 no-underline transition hover:border-amber"
            >
              <p className="text-xs font-bold tracking-[0.18em] text-muted uppercase">Email</p>
              <p className="mt-1 text-lg font-bold break-all text-navy-text">{site.contactEmail}</p>
              <p className="mt-1 text-sm text-muted">Reply within one working day</p>
            </a>
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <h2 className="mx-auto mb-6 max-w-[640px] text-2xl font-bold tracking-display text-navy-text">
            Or send a message
          </h2>
          <ContactForm />
          <p className="mx-auto mt-10 max-w-[640px] text-center text-sm text-muted">
            {identityLine}
          </p>
        </Container>
      </section>
    </>
  );
}
