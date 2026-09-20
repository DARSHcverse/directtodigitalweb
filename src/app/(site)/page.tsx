import { ButtonLink } from "@/components/Button";
import { Container } from "@/components/Container";

export default function HomePage() {
  return (
    <section className="px-0 pt-24 pb-16 text-center">
      <Container>
        <h1 className="mb-4 bg-linear-45 from-fg to-muted bg-clip-text text-[clamp(2.5rem,5vw,3.5rem)] font-bold text-transparent">
          D2D Web
        </h1>
        <p className="mx-auto mb-8 max-w-[600px] text-lg leading-relaxed text-muted">
          Designing fast, modern websites for small businesses.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <ButtonLink href="/quote" variant="primary">
            Get a Quote
          </ButtonLink>
          <ButtonLink href="/design">See Designs</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
