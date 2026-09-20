/**
 * Single source of truth for site-wide constants.
 * Patch 2 (SEO) reads from here, so keep it accurate.
 */
export const site = {
  name: "D2D Web",
  legalName: "D2D Web",
  /** Update once the production domain is attached in Vercel. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://d2dweb.co.uk",
  description:
    "Freelance web design and development for small businesses in the UK. Fast, modern, search-friendly websites built to win you customers.",
  locale: "en_GB",
  currency: "GBP",
  /** Where lead notifications are delivered. */
  contactEmail: "dharshansubramaniyam@gmail.com",
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
