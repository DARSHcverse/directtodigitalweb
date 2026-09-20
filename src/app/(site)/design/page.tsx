import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/Container";
import { ButtonLink } from "@/components/Button";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";
import { projects, projectsArePlaceholder } from "@/lib/projects";

export const metadata: Metadata = pageMetadata({
  title: "Recent Work",
  description:
    "Recent websites designed and built for small businesses across the UK — portfolio and case studies from D2D Web.",
  path: "/design",
  // Placeholder entries must never reach the index.
  noIndex: projectsArePlaceholder,
});

export default function DesignPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Work", path: "/design" },
        ])}
      />
      <section className="py-12">
        <Container>
          <h1 className="mb-2 text-4xl font-bold">Recent work</h1>
          <p className="mb-8 max-w-[640px] text-lg text-muted">
            A look at recent projects and the kinds of sites I build for small
            businesses.
          </p>

          {projects.length === 0 ? (
            <div className="rounded-2xl border border-edge bg-card/60 p-10 text-center backdrop-blur-md">
              <h2 className="mb-3 text-xl font-semibold">
                Case studies coming soon
              </h2>
              <p className="mx-auto max-w-[520px] leading-relaxed text-muted">
                I&apos;m currently writing up recent projects properly rather
                than posting screenshots without context. In the meantime, ask
                me directly and I&apos;ll walk you through relevant work and put
                you in touch with clients.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <ButtonLink href="/contact" variant="primary">
                  Ask to see examples
                </ButtonLink>
                <ButtonLink href="/services">What I build</ButtonLink>
              </div>
            </div>
          ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
            {projects.map((project) => (
              <article
                key={project.slug}
                className="group relative overflow-hidden rounded-2xl border border-edge bg-linear-[135deg,rgb(20_20_20/0.6),rgb(20_20_20/0.4)] p-6 backdrop-blur-md transition duration-300 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-[0_16px_40px_rgb(0_0_0/0.3)]"
              >
                <span className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-brand to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {project.image ? (
                  <Image
                    src={project.image}
                    alt={`${project.title} website`}
                    width={600}
                    height={338}
                    className="mb-5 h-[140px] w-full rounded-xl object-cover"
                  />
                ) : (
                  <div className="mb-5 h-[140px] rounded-xl border border-white/5 bg-linear-[135deg,var(--color-edge),rgb(139_92_246/0.1)]" />
                )}

                <h2 className="mb-1 text-xl font-semibold">{project.title}</h2>
                <p className="mb-2 text-sm text-muted">{project.client}</p>
                <p className="mb-4 text-muted">{project.summary}</p>

                <ul className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-edge px-3 py-1 text-xs text-muted"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>

                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-4 inline-block text-sm font-semibold text-brand hover:underline"
                  >
                    Visit site →
                  </a>
                ) : null}
              </article>
            ))}
          </div>
          )}

          <div className="mt-12 border-t border-edge pt-12 text-center">
            <h2 className="mb-4 text-2xl font-bold">
              Want something like this?
            </h2>
            <ButtonLink href="/quote" variant="primary">
              Get a free quote
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
