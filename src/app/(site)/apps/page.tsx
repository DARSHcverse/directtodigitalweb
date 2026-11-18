import type { Metadata } from "next";
import { ButtonLink } from "@/components/Button";
import { Container, SectionLabel } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";
import { ProjectCard } from "@/components/ProjectCard";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";
import { formatFrom } from "@/lib/pricing";
import { projects } from "@/lib/projects";
import { serviceCatalogue, site, telHref } from "@/lib/site";

const description =
  "Web and mobile apps for iPhone and Android, from booking systems to subscriptions, built by a UK developer. Web apps from £5,000, mobile apps from £8,000.";

export const metadata: Metadata = pageMetadata({
  title: "App Developer UK: Web and Mobile Apps",
  description,
  path: "/apps",
});

const appServices = serviceCatalogue.filter(
  (s) => s.slug === "web-apps" || s.slug === "mobile-apps",
);

/** The two apps Shan built: one for a client, one he co-runs. */
const caseStudies = ["mymathshero", "do-book"]
  .map((slug) => projects.find((p) => p.slug === slug))
  .filter((p) => p !== undefined);

const audiences = [
  {
    title: "A business that has outgrown its website",
    body: "Customers who log in, staff who manage jobs, bookings that need more than a form. A web app built around how you already work.",
  },
  {
    title: "An idea you want to test",
    body: "A first version with the features that matter, in front of real users quickly, so you learn what people pay for before spending more.",
  },
  {
    title: "A tool for your own team",
    body: "Job sheets, stock, quotes or rotas that live in spreadsheets and messages today, in one place everyone can use from a phone.",
  },
] as const;

const steps = [
  {
    title: "Talk it through",
    body: "A free call about the idea: who uses it, what it has to do first, and what can wait.",
  },
  {
    title: "Scope and fixed quote",
    body: "A written list of what the first version does, with a fixed price and a date. Nothing starts until you agree it.",
  },
  {
    title: "Built in stages",
    body: "You try each part as it is finished, on your own phone or browser, and say what to change while it is still cheap to change.",
  },
  {
    title: "Launch",
    body: "The web app goes live, or the app goes through Apple and Google's reviews. I handle the submission and the back-and-forth.",
  },
  {
    title: "Next version",
    body: "Support and improvements if you want them, quoted the same way. The code is yours either way.",
  },
] as const;

const faqs = [
  {
    question: "Do I own the app and its code?",
    answer:
      "Yes. Once it is paid for, the code and the app are yours, and the app store accounts are in your name. You are never locked in to me.",
  },
  {
    question: "iPhone, Android, or both?",
    answer:
      "Usually both, from one codebase, which is why a mobile app here starts from £8,000 rather than twice that. If you only need one, the quote reflects it.",
  },
  {
    question: "How long does it take?",
    answer:
      "It depends on what the first version has to do. The quote gives you a date, agreed before work starts, and you see progress throughout rather than at the end.",
  },
  {
    question: "What does it cost to run afterwards?",
    answer:
      "Hosting, and for a mobile app, Apple's and Google's developer accounts. You pay those providers directly, in your name. The quote lists them, so nothing is a surprise.",
  },
  {
    question: "I only have an idea. Is that enough?",
    answer:
      "Yes. Most apps start as a sentence. The first call is about working out the smallest version worth building, and that call is free.",
  },
] as const;

export default function AppsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Apps", path: "/apps" },
        ])}
      />
      <JsonLd
        data={serviceSchema({
          name: "Web and mobile app development",
          description,
          path: "/apps",
          serviceType: "App development",
          from: 5000,
        })}
      />
      <JsonLd data={faqSchema(faqs)} />

      <section className="surface-navy border-b-2 border-navy py-16 lg:py-20">
        <Container>
          <SectionLabel>Web and mobile apps</SectionLabel>
          <h1 className="max-w-[18ch] text-[clamp(2.9rem,6.6vw,5.75rem)] leading-[0.96] font-extrabold tracking-display text-navy-text">
            Your app, built by the developer you talk to.
          </h1>
          <p className="mt-6 max-w-[36rem] text-lg leading-relaxed text-muted">
            Web and mobile apps for iOS and Android, from booking systems to
            subscriptions. I built MyMathsHero and DoBook. Fixed quote before
            any work.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/quote?need=app" variant="primary">
              Get a fixed quote
            </ButtonLink>
            <ButtonLink href="/booking" variant="secondary">
              Talk through an idea
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section aria-labelledby="app-types" className="border-b border-edge py-16">
        <Container>
          <h2 id="app-types" className="sr-only">
            What I build
          </h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {appServices.map((service) => (
              <article
                key={service.slug}
                id={service.slug}
                className="scroll-mt-24 rounded-lg border-2 border-edge bg-surface p-8"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-2xl font-bold text-navy-text">{service.name}</h3>
                  <p className="font-bold text-amber-deep">
                    From {formatFrom(service.from)}
                  </p>
                </div>
                <p className="mt-3 leading-relaxed text-muted">{service.detail}</p>
                <ul className="mt-6 grid gap-2.5 text-sm">
                  {service.includes.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span aria-hidden="true" className="text-amber-deep">
                        ✓
                      </span>
                      <span className="text-muted">{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="apps-built" className="border-b border-edge py-16">
        <Container>
          <SectionLabel>Apps I&apos;ve built</SectionLabel>
          <h2
            id="apps-built"
            className="mb-10 max-w-[46rem] text-4xl leading-none font-extrabold tracking-display text-navy-text lg:text-6xl"
          >
            Live and in use
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {caseStudies.map((project) => (
              <ProjectCard key={project.slug} project={project} detailed />
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="who-for" className="border-b border-edge py-16">
        <Container>
          <SectionLabel>Who it&apos;s for</SectionLabel>
          <h2
            id="who-for"
            className="mb-10 max-w-[44rem] text-4xl leading-none font-extrabold tracking-display text-navy-text lg:text-6xl"
          >
            Any business, or anyone with an idea
          </h2>
          <div className="grid gap-px overflow-hidden rounded-lg border-2 border-edge bg-edge md:grid-cols-3">
            {audiences.map((a) => (
              <article key={a.title} className="bg-bg p-7">
                <h3 className="text-lg font-bold text-navy-text">{a.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{a.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="app-process" className="surface-navy py-20">
        <Container>
          <p className="rule-label mb-4 text-xs font-bold tracking-[0.2em] text-white uppercase">
            How an app gets built
          </p>
          <h2 id="app-process" className="mb-10 max-w-[40rem] text-4xl leading-none font-extrabold tracking-display lg:text-6xl">
            Small first version, then grow it
          </h2>
          <ol className="grid gap-px bg-white/15 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step, i) => (
              <li key={step.title} className="bg-bg p-6">
                <span className="block text-4xl font-bold tracking-display text-amber">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section aria-labelledby="apps-faq" className="py-16">
        <Container>
          <h2 id="apps-faq" className="mb-8 text-4xl leading-none font-extrabold tracking-display text-navy-text">
            Questions about apps
          </h2>
          <div className="grid max-w-[48rem] gap-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="group rounded-lg border-2 border-edge bg-surface p-5 open:border-navy">
                <summary className="cursor-pointer list-none font-bold text-navy-text">
                  {faq.question}
                </summary>
                <p className="mt-3 leading-relaxed text-muted">{faq.answer}</p>
              </details>
            ))}
          </div>

          <div className="mt-14 flex flex-col gap-4 rounded-lg border-2 border-navy bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-lg font-bold text-navy-text">
              Got an idea? A first call costs nothing.
            </p>
            <div className="flex shrink-0 flex-wrap gap-3">
              <ButtonLink href="/quote?need=app" variant="primary">
                Get a fixed quote
              </ButtonLink>
              <a
                href={telHref}
                className="inline-flex items-center justify-center rounded-md border-2 border-navy px-6 py-3.5 text-sm font-bold text-navy-text no-underline transition hover:bg-navy hover:text-white"
              >
                Call {site.phone.display}
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
