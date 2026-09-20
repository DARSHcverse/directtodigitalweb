import Image from "next/image";
import { ButtonLink } from "@/components/Button";
import { projects } from "@/lib/projects";

/** Homepage teaser — most visitors never reach a second page. */
export function FeaturedWork() {
  const featured = projects.slice(0, 3);
  if (featured.length === 0) return null;

  return (
    <section aria-labelledby="work-heading" className="py-16">
      <h2 id="work-heading" className="mb-2 text-3xl font-bold">
        Recent work
      </h2>
      <p className="mb-8 text-muted">
        Live sites and web apps built for real businesses.
      </p>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
        {featured.map((project) => (
          <article
            key={project.slug}
            className="group overflow-hidden rounded-2xl border border-edge bg-card/60 backdrop-blur-md transition duration-300 hover:-translate-y-1.5 hover:border-brand/40"
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
                sizes="(max-width: 768px) 100vw, 33vw"
                className="w-full transition duration-500 group-hover:scale-[1.03]"
              />
            </a>
            <div className="p-6">
              <h3 className="text-lg font-semibold">{project.title}</h3>
              <p className="mt-1 text-sm text-muted">{project.client}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 text-center">
        <ButtonLink href="/design">See all work</ButtonLink>
      </div>
    </section>
  );
}
