export type Project = {
  slug: string;
  title: string;
  /** Client or sector, e.g. "Event hire business, Melbourne". */
  client: string;
  /** One-line outcome — what the site achieved. */
  summary: string;
  /** Live site, if public. */
  url?: string;
  /** Path under /public/images. 16:9 works best. */
  image?: string;
  tags: string[];
};

/**
 * TODO(Darshan): you said you would supply the project list for D2D Web
 * yourself — add entries here when ready.
 *
 * While this array is empty, /design shows an honest "work in progress"
 * state, is marked noindex, and is excluded from the sitemap. Adding the
 * first project reverses all three automatically, so there is nothing else
 * to remember to switch on.
 */
export const projects: Project[] = [];

/** Drives noindex on /design and its exclusion from the sitemap. */
export const projectsArePlaceholder = projects.length === 0;
