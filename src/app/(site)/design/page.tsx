import type { Metadata } from "next";
import { Container, SectionLabel } from "@/components/Container";
import { ButtonLink } from "@/components/Button";
import { ProjectCard } from "@/components/ProjectCard";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";
import { projects, projectsArePlaceholder } from "@/lib/projects";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Website Examples",
  description:
    "Websites and booking systems I've built that are running real businesses: a dealership and workshop site for a client, and booking sites for businesses I run myself.",
  path: "/design",
  noIndex: projectsArePlaceholder,
});

/** Lists the portfolio for search engines. */
function workListSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Recent work",
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: project.title,
      ...(project.url ? { url: project.url } : {}),
    })),
  };
}

export default function DesignPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Work", path: "/design" },
          ]),
          ...(projects.length > 0 ? [workListSchema()] : []),
        ]}
      />
      <section className="bg-blueprint border-b-2 border-navy py-14">
        <Container>
          <SectionLabel>Built and running</SectionLabel>
          <h1 className="mb-3 text-[clamp(2.1rem,5vw,3.2rem)] leading-[1.07] font-bold tracking-display text-navy-text">Work I&apos;ve built</h1>
          <p className="mb-10 max-w-[640px] text-lg text-muted">
            Sites and booking systems running real businesses. Some are for
            clients and some are businesses I run myself; each one is labelled.
            Running my own means I know what a missed enquiry costs.
          </p>
        </Container>
      </section>

      <section className="py-14">
        <Container>

          {projects.length === 0 ? (
            <div className="border-2 border-edge rounded-lg bg-surface p-10 text-center">
              <h2 className="mb-3 text-xl font-bold text-navy-text">
                Case studies coming soon
              </h2>
              <p className="mx-auto max-w-[520px] leading-relaxed text-muted">
                I&apos;m currently writing up recent projects properly. In the
                meantime, ask me directly and I&apos;ll walk you through
                relevant work.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <ButtonLink href="/contact" variant="primary">
                  Ask to see examples
                </ButtonLink>
                <ButtonLink href="/services">What I build</ButtonLink>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-8">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  detailed
                  // First two are likely above the fold.
                  priority={index < 2}
                />
              ))}
            </div>
          )}

          <div className="mt-16 border-t border-edge pt-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-display text-navy-text">
              Want something like this?
            </h2>
            <p className="mx-auto mb-8 max-w-[520px] text-muted">
              Tell me what your business needs and I&apos;ll send a fixed quote.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <ButtonLink href="/quote" variant="primary">
                Get a fixed quote
              </ButtonLink>
              <ButtonLink href={`mailto:${site.contactEmail}`}>
                Email me
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
