import { ButtonLink } from "@/components/Button";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/lib/projects";

/** Homepage teaser — most visitors never reach a second page. */
export function FeaturedWork() {
  const featured = projects.slice(0, 3);
  if (featured.length === 0) return null;

  return (
    <section aria-labelledby="work-heading" className="py-16">
      <h2 id="work-heading" className="mb-2 text-3xl font-bold text-navy-text">
        Work I&apos;ve built
      </h2>
      <p className="mb-8 text-muted">
        Sites built for clients, running real businesses.
      </p>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
        {featured.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      <div className="mt-8 text-center">
        <ButtonLink href="/design">See all work</ButtonLink>
      </div>
    </section>
  );
}
