import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/Container";
import { ButtonLink } from "@/components/Button";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Design Showcase",
  description:
    "Recent websites designed and built by D2D Web for small businesses across the UK.",
};

export default function DesignPage() {
  return (
    <section className="py-12">
      <Container>
        <h1 className="mb-2 text-4xl font-bold">Design Showcase</h1>
        <p className="mb-8 text-lg text-muted">
          A look at recent work and the kinds of sites I build.
        </p>

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

        <div className="mt-12 text-center">
          <ButtonLink href="/quote" variant="primary">
            Start your project
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
