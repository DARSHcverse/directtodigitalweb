import { faqs } from "@/lib/faqs";

export function FaqSection() {
  return (
    <section aria-labelledby="faq-heading" className="py-16">
      <h2 id="faq-heading" className="mb-8 text-3xl font-bold">
        Frequently asked questions
      </h2>
      <div className="grid gap-4">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="group rounded-2xl border border-edge bg-card/60 p-6 backdrop-blur-md transition hover:border-brand/40"
          >
            <summary className="cursor-pointer list-none text-lg font-semibold marker:content-none">
              <span className="flex items-center justify-between gap-4">
                {faq.question}
                <span
                  aria-hidden="true"
                  className="shrink-0 text-brand transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </span>
            </summary>
            <p className="mt-4 leading-relaxed text-muted">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
