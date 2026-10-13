export type Testimonial = {
  quote: string;
  /** Full name, or the business name. */
  author: string;
  /** Their trade or role, e.g. "Plumber". */
  role: string;
  /** Town, so a reader can see it is a real, local business. */
  town: string;
  /** Their live site, so the quote can be checked against the work. */
  url?: string;
  initials: string;
  /**
   * Anything given in return for the review, such as a discount. Shown next to
   * the quote: the DMCC Act requires incentivised reviews to be disclosed.
   */
  incentive?: string;
};

/**
 * Genuine client testimonials only.
 *
 * Empty on purpose. The one quote here came from The Shan Booth, which is
 * Shan's own business. Since 6 April 2025 the DMCC Act bans presenting a
 * review in a way that misleads about who wrote it, and a self-review shown
 * under "What clients say" does exactly that. The component hides itself
 * while this list is empty, and reappears when a real client quote is added.
 *
 * Do not add quotes from a business partner or anyone connected to Trade Web
 * Co without saying so in `role`.
 */
export const testimonials: Testimonial[] = [];
