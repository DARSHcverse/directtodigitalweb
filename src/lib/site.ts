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

/** Service offerings described for schema and future service pages. */
export const serviceCatalogue = [
  {
    name: "Website Design",
    description:
      "A new website designed and built from scratch, tailored to your business and built to convert visitors into enquiries.",
  },
  {
    name: "Website Redesign",
    description:
      "A rebuild of your existing site with modern design, faster load times and stronger search visibility.",
  },
  {
    name: "E-commerce",
    description:
      "Online stores built for speed and conversion, with secure checkout and straightforward product management.",
  },
] as const;
