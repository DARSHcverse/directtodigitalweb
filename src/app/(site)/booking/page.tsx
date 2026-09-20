import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { BookingForm } from "@/components/BookingForm";

export const metadata: Metadata = {
  title: "Book a Call",
  description:
    "Book a call with D2D Web to discuss your website project. No obligation.",
};

export default function BookingPage() {
  return (
    <section className="py-12">
      <Container>
        <h1 className="mb-2 text-4xl font-bold">Book a Call</h1>
        <p className="mb-8 text-lg text-muted">
          I&apos;ll follow up to lock in the details.
        </p>
        <BookingForm />
      </Container>
    </section>
  );
}
