import { Container } from "@/components/Container";

/**
 * Sales argument as numbers. Every figure is sourced and externally checkable —
 * a prospect who disproves one stops believing all of them.
 */
const stats = [
  { figure: "32%", label: "of UK businesses still have no website" },
  { figure: "67%", label: "check your site or reviews before calling" },
  { figure: "41%", label: "more trustworthy with a website than without" },
] as const;

export function ProofBand() {
  return (
    <section aria-labelledby="proof-band" className="border-y-2 border-navy bg-navy">
      <h2 id="proof-band" className="sr-only">
        Why a website matters
      </h2>
      <Container>
        <div className="grid divide-y divide-white/15 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {stats.map((stat) => (
            <div key={stat.figure} className="px-2 py-10 sm:px-8">
              <p className="text-5xl font-bold tracking-display text-amber lg:text-6xl">
                {stat.figure}
              </p>
              <p className="mt-3 max-w-[240px] text-sm leading-relaxed text-white/70">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
      <Container>
        <p className="border-t border-white/10 py-4 text-xs text-white/40">
          Sources: BrightLocal Local Consumer Review Survey; UK trades sector
          research, 2026.
        </p>
      </Container>
    </section>
  );
}
