import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { QuoteForm } from "@/components/QuoteForm";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Tell D2D Web what you need and get a tailored estimate for your website project.",
};

export default function QuotePage() {
  return (
    <section className="py-12">
      <Container>
        <h1 className="mb-2 text-4xl font-bold">Request a Quote</h1>
        <p className="mb-8 text-lg text-muted">
          Tell me what you need and I&apos;ll send a tailored estimate.
        </p>
        <QuoteForm />
      </Container>
    </section>
  );
}
