import { Container } from "@/components/Container";
import { site } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-5 border-t border-edge py-6 text-center text-sm text-muted">
      <Container>
        <p>
          © {year} {site.name}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
