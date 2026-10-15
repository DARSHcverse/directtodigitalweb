import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { projectsArePlaceholder } from "@/lib/projects";
import { landings } from "@/lib/landings";
import { listGuides } from "@/lib/guides";

/**
 * Every public page, with the date its content last genuinely changed.
 *
 * Bump a page's date when its copy or offer changes, not on every deploy:
 * new Date() would claim everything changed every time, and Google learns to
 * ignore a sitemap whose dates always say "just now". The previous version
 * stamped every page with one date.
 *
 * changeFrequency and priority are left out on purpose; Google ignores both.
 */
const pages: { path: string; updated: string }[] = [
  { path: "/", updated: "2026-10-15" },
  { path: "/pricing", updated: "2026-10-15" },
  { path: "/services", updated: "2026-10-15" },
  { path: "/work", updated: "2026-10-15" },
  { path: "/quote", updated: "2026-10-15" },
  { path: "/about", updated: "2026-10-15" },
  { path: "/booking", updated: "2026-10-15" },
  { path: "/contact", updated: "2026-10-15" },
  { path: "/privacy", updated: "2026-10-13" },
  { path: "/terms", updated: "2026-10-13" },
];

/** Trade and service pages, by slug. Defaults to LANDINGS_UPDATED. */
const landingUpdated: Record<string, string> = {};
const LANDINGS_UPDATED = "2026-10-15";

export default function sitemap(): MetadataRoute.Sitemap {
  const core = pages
    // /work is noindex while the portfolio is empty, and a sitemap entry for
    // a noindexed URL is a contradictory signal.
    .filter((page) => !(page.path === "/work" && projectsArePlaceholder))
    .map((page) => ({
      // Must match each page's canonical exactly, including the homepage's
      // trailing slash.
      url: `${site.url}${page.path}`,
      lastModified: new Date(page.updated),
    }));

  const landingPages = landings.map((landing) => ({
    url: `${site.url}/for/${landing.slug}`,
    lastModified: new Date(landingUpdated[landing.slug] ?? LANDINGS_UPDATED),
  }));

  // Published only: drafts never reach a production build.
  const guides = listGuides().filter((g) => g.status === "published");
  const guidePages =
    guides.length === 0
      ? []
      : [
          {
            url: `${site.url}/guides`,
            lastModified: new Date(
              guides.map((g) => g.updatedAt).sort().at(-1)!,
            ),
          },
          ...guides.map((g) => ({
            url: `${site.url}/guides/${g.slug}`,
            lastModified: new Date(g.updatedAt),
          })),
        ];

  return [...core, ...landingPages, ...guidePages];
}
