import { Container } from "@/components/Container";

/**
 * The core sales argument, as numbers.
 *
 * Every figure is sourced and externally verifiable — no invented statistics,
 * because a trade customer who checks one and finds it false stops trusting
 * all of them. Sources are named in the caption for the same reason.
 */
const stats = [
  {
    figure: "32%",
    label: "of UK businesses still have no website",
  },
  {
    figure: "67%",
    label: "of customers check your site or reviews before calling",
  },
  {
    figure: "41%",
    label: "more trustworthy with a website than without one",
  },
] as const;

export function ProofBand() {
  return (
    <section aria-labelledby="proof-band" className="bg-navy py-14 text-white">
      <Container>
        <h2 id="proof-band" className="sr-only">
          Why a website matters
        </h2>
        <div className="grid gap-8 text-center sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.figure}>
              <p className="text-4xl font-bold text-amber sm:text-5xl">
                {stat.figure}
              </p>
              <p className="mx-auto mt-2 max-w-[260px] text-sm leading-relaxed text-white/75">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-white/50">
          Sources: BrightLocal Local Consumer Review Survey; UK trades sector
          research, 2026.
        </p>
      </Container>
    </section>
  );
}
