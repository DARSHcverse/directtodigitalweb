import { Container } from "@/components/Container";

/**
 * Sales argument as numbers.
 *
 * Every figure must name and link a source a visitor can open. The band
 * previously carried 67% and 41% figures attributed to "UK trades sector
 * research, 2026", which nobody could check; a prospect who disproves one
 * number stops believing the rest. Both checked against their sources on
 * 13 October 2026.
 */
const stats = [
  {
    figure: "35%",
    label: "of UK sole traders still have no website",
    source: "UK Business Data Survey 2024, DSIT",
    href: "https://www.gov.uk/government/statistics/uk-business-data-survey-2024",
  },
  {
    figure: "97%",
    label: "of people read reviews when choosing a local business",
    source: "BrightLocal Local Consumer Review Survey 2026",
    href: "https://www.brightlocal.com/research/local-consumer-review-survey/",
  },
] as const;

export function ProofBand() {
  return (
    <section aria-labelledby="proof-band" className="border-y-2 border-navy bg-navy">
      <h2 id="proof-band" className="sr-only">
        Why a website matters
      </h2>
      <Container>
        <div className="grid divide-y divide-white/15 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          {stats.map((stat) => (
            <div key={stat.figure} className="px-2 py-10 sm:px-8">
              <p className="text-5xl font-bold tracking-display text-amber lg:text-6xl">
                {stat.figure}
              </p>
              <p className="mt-3 max-w-[300px] text-sm leading-relaxed text-white/80">
                {stat.label}
              </p>
              <a
                href={stat.href}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-3 inline-block text-xs text-white/75 underline-offset-2 hover:text-white hover:underline"
              >
                Source: {stat.source} ↗
              </a>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
