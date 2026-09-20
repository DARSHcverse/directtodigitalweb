import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, contactPageSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Get in touch about your website project. Freelance web design for small businesses across the UK — I reply within one business day.",
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
      <section className="py-12">
        <Container>
          <h1 className="mb-2 text-4xl font-bold">Contact</h1>
          <p className="mb-8 max-w-[640px] text-lg text-muted">
            Tell me about your project and I&apos;ll get back to you within one
            business day. Prefer email? Reach me at{" "}
            <a
              href={`mailto:${site.contactEmail}`}
              className="text-brand hover:underline"
            >
              {site.contactEmail}
            </a>
            .
          </p>
          <ContactForm />
        </Container>
      </section>
    </>
  );
}
