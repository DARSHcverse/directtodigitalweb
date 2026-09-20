import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/Container";
import { ButtonLink } from "@/components/Button";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";
import { projects, projectsArePlaceholder } from "@/lib/projects";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Recent Work",
  description:
    "Websites and web apps built for real businesses — booking platforms, e-commerce, education software and local business sites. See recent work from D2D Web.",
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
      url: project.url,
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
      <section className="py-12">
        <Container>
          <h1 className="mb-2 text-4xl font-bold">Recent work</h1>
          <p className="mb-10 max-w-[640px] text-lg text-muted">
            Live sites and web apps built for real businesses — from booking
            platforms to local business websites. Every one of these is online
            and in use.
          </p>

          {projects.length === 0 ? (
            <div className="rounded-2xl border border-edge bg-card/60 p-10 text-center backdrop-blur-md">
              <h2 className="mb-3 text-xl font-semibold">
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
                <article
                  key={project.slug}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-edge bg-card/60 backdrop-blur-md transition duration-300 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-[0_16px_40px_rgb(0_0_0/0.3)]"
                >
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="block overflow-hidden border-b border-edge"
                  >
                    <Image
                      src={project.image}
                      alt={`Screenshot of the ${project.title} website`}
                      width={project.imageWidth}
                      height={project.imageHeight}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      // First two are likely above the fold.
                      priority={index < 2}
                      className="w-full transition duration-500 group-hover:scale-[1.03]"
                    />
                  </a>

                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="text-xl font-semibold">{project.title}</h2>
                    <p className="mt-1 text-sm text-muted">{project.client}</p>
                    <p className="mt-3 flex-1 leading-relaxed text-muted">
                      {project.summary}
                    </p>

                    <ul className="mt-5 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full border border-edge px-3 py-1 text-xs text-muted"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>

                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand no-underline hover:underline"
                    >
                      Visit live site
                      <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-16 border-t border-edge pt-12 text-center">
            <h2 className="mb-4 text-2xl font-bold">
              Want something like this?
            </h2>
            <p className="mx-auto mb-8 max-w-[520px] text-muted">
              Tell me what your business needs and I&apos;ll send a fixed quote.
              Happy to put you in touch with past clients too.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <ButtonLink href="/quote" variant="primary">
                Get a free quote
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
