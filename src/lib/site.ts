/**
 * Single source of truth for site-wide constants.
 * Metadata, schema, sitemap and robots all read from here.
 */
export const site = {
  name: "D2D Web",
  legalName: "D2D Web",
  /** Update once the production domain is attached in Vercel. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://d2dweb.co.uk",
  tagline: "Freelance Web Design & Development, UK-wide",
  description:
    "Freelance web designer building fast, modern, search-friendly websites for small businesses across the UK. Remote-first, fixed quotes, no jargon.",
  locale: "en_GB",
  currency: "GBP",
  /** Where lead notifications are delivered, and the only public contact route. */
  contactEmail: "dharshansubramaniyam@gmail.com",
  /**
   * Remote-first, serving the whole UK. No street address or phone is published:
   * inventing NAP data is an active local-SEO liability, so this stays empty
   * until there are real details to publish.
   */
  areaServed: "United Kingdom",
  founder: "Darshan Subramaniyam",
  /** Add profile URLs here and they flow into schema sameAs automatically. */
  sameAs: [] as string[],
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
