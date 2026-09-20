import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { projectsArePlaceholder } from "@/lib/projects";
import { landings } from "@/lib/landings";

/** Keep in step with the routes under app/(site). */
const routes = [
  { path: "/", changeFrequency: "monthly", priority: 1.0 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.9 },
  { path: "/design", changeFrequency: "monthly", priority: 0.9 },
  { path: "/about", changeFrequency: "yearly", priority: 0.7 },
  { path: "/quote", changeFrequency: "yearly", priority: 0.8 },
  { path: "/booking", changeFrequency: "yearly", priority: 0.8 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.7 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
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
    priority: 0.8,
  }));

  return [...core, ...landingPages];
}
