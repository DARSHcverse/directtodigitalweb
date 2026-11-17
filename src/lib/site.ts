// The apex redirects to www, so www is the canonical host. Getting this
// wrong splits ranking signals between two versions of every page.
const FALLBACK_URL = "https://www.tradewebco.co.uk";

/**
 * Resolve the canonical origin.
 *
 * Deliberately defensive: `??` alone is not enough, because an environment
 * variable set to an empty string in a dashboard is defined, and `new URL("")`
 * throws ERR_INVALID_URL at module scope — which fails the whole build rather
 * than any one page. Whitespace-only and protocol-less values are handled for
 * the same reason.
 */
function resolveSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    // Set automatically by Vercel; the stable production domain, not the
    // per-deployment URL, so canonicals stay consistent across deploys.
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
  ];

  for (const candidate of candidates) {
    const trimmed = candidate?.trim();
    if (!trimmed) continue;

    const withProtocol = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;

    try {
      // Normalised, and without a trailing slash so `${site.url}${path}`
      // never produces a double slash.
      return new URL(withProtocol).origin;
    } catch {
      // Malformed value — try the next candidate rather than failing the build.
      continue;
    }
  }

  return FALLBACK_URL;
}

/**
 * Single source of truth for site-wide constants.
 * Metadata, schema, sitemap and robots all read from here.
 */
export const site = {
  name: "Trade Web Co",
  legalName: "Trade Web Co",
  /** Canonical origin, no trailing slash. Set NEXT_PUBLIC_SITE_URL to override. */
  url: resolveSiteUrl(),
  tagline: "Websites, booking and apps for trades and garages",
  description:
    "Websites, online booking and apps for UK trades and garages, built by one developer in Swansea. Fixed price from £800, no monthly fee, you own it.",
  locale: "en_GB",
  currency: "GBP",
  /**
   * The public contact address, shown on the site and in every email
   * signature.
   *
   * The domain is owned, so this can move to hello@tradewebco.co.uk whenever
   * mail is actually routed there — set NEXT_PUBLIC_CONTACT_EMAIL rather than
   * editing this, so the change needs no deploy. Publishing an address that
   * does not receive mail loses leads silently, so it stays pointed at a
   * mailbox that works.
   */
  contactEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ||
    "tradewebco@gmail.com",
  /**
   * The business identity. The Electronic Commerce Regulations 2002 (reg. 6)
   * require the provider's name, a geographic address and an email to be
   * easily and permanently accessible, so these appear in the footer, the
   * contact page and the legal pages.
   *
   * Sole trader, so the legal entity is Darshan himself, trading as Trade Web
   * Co. `locality` is a town rather than a street address; regulation 6 asks
   * for a full geographic address, so replace it with a business address
   * service before relying on this for compliance.
   */
  founder: "Darshan Subramaniam",
  tradingStatus: "sole trader",
  locality: "Swansea",
  region: "Wales",
  /**
   * Where work is offered. Swansea is the base; Watford and London are areas
   * Shan also covers in person. The rest of the UK is served remotely.
   */
  areasServed: ["Swansea", "Watford", "London"] as string[],
  areaServed: "United Kingdom",
  /**
   * The business line: a Swansea number, answered in working hours. Trades
   * phone rather than fill in forms, and a site that sells tap-to-call to
   * plumbers has to offer it itself.
   */
  phone: {
    display: "01792 959054",
    e164: "+441792959054",
    hours: "Monday to Saturday, 8am to 6pm",
    /** For schema.org openingHours. */
    openingHours: "Mo-Sa 08:00-18:00",
  },
  /**
   * Profile URLs. These feed schema sameAs, which is how Google ties this
   * site to a real, verifiable person rather than an anonymous brand.
   * The personal job-seeking portfolio is deliberately excluded — it states
   * he is looking for full-time roles, which undercuts a supplier pitch.
   */
  sameAs: [
    "https://www.linkedin.com/in/darshhpe",
    "https://github.com/DARSHcverse",
  ] as string[],
} as const;

export const services = [
  "Website Design",
  "Website Redesign",
  "E-commerce",
  "Other",
] as const;

/**
 * The quote form's first question, stored in the lead's topic. Each one
 * maps to a published package, so the answer tells Shan which price to start
 * from. "Not sure yet" is for people who know the problem but not the fix.
 */
export const projectTypes = [
  "Website",
  "Website with online booking",
  "Web app",
  "Mobile app",
  "Online shop",
  "Redesign of my current site",
  "Not sure yet",
] as const;

/**
 * Quote form choices.
 *
 * Budget bands mirror the published packages (£800 / £1,800 / £2,500 /
 * £5,000 / £8,000) so the answer someone gives here lines up with what they
 * saw on the pricing page.
 * "Not sure yet" is deliberate and listed last: without it, anyone unsure
 * either guesses low and feels committed, or abandons the form.
 */
export const budgetBands = [
  { value: "Around £800", label: "Around £800", note: "Starter website" },
  { value: "£800–£2,500", label: "£800–£2,500", note: "Full website" },
  { value: "£2,500–£5,000", label: "£2,500–£5,000", note: "Booking or shop" },
  { value: "£5,000–£10,000", label: "£5,000–£10,000", note: "Web or mobile app" },
  { value: "£10,000+", label: "£10,000+", note: "Bigger app" },
  { value: "Not sure yet", label: "Not sure yet", note: "I'll advise" },
] as const;

/** Timelines in the words people use, not dates. */
export const timelineOptions = [
  { value: "As soon as possible", label: "As soon as possible" },
  { value: "Within 1–2 months", label: "Within 1–2 months" },
  { value: "Just planning ahead", label: "Just planning ahead" },
] as const;

export type Service = (typeof services)[number];
export type ProjectType = (typeof projectTypes)[number];

/**
 * Service offerings, used for schema, the homepage and the services page.
 *
 * `from` is the published starting price, agreed with Darshan on 2026-11-17
 * and matched in pricing.ts. Every figure is shown with "from": the fixed
 * quote is the real commitment.
 */
export const serviceCatalogue = [
  {
    slug: "website-design",
    name: "Website Design",
    from: 800,
    description:
      "A new website designed and built from scratch, tailored to your business and built to convert visitors into enquiries.",
    detail:
      "If you have no website yet, or one that was never really fit for purpose, this is the starting point. I design around what your business actually needs to achieve — whether that is phone calls, bookings or online sales — rather than decoration for its own sake.",
    includes: [
      "Design tailored to your brand, not a stock template",
      "Written and built to be found on Google",
      "Works properly on phones, where most visitors arrive",
      "Contact or enquiry forms that reach your inbox",
      "Fast loading, which affects both ranking and conversions",
    ],
  },
  {
    slug: "booking-systems",
    name: "Websites with Online Booking",
    from: 2500,
    description:
      "Your website with real online booking: customers pick a slot, you get the booking, and they get a confirmation and a reminder.",
    detail:
      "For garages, detailers, mobile mechanics and any business that sells time. Customers book an MOT, a service or a job without ringing you, day or night, and the booking comes straight to you rather than through a comparison site.",
    includes: [
      "Your own booking page, on your own website",
      "Your services, prices and opening times, set by you",
      "Confirmation and reminder emails, so fewer no-shows",
      "Optional deposits taken by card through Stripe",
      "A simple diary view of what is booked",
    ],
  },
  {
    slug: "web-apps",
    name: "Web Apps",
    from: 5000,
    description:
      "Booking systems, customer portals and subscription apps that run in the browser, built to fit how your business works.",
    detail:
      "When a website is not enough: customers who log in, staff who manage jobs, or a product people pay for monthly. I built DoBook, a booking system with payments, and MyMathsHero, a subscription learning app, and I build yours the same way.",
    includes: [
      "Logins, accounts and roles for customers and staff",
      "Payments and subscriptions through Stripe",
      "An admin area to run it day to day",
      "Built on current, well-supported technology",
      "A fixed quote for the first version, agreed before work starts",
    ],
  },
  {
    slug: "mobile-apps",
    name: "Mobile Apps",
    from: 8000,
    description:
      "One app for iPhone and Android, built, tested and published to the App Store and Google Play.",
    detail:
      "For an idea that belongs on people's phones: bookings, loyalty, a service your customers use every week. One codebase covers both iPhone and Android, which keeps the cost down, and I handle getting it through the app store reviews.",
    includes: [
      "One app for both iPhone and Android",
      "Push notifications and sign-in",
      "Connected to your website or web app where it helps",
      "Submitted to the App Store and Google Play for you",
      "Store developer accounts are in your name, so the app is yours",
    ],
  },
  {
    slug: "website-redesign",
    name: "Website Redesign",
    description:
      "A rebuild of your existing site with modern design, faster load times and stronger search visibility.",
    detail:
      "Plenty of businesses have a site that works but looks dated, loads slowly, or falls apart on a phone. A redesign keeps what is working — your content, your existing search rankings — and rebuilds the rest on modern foundations.",
    includes: [
      "Existing content and URLs preserved to protect your rankings",
      "Modern, fast rebuild on current technology",
      "Mobile layouts that actually work",
      "Technical SEO issues identified and fixed",
      "Redirects handled so nothing breaks at launch",
    ],
  },
  {
    slug: "e-commerce",
    name: "E-commerce",
    from: 3000,
    description:
      "Online stores built for speed and conversion, with secure checkout and straightforward product management.",
    detail:
      "Selling online has to be straightforward for your customers and manageable for you. I build stores with secure Stripe checkout and a product setup you can run yourself, without needing to call a developer every time a price changes.",
    includes: [
      "Product catalogue you can manage yourself",
      "Secure Stripe checkout",
      "Order notifications and customer emails",
      "Built for speed, because slow stores lose sales",
      "Training so you are not dependent on me",
    ],
  },
] as const;

/** One sentence naming who is behind the site, used wherever identity is shown. */
export const identityLine = `${site.name} is a trading name of ${site.founder}, a ${site.tradingStatus} based in ${site.locality}, ${site.region}.`;


export const telHref = `tel:${site.phone.e164}`;
