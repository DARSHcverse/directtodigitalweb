import type { Metadata } from "next";
import { Container, SectionLabel } from "@/components/Container";
import { QuoteForm } from "@/components/QuoteForm";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Free Tradesman Website Quote",
  description:
    "Get a free fixed-price quote for your trade website. Tell me what you need and I'll send a price and timeline within one working day. No obligation.",
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
      <section className="bg-blueprint border-b-2 border-navy py-14">
        <Container>
          <SectionLabel>No obligation</SectionLabel>
          <h1 className="mb-3 text-[clamp(2.1rem,5vw,3.2rem)] leading-[1.07] font-bold tracking-display text-navy-text">Get a fixed quote</h1>
          <p className="mb-8 max-w-[640px] text-lg text-muted">
            Tell me what you need and I&apos;ll send a fixed price and timeline —
            usually within one working day. No obligation, and no sales pitch.
          </p>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <QuoteForm />
        </Container>
      </section>
    </>
  );
}
