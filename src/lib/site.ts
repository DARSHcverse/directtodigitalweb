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
  tagline: "Web Design for Tradespeople",
  description:
    "I build websites for UK tradespeople — plumbers, electricians, builders and roofers. Written, built and set up for you, so you never have to log in. Fixed quotes from £800.",
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
   * Remote-first, serving the whole UK. No street address or phone is published:
   * inventing NAP data is an active local-SEO liability, so this stays empty
   * until there are real details to publish.
   */
  areaServed: "United Kingdom",
  founder: "Darshan Subramaniyam",
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

export const projectTypes = [
  "Website",
  "E-commerce",
  "Redesign",
  "Other",
] as const;

/**
 * Quote form choices.
 *
 * Budget bands mirror the published packages (£800 / £1,800 / £3,000) so the
 * answer someone gives here lines up with what they saw on the pricing page.
 * "Not sure yet" is deliberate and listed last: without it, anyone unsure
 * either guesses low and feels committed, or abandons the form.
 */
export const budgetBands = [
  { value: "Around £800", label: "Around £800", note: "Starter site" },
  { value: "£800–£1,800", label: "£800–£1,800", note: "Most common" },
  { value: "£1,800–£3,000", label: "£1,800–£3,000", note: "Full site" },
  { value: "£3,000+", label: "£3,000+", note: "Online shop" },
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

/** Service offerings, used for schema, the homepage and the services page. */
export const serviceCatalogue = [
  {
    slug: "website-design",
    name: "Website Design",
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
