import Image from "next/image";
import type { ReactNode } from "react";
import { OWNERSHIP_LABEL, type Project } from "@/lib/projects";
import { cn } from "@/lib/cn";

/**
 * One portfolio card, used on the homepage, the work page and the trade pages.
 *
 * Three copies had drifted apart, and none said whose business each site
 * was. The ownership label is now part of the card itself, so it cannot be
 * left off one of them.
 *
 * A project without a live URL renders without links rather than pointing at
 * a preview deployment.
 */
export function ProjectCard({
  project,
  detailed = false,
  priority = false,
}: {
  project: Project;
  /** Summary, tags and a visit link, for the work page. */
  detailed?: boolean;
  priority?: boolean;
}) {
  const external = (children: ReactNode, className: string) =>
    project.url ? (
      <a
        href={project.url}
        target="_blank"
        rel="noreferrer noopener"
        className={className}
      >
        {children}
      </a>
    ) : (
      <div className={className}>{children}</div>
    );

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border-2 border-edge bg-surface transition duration-300 hover:-translate-y-0.5 hover:border-navy">
      {external(
        <Image
          src={project.image}
          alt={`Screenshot of the ${project.title} website`}
          width={project.imageWidth}
          height={project.imageHeight}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
          className="aspect-[16/10] w-full object-cover object-top transition duration-500 group-hover:scale-[1.03]"
        />,
        "block overflow-hidden border-b border-edge",
      )}

      <div className="flex flex-1 flex-col p-6">
        <p
          className={cn(
            "mb-2 self-start rounded px-2 py-0.5 text-[0.7rem] font-bold tracking-wide uppercase",
            project.ownership === "client"
              ? "bg-amber text-on-amber"
              : "bg-edge text-muted",
          )}
        >
          {OWNERSHIP_LABEL[project.ownership]}
        </p>
        <h3 className="text-lg font-semibold text-navy-text">{project.title}</h3>
        <p className="mt-1 text-sm text-muted">{project.client}</p>

        {detailed ? (
          <>
            <p className="mt-3 flex-1 leading-relaxed text-muted">
              {project.summary}
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-lg border border-edge px-2.5 py-1 text-xs text-muted"
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
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-amber-deep no-underline hover:underline"
              >
                Visit live site
                <span aria-hidden="true">↗</span>
              </a>
            ) : (
              <p className="mt-5 text-sm text-muted">Launching soon</p>
            )}
          </>
        ) : null}
      </div>
    </article>
  );
}
