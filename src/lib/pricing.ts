/**
 * TODO(Darshan): confirm these figures before launch.
 *
 * They are derived from the ranges already published in faqs.ts (£800–£3,000
 * for small-business sites, e-commerce higher) so the two cannot contradict
 * each other. If you change one, change the other.
 *
 * "from" pricing is used throughout rather than fixed prices, so a quote is
 * always the real commitment and nothing here overpromises.
 */
export type Tier = {
  name: string;
  from: number;
  tagline: string;
  bestFor: string;
  features: string[];
  featured?: boolean;
};

export const tiers: Tier[] = [
  {
    name: "Starter",
    from: 800,
    tagline: "A sharp, credible presence online.",
    bestFor: "Sole traders and new businesses",
    features: [
      "Up to 4 pages",
      "Mobile-first responsive design",
      "Contact form with email notifications",
      "Basic SEO setup and sitemap",
      "Google-ready performance",
      "Launch support",
    ],
  },
  {
    name: "Business",
    from: 1800,
    tagline: "The full site, built to bring in enquiries.",
    bestFor: "Established small businesses",
    featured: true,
    features: [
      "Up to 10 pages",
      "Custom design tailored to your brand",
      "Advanced SEO and structured data",
      "Booking or quote forms",
      "Copywriting guidance",
      "Analytics setup",
      "30 days post-launch support",
    ],
  },
  {
    name: "E-commerce",
    from: 3000,
    tagline: "Sell online, without the headaches.",
    bestFor: "Shops and product businesses",
    features: [
      "Product catalogue and categories",
      "Secure Stripe checkout",
      "Order and inventory management",
      "Customer accounts",
      "Everything in Business",
      "Training on running the store",
    ],
  },
];

/** Rendered as "from £800" throughout. */
export function formatFrom(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(amount);
}
