import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { projectsArePlaceholder } from "@/lib/projects";
import { landings } from "@/lib/landings";

/** Keep in step with the routes under app/(site). */
const routes = [
  { path: "/", changeFrequency: "monthly", priority: 1.0 },
  // Pricing earns disproportionate traffic: "how much does a tradesman
  // website cost" is one of the highest-intent queries in this market.
  { path: "/pricing", changeFrequency: "monthly", priority: 0.9 },
  { path: "/services", changeFrequency: "monthly", priority: 0.8 },
  { path: "/design", changeFrequency: "monthly", priority: 0.8 },
  { path: "/quote", changeFrequency: "yearly", priority: 0.8 },
  { path: "/about", changeFrequency: "yearly", priority: 0.6 },
  { path: "/booking", changeFrequency: "yearly", priority: 0.6 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
] as const;

/**
 * When the content was last genuinely edited.
 *
 * Using new Date() would claim every page changed on every deploy. Google
 * learns to distrust a sitemap whose dates always say "just now", so this is
 * a real date, bumped by hand when the copy actually changes.
 */
const CONTENT_UPDATED = new Date("2026-10-02");

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = CONTENT_UPDATED;
  const core = routes
    // /design is noindex while the portfolio is placeholder content, and a
    // sitemap entry for a noindexed URL is a contradictory signal.
    .filter((route) => !(route.path === "/design" && projectsArePlaceholder))
    .map((route) => ({
      url: `${site.url}${route.path}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }));

  const landingPages = landings.map((landing) => ({
    url: `${site.url}/for/${landing.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    // Equal to the homepage: these target the specific queries this site can
    // realistically win, where the homepage competes with every agency in
    // the country.
    priority: 0.9,
  }));

  return [...core, ...landingPages];
}
