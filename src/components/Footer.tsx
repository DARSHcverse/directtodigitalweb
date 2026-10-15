import Link from "next/link";
import { Container } from "@/components/Container";
import {
  identityLine,
  serviceCatalogue,
  site,
  telHref,
  whatsappHref,
} from "@/lib/site";
import { landings } from "@/lib/landings";
import { listGuides } from "@/lib/guides";

const explore = [
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
] as const;

/** Linked only once there is a guide to read. */
const hasGuides = listGuides().length > 0;

const getStarted = [
  { href: "/quote", label: "Get a quote" },
  { href: "/booking", label: "Request a call" },
  { href: "/contact", label: "Contact" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-navy bg-navy text-white/80">
      <Container>
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="mb-3 text-lg font-bold text-white">
              Trade Web <span className="text-amber">Co.</span>
            </p>
            <p className="text-sm leading-relaxed text-white/70">
              Websites for UK tradespeople — written, built and set up for you.
            </p>
            <ul className="mt-5 grid gap-1.5 text-sm">
              <li>
                <a
                  href={telHref}
                  className="font-bold text-white no-underline transition hover:text-amber"
                >
                  {site.phone.display}
                </a>
              </li>
              <li>
                <a
                  href={whatsappHref()}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-white/70 no-underline transition hover:text-amber"
                >
                  WhatsApp me
                </a>
              </li>
              <li className="text-white/60">{site.phone.hours}</li>
            </ul>
          </div>

          <nav aria-labelledby="footer-services">
            <p id="footer-services" className="mb-3 text-sm font-semibold text-white">
              Services
            </p>
            <ul className="grid gap-2 text-sm">
              {serviceCatalogue.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services#${service.slug}`}
                    className="text-sm text-white/70 no-underline transition hover:text-amber"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-explore">
            <p id="footer-explore" className="mb-3 text-sm font-semibold text-white">
              Explore
            </p>
            <ul className="grid gap-2 text-sm">
              {landings.map((landing) => (
                <li key={landing.slug}>
                  <Link
                    href={`/for/${landing.slug}`}
                    className="text-sm text-white/70 no-underline transition hover:text-amber"
                  >
                    {landing.heading}
                  </Link>
                </li>
              ))}
              {hasGuides ? (
                <li>
                  <Link
                    href="/guides"
                    className="text-sm text-white/70 no-underline transition hover:text-amber"
                  >
                    Guides for tradespeople
                  </Link>
                </li>
              ) : null}
              {explore.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/70 no-underline transition hover:text-amber"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-start">
            <p id="footer-start" className="mb-3 text-sm font-semibold text-white">
              Get started
            </p>
            <ul className="grid gap-2 text-sm">
              {getStarted.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/70 no-underline transition hover:text-amber"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/portal"
                  className="text-sm text-white/70 no-underline transition hover:text-amber"
                >
                  Client login
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${site.contactEmail}`}
                  className="text-sm text-white/70 no-underline transition hover:text-amber"
                >
                  Email me
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/15 py-6 text-sm text-white/60 sm:flex-row">
          <div className="text-center sm:text-left">
            <p>
              © {year} {site.name}. All rights reserved.
            </p>
            {/* Electronic Commerce Regulations 2002, reg. 6: who provides the
                service, where, and how to reach them, on every page. */}
            <p className="mt-1 text-xs text-white/50">
              {identityLine}{" "}
              <a
                href={`mailto:${site.contactEmail}`}
                className="text-white/50 underline-offset-2 hover:text-amber hover:underline"
              >
                {site.contactEmail}
              </a>
            </p>
          </div>
          <nav aria-label="Legal" className="flex gap-5">
            <Link
              href="/privacy"
              className="text-white/60 no-underline transition hover:text-amber"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-white/60 no-underline transition hover:text-amber"
            >
              Terms
            </Link>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
