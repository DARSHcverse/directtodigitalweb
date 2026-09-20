import Link from "next/link";
import { Container } from "@/components/Container";
import { site, serviceCatalogue } from "@/lib/site";

const explore = [
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/design", label: "Recent work" },
  { href: "/about", label: "About" },
] as const;

const getStarted = [
  { href: "/quote", label: "Get a quote" },
  { href: "/booking", label: "Book a call" },
  { href: "/contact", label: "Contact" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-edge">
      <Container>
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="mb-3 text-lg font-bold">{site.name}</p>
            <p className="text-sm leading-relaxed text-muted">
              Freelance web design and development for small businesses across
              the UK.
            </p>
          </div>

          <nav aria-labelledby="footer-services">
            <p id="footer-services" className="mb-3 text-sm font-semibold">
              Services
            </p>
            <ul className="grid gap-2 text-sm">
              {serviceCatalogue.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services#${service.slug}`}
                    className="text-muted no-underline transition hover:text-fg"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-explore">
            <p id="footer-explore" className="mb-3 text-sm font-semibold">
              Explore
            </p>
            <ul className="grid gap-2 text-sm">
              {explore.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted no-underline transition hover:text-fg"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-start">
            <p id="footer-start" className="mb-3 text-sm font-semibold">
              Get started
            </p>
            <ul className="grid gap-2 text-sm">
              {getStarted.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted no-underline transition hover:text-fg"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${site.contactEmail}`}
                  className="text-muted no-underline transition hover:text-fg"
                >
                  Email me
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="border-t border-edge py-6 text-center text-sm text-muted">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
