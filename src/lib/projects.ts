export type Project = {
  slug: string;
  title: string;
  /** Client or sector, e.g. "Independent cafe, Leeds". */
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
 * TODO(Darshan): replace these with your real client work.
 * Patch 3 turns each entry into a full case study page. For now every field
 * except `image` and `url` is required — fill in what you have and we will
 * expand from there. Delete any placeholder you do not need.
 */
/** True while the list is still placeholder content. Drives noindex on /design
 *  so Google never sees "TODO: Project name". Flip to false once real work lands. */
export const projectsArePlaceholder = true;

export const projects: Project[] = [
  {
    slug: "project-one",
    title: "TODO: Project name",
    client: "TODO: Client / sector",
    summary: "TODO: What you built and the result it produced.",
    tags: ["Web design", "Next.js"],
  },
  {
    slug: "project-two",
    title: "TODO: Project name",
    client: "TODO: Client / sector",
    summary: "TODO: What you built and the result it produced.",
    tags: ["E-commerce"],
  },
];
