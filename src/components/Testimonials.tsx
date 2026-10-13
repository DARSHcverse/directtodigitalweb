import { testimonials } from "@/lib/testimonials";

export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section aria-labelledby="testimonials-heading" className="py-16">
      <h2 id="testimonials-heading" className="mb-8 text-3xl font-bold tracking-display text-navy-text">
        What people I&apos;ve built for say
      </h2>
      <div className="gap-6 md:columns-2">
        {testimonials.map((item) => (
          <figure
            key={item.author}
            className="mb-6 break-inside-avoid rounded-lg border-2 border-edge bg-surface p-8"
          >
            <span aria-hidden="true" className="text-4xl leading-none text-amber-deep">
              &ldquo;
            </span>
            <blockquote className="mt-2 text-lg leading-relaxed">
              {item.quote}
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-r from-navy to-navy-soft text-sm font-bold text-white"
              >
                {item.initials}
              </span>
              <span>
                <span className="block font-semibold">
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noreferrer noopener">
                      {item.author}
                    </a>
                  ) : (
                    item.author
                  )}
                </span>
                <span className="block text-sm text-muted">
                  {item.role}
                  {item.town ? `, ${item.town}` : ""}
                </span>
                {item.incentive ? (
                  <span className="block text-xs text-muted">
                    {item.incentive}
                  </span>
                ) : null}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
