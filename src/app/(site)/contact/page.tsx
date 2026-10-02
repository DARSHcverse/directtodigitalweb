import type { Metadata } from "next";
import { Container, SectionLabel } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, contactPageSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Get in touch about a website for your trade business. I reply within one working day, and you deal with the person who builds it.",
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
          <SectionLabel>One working day reply</SectionLabel>
          <h1 className="mb-3 text-[clamp(2.1rem,5vw,3.2rem)] leading-[1.07] font-bold tracking-display text-navy-text">Get in touch about your website</h1>
          <p className="mb-8 max-w-[640px] text-lg text-muted">
            Tell me about your project and I&apos;ll get back to you within one
            working day. Prefer email? Reach me at{" "}
            <a
              href={`mailto:${site.contactEmail}`}
              className="text-amber-deep hover:underline"
            >
              {site.contactEmail}
            </a>
            .
          </p>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <ContactForm />
        </Container>
      </section>
    </>
  );
}
