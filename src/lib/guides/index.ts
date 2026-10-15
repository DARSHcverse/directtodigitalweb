import type { Guide } from "./types";
import { tradespersonWebsiteCost } from "./tradesperson-website-cost-uk";

/**
 * Every guide, in any state. Add new guides here.
 *
 * Guides are files in the codebase rather than records in a CMS: Claude
 * drafts, Shan approves, and publishing is a commit. That keeps every page
 * static, fast and readable without JavaScript, with no editor to maintain.
 */
const all: Guide[] = [tradespersonWebsiteCost];

/** Drafts show only in `next dev`, so they can be reviewed before approval. */
const showDrafts = process.env.NODE_ENV !== "production";

/** Visible guides, newest first. */
export function listGuides(): Guide[] {
  return all
    .filter((g) => g.status === "published" || showDrafts)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getGuide(slug: string): Guide | undefined {
  return listGuides().find((g) => g.slug === slug);
}

/** Other guides to suggest under a guide: same trade first, then newest. */
export function relatedGuides(guide: Guide, count = 2): Guide[] {
  const others = listGuides().filter((g) => g.slug !== guide.slug);
  const sameTrade = others.filter(
    (g) => g.relatedTrade !== "none" && g.relatedTrade === guide.relatedTrade,
  );
  return [...sameTrade, ...others.filter((g) => !sameTrade.includes(g))].slice(0, count);
}
