import type { Metadata } from "next";
import { Container, SectionLabel } from "@/components/Container";
import { BookingForm } from "@/components/BookingForm";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Book a Call About Your Website",
  description:
    "Book a free, no-obligation call to talk through your trade website. No sales pitch — just a straight answer on what you need and what it costs.",
  path: "/booking",
});

export default function BookingPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Booking", path: "/booking" },
        ])}
      />
      <section className="bg-blueprint border-b-2 border-navy py-14">
        <Container>
          <SectionLabel>No obligation</SectionLabel>
          <h1 className="mb-3 text-[clamp(2.1rem,5vw,3.2rem)] leading-[1.07] font-bold tracking-display text-navy-text">Book a call</h1>
          <p className="mb-8 max-w-[640px] text-lg text-muted">
            Prefer to talk it through? Send your details and I&apos;ll follow up
            by email to arrange a time that suits you.
          </p>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <BookingForm />
        </Container>
      </section>
    </>
  );
}
