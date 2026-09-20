import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { QuoteForm } from "@/components/QuoteForm";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Get a Free Website Quote",
  description:
    "Request a free, fixed-price quote for your website. Tell me what your business needs and I'll send a tailored estimate within one business day.",
  path: "/quote",
});

export default function QuotePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Quote", path: "/quote" },
        ])}
      />
      <section className="py-12">
        <Container>
          <h1 className="mb-2 text-4xl font-bold">Get a free quote</h1>
          <p className="mb-8 max-w-[640px] text-lg text-muted">
            Tell me what you need and I&apos;ll send a fixed price and timeline —
            usually within one business day. No obligation, and no sales pitch.
          </p>
          <QuoteForm />
        </Container>
      </section>
    </>
  );
}
