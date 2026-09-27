/**
 * Pricing confirmed by Darshan, 2026-09-28.
 *
 * Consistent with the ranges published in faqs.ts (£800–£3,000 for
 * small-business sites, e-commerce higher) — if you change one, change the
 * other, or the site contradicts itself.
 *
 * Also consistent with the external UK market rate for trade websites
 * (roughly £1,500–£3,500, with ~£1,800 typical for an MVP build).
 *
 * "from" pricing throughout rather than fixed prices, so the quote is always
 * the real commitment and nothing here overpromises.
 */
export type Tier = {
  name: string;
  from: number;
  tagline: string;
  bestFor: string;
  features: string[];
  featured?: boolean;
  /** What the owner can change themselves. The commonest objection to paying
   *  a developer is "I'll be stuck needing you for every edit", so each tier
   *  answers it explicitly. */
  admin: {
    label: string;
    summary: string;
  };
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
      "Blog admin — post and edit articles yourself",
      "Launch support",
    ],
    admin: {
      label: "Blog admin",
      summary:
        "Write, edit and publish blog posts yourself, from a simple editor built into your own site. Page content stays with me — send me a change and it is done.",
    },
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
      "Full admin — edit any page, not just the blog",
      "30 days post-launch support",
    ],
    admin: {
      label: "Full admin",
      summary:
        "Edit any page on the site — text, prices, photos, opening hours, services. Nothing is locked behind me, and you never wait on a developer for a wording change.",
    },
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
      "Full admin, plus product and order management",
      "Training on running the store",
    ],
    admin: {
      label: "Full admin + shop",
      summary:
        "Everything in Business, plus adding products, changing prices and managing orders. Running the shop day to day never needs a developer.",
    },
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

/**
 * Explains what "admin" means to someone who has never used a CMS.
 *
 * Deliberately avoids the word CMS, and avoids implying a separate platform:
 * the editor lives on the customer's own site, which is the part that makes
 * it feel safe rather than like another subscription to manage.
 */
export const adminExplainer = {
  heading: "What the admin area actually is",
  intro:
    "Every site includes a way to change your own content, so you are not paying a developer to fix a typo. It is part of your website, at your own address — not another platform to sign up for, and nothing extra to pay monthly.",
  points: [
    {
      title: "You log into your own site",
      body: "Go to your website, add /admin to the address, and sign in. That is it. No separate account with another company, no app to install, nothing else to remember.",
    },
    {
      title: "It looks like writing an email",
      body: "Type, format, add a photo, press publish. If you can send an email with an attachment, you can use it. There is no code and nothing you can break by clicking the wrong thing.",
    },
    {
      title: "Changes appear straight away",
      body: "Publish and it is live within seconds. No waiting on anyone, no queue, no 'I'll get to it next week'.",
    },
    {
      title: "You cannot break the design",
      body: "You edit the words and pictures. The layout, spacing and styling stay locked, so the site still looks right however much you change.",
    },
  ],
  comparison: [
    {
      tier: "Starter",
      has: "Blog posts only",
      detail:
        "Write and publish articles to keep the site fresh and give Google new pages to find. Your main pages — services, about, contact — are changed by sending them to me, which is usually quicker than doing it yourself for a handful of edits a year.",
    },
    {
      tier: "Business and E-commerce",
      has: "Every page",
      detail:
        "Change anything: your prices, services, opening hours, photos, the text on any page, plus the blog. Useful if your details move around — seasonal pricing, new services, staff changes — and you want it done the moment you think of it.",
    },
  ],
} as const;
