import type { Metadata } from "next";
import { ButtonLink } from "@/components/Button";
import { Container } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";
import { Testimonials } from "@/components/Testimonials";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "D2D Web is run by Darshan Subramaniam, a full-stack developer building websites for small businesses. Real products, live and in use — not just portfolio pieces.",
  path: "/about",
});

/** TODO(Darshan): verify every claim here reflects your current situation. */
const facts = [
  { label: "Degree", value: "BSc Information Technology (Distinction)" },
  { label: "Focus", value: "Application development" },
  { label: "Works with", value: "Small businesses, UK-wide" },
  { label: "Stack", value: "React · Next.js · Node · Flutter" },
] as const;

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <section className="py-12">
        <Container>
          <h1 className="mb-2 text-4xl font-bold">About</h1>
          <p className="mb-10 max-w-[640px] text-lg text-muted">
            {site.name} is run by {site.founder} — one developer, working
            directly with you.
          </p>

          <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
            <div className="grid gap-4 text-muted">
              <p className="leading-relaxed">
                I&apos;m a full-stack developer with a distinction-grade degree
                in Information Technology, majoring in application development.
                More usefully for you: I build real products that real
                businesses run on, not portfolio exercises.
              </p>
              <p className="leading-relaxed">
                That includes a 24/7 booking and CRM platform handling staff
                scheduling, invoicing and payments, and an event booking site
                with Stripe checkout that started taking bookings in its first
                week live. Both are still running and still maintained.
              </p>
              <p className="leading-relaxed">
                Working with me means dealing with the person who actually
                builds your site. No account managers, no work quietly passed to
                someone else, and no jargon unless you want the detail. You get
                a fixed price before anything starts, and you see the design
                early enough to change your mind.
              </p>
              <p className="leading-relaxed">
                If your project isn&apos;t something I can do well, I&apos;ll
                say so and point you elsewhere. That&apos;s cheaper for both of
                us than finding out halfway through.
              </p>
            </div>

            <aside className="h-fit rounded-2xl border border-edge bg-card/60 p-8 backdrop-blur-md">
              <h2 className="mb-6 text-sm font-semibold tracking-widest text-brand uppercase">
                At a glance
              </h2>
              <dl className="grid gap-5">
                {facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="text-xs tracking-wider text-muted uppercase">
                      {fact.label}
                    </dt>
                    <dd className="mt-1 font-medium">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>

          <Testimonials />

          <div className="border-t border-edge pt-12 text-center">
            <h2 className="mb-4 text-2xl font-bold">Let&apos;s talk</h2>
            <p className="mx-auto mb-8 max-w-[520px] text-muted">
              Tell me what your business needs and I&apos;ll tell you honestly
              whether I can help.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <ButtonLink href="/quote" variant="primary">
                Get a free quote
              </ButtonLink>
              <ButtonLink href="/contact">Ask a question</ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
