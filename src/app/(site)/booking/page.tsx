import type { Metadata } from "next";
import { Container, SectionLabel } from "@/components/Container";
import { BookingForm } from "@/components/BookingForm";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Request a Call About Your Website",
  description:
    "Talk through your website by phone or on Zoom, at a time that suits you, with the person who builds it. Free, and no sales pitch.",
  path: "/booking",
});

export default function BookingPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Request a call", path: "/booking" },
        ])}
      />
      <section className="bg-blueprint border-b-2 border-navy py-14">
        <Container>
          <SectionLabel>Free, no obligation</SectionLabel>
          <h1 className="mb-3 text-[clamp(2.1rem,5vw,3.2rem)] leading-[1.07] font-bold tracking-display text-navy-text">
            Request a call
          </h1>
          <p className="mb-6 max-w-[640px] text-lg text-muted">
            Talk it through with me by phone or on Zoom. Tell
            me how and roughly when suits you, and I&apos;ll confirm an exact
            time — with a link if it&apos;s a video call.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              "Around 15 minutes",
              "Ideas for your trade, not a sales pitch",
              "You'll know what it would cost",
            ].map((point) => (
              <li
                key={point}
                className="flex items-center gap-2 text-sm font-semibold text-navy-text"
              >
                <span aria-hidden="true" className="h-1.5 w-1.5 bg-amber" />
                {point}
              </li>
            ))}
          </ul>
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
