import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with D2D Web about your website project. I reply within one business day.",
};

export default function ContactPage() {
  return (
    <section className="py-12">
      <Container>
        <h1 className="mb-2 text-4xl font-bold">Contact</h1>
        <p className="mb-8 text-lg text-muted">
          Tell me about your project. I typically reply within one business day.
        </p>
        <ContactForm />
      </Container>
    </section>
  );
}
