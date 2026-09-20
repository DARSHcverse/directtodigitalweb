import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { BookingForm } from "@/components/BookingForm";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Book a Call",
  description:
    "Book a free, no-obligation call to talk through your website project with a UK freelance web designer.",
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
      <section className="py-12">
        <Container>
          <h1 className="mb-2 text-4xl font-bold">Book a call</h1>
          <p className="mb-8 max-w-[640px] text-lg text-muted">
            Prefer to talk it through? Send your details and I&apos;ll follow up
            by email to arrange a time that suits you.
          </p>
          <BookingForm />
        </Container>
      </section>
    </>
  );
}
