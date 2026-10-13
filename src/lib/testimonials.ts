export type Testimonial = {
  quote: string;
  /** Full name, or the business name. */
  author: string;
  /** Their trade or role, e.g. "Plumber". */
  role: string;
  /**
   * Where the business is, so a reader can see it is real. Left out rather
   * than guessed when the client hasn't said.
   */
  town?: string;
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
 * Genuine testimonials only, in the clients' own words, unedited.
 *
 * The earlier quote came from The Shan Booth, Shan's own business, and was
 * removed: since 6 April 2025 the DMCC Act bans presenting a review in a way
 * that misleads about who wrote it. These four were sent by the people
 * named. MyMathsHero's comes from Shan's business partner, which the role
 * line says — and the quote itself says too.
 *
 * Ordered with UK client work first, since the site sells to UK trades.
 * If anyone was given anything in return for a review, set `incentive` so
 * it is shown beside the quote.
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      "Shan built our website from the ground up and used SEO-focused content to help us significantly grow our client base. He also created a blog admin system so I can publish posts myself and keep improving our SEO. Great work!",
    author: "Accounts Assists",
    role: "Client · Accountants",
    town: "Watford",
    url: "https://www.accountsassists.com",
    initials: "AA",
  },
  {
    quote:
      "Shan built us a booking system that’s genuinely easy to use, along with an admin platform that lets me manage all of my clients in one place. He also set up our SEO and showed me how to manage it myself going forward.",
    author: "DoBook",
    role: "Client · Booking platform",
    url: "https://www.do-book.com",
    initials: "DB",
  },
  {
    quote: "The design is excellent and fully met my expectations.",
    author: "Crown Auto Trading",
    role: "Client · Car dealership",
    town: "Melbourne",
    initials: "CA",
  },
  {
    quote:
      "The website is well built and comes with a companion app, which is a big plus. Shan contributed a lot of ideas to both the website and the business, including integrating AI features that have been very helpful. While he’s also my business partner, his work stands on its own and reflects the high standard you’d expect from a skilled developer.",
    author: "MyMathsHero",
    role: "Shan’s business partner",
    town: "Australia",
    url: "https://mymathshero.com.au",
    initials: "MH",
  },
];
