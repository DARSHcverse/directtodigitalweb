import { Container, SectionLabel } from "@/components/Container";
import { legalUpdated } from "@/lib/legal";

type Section = { readonly heading: string; readonly body: readonly string[] };

export function LegalPage({
  label,
  title,
  intro,
  sections,
}: {
  label: string;
  title: string;
  intro: string;
  sections: readonly Section[];
}) {
  return (
    <>
      <section className="bg-blueprint border-b-2 border-navy py-14">
        <Container>
          <SectionLabel>{label}</SectionLabel>
          <h1 className="mb-3 text-[clamp(2.1rem,5vw,3.2rem)] leading-[1.07] font-bold tracking-display text-navy-text">
            {title}
          </h1>
          <p className="max-w-[640px] text-lg text-muted">{intro}</p>
          <p className="mt-4 text-sm text-muted">
            Last updated: {legalUpdated}
          </p>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <div className="max-w-[46rem]">
            {sections.map((section, i) => (
              <section
                key={section.heading}
                className={i > 0 ? "mt-10 border-t border-edge pt-10" : ""}
              >
                <h2 className="mb-4 text-xl font-bold text-navy-text">
                  {section.heading}
                </h2>
                <div className="grid gap-4">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="leading-relaxed text-muted">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
