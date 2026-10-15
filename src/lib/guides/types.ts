import type { ComponentType } from "react";

/** Trade pages a guide can point readers to. */
export type RelatedTrade = "plumbers" | "electricians" | "builders" | "roofers" | "none";

export type GuideMeta = {
  /** Never changes once published: the URL is /guides/[slug]. */
  slug: string;
  /** The H1. */
  title: string;
  /** Title tag, 60 characters or fewer including " | Trade Web Co". */
  metaTitle: string;
  /** 155 characters or fewer. */
  metaDescription: string;
  /** One or two sentences for cards on the index and homepage. */
  excerpt: string;
  /** The answer in two or three sentences, shown in a box above the body. */
  shortAnswer: string;
  relatedTrade: RelatedTrade;
  /** ISO dates. updatedAt moves when prices or facts change, not for typos. */
  publishedAt: string;
  updatedAt: string;
  readMinutes: number;
  /**
   * Drafts are visible in local development only, never on the live site,
   * so a guide can be reviewed in full before Shan approves it.
   */
  status: "draft" | "published";
};

export type Guide = GuideMeta & { Body: ComponentType };
