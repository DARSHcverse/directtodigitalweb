import { testimonials } from "@/lib/testimonials";

export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section aria-labelledby="testimonials-heading" className="py-16">
      <h2 id="testimonials-heading" className="mb-8 text-3xl font-bold">
        What clients say
      </h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6">
        {testimonials.map((item) => (
          <figure
            key={item.author}
            className="rounded-2xl border border-edge bg-card/60 p-8 backdrop-blur-md"
          >
            <span aria-hidden="true" className="text-4xl leading-none text-brand">
              &ldquo;
            </span>
            <blockquote className="mt-2 text-lg leading-relaxed">
              {item.quote}
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-r from-brand to-brand-dark text-sm font-bold text-white"
              >
                {item.initials}
              </span>
              <span>
                <span className="block font-semibold">{item.author}</span>
                <span className="block text-sm text-muted">{item.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
