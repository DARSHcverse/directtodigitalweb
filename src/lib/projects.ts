/**
 * Who the work was for. Shown on every card, because several of these are
 * Shan's own businesses, and presenting those as client work would mislead a
 * visitor deciding whether to trust him.
 */
export type Ownership = "client" | "own-business" | "co-run" | "own-product";

export const OWNERSHIP_LABEL: Record<Ownership, string> = {
  client: "Client work",
  "own-business": "My own business",
  "co-run": "A business I co-run",
  "own-product": "My own product",
};

export type Project = {
  slug: string;
  title: string;
  /** Sector, in plain words. */
  client: string;
  ownership: Ownership;
  /** What the site does, in the owner's terms. */
  summary: string;
  /**
   * Live site, or null when it is not public yet. A preview deployment is
   * never linked: they carry unfinished copy and review notes.
   */
  url: string | null;
  /** Screenshot under /public/images/work. */
  image: string;
  /** Width/height of the captured screenshot, for correct aspect ratio. */
  imageWidth: number;
  imageHeight: number;
  tags: string[];
};

/**
 * Work built and running. Crown Auto, Accounts Assists and DoBook are client
 * work; the booth sites are Shan's own businesses and MyMathsHero is one he
 * co-runs, each labelled as such. Client work comes first.
 *
 * Screenshots were captured from the live sites; retake them if a site is
 * redesigned, since a stale screenshot is worse than none. Where a real
 * outcome is known — enquiries won, bookings taken — say so in the summary.
 */
export const projects: Project[] = [
  {
    slug: "crown-auto-trading",
    title: "Crown Auto Trading",
    client: "Used car dealership",
    ownership: "client",
    summary:
      "A dealership site for a used car and auto repair business, presenting stock, trade-ins and workshop services with viewing enquiries built in.",
    // Not linked: the live domain is not up yet, and the preview
    // deployment shows internal review notes.
    url: null,
    image: "/images/work/autobodyshop.jpg",
    imageWidth: 1200,
    imageHeight: 750,
    tags: ["Website", "Local business", "Enquiries"],
  },
  {
    slug: "accounts-assists",
    title: "Accounts Assists",
    client: "Accountant, Watford",
    ownership: "client",
    summary:
      "A local accountancy site for a Watford practice: self assessment, bookkeeping, VAT and payroll, with the surrounding towns it serves and free consultations bookable online.",
    url: "https://www.accountsassists.com",
    image: "/images/work/accountsassists.jpg",
    imageWidth: 1200,
    imageHeight: 750,
    tags: ["Website", "Local SEO", "Bookings", "UK"],
  },
  {
    slug: "do-book",
    title: "DoBook",
    client: "Booking & scheduling SaaS",
    ownership: "client",
    summary:
      "An all-in-one online booking and appointment platform for service businesses. Handles appointments, clients, invoices, reminders and payments, with free and Pro plans.",
    url: "https://www.do-book.com/",
    image: "/images/work/dobook.jpg",
    imageWidth: 1200,
    imageHeight: 750,
    tags: ["Web app", "Booking system", "Payments", "SaaS"],
  },
  {
    slug: "photo-booth-hire-swansea",
    title: "Photo Booth Hire Swansea",
    client: "Event hire, South Wales",
    ownership: "own-business",
    summary:
      "A booking-led site for a photo booth hire business covering Swansea and South Wales, with packages, quote requests and advance bookings ahead of launch.",
    url: "https://www.photoboothhireswansea.co.uk",
    image: "/images/work/swansea.jpg",
    imageWidth: 1200,
    imageHeight: 677,
    tags: ["Website", "Local SEO", "Bookings", "UK"],
  },
  {
    slug: "the-shan-booth",
    title: "The Shan Booth",
    client: "Event hire, weddings and events",
    ownership: "own-business",
    summary:
      "A photo booth hire site for weddings, corporate events and parties, with online quotes, secure payments and automated booking confirmations.",
    url: "https://www.photoboothwithshan.com.au",
    image: "/images/work/shanbooth.jpg",
    imageWidth: 1200,
    imageHeight: 677,
    tags: ["Website", "Bookings", "Stripe payments"],
  },
  {
    slug: "mymathshero",
    title: "MyMathsHero",
    client: "Education technology",
    ownership: "co-run",
    summary:
      "A personalised AI maths tutor for primary school children from Prep to Year 6. Curriculum-aligned practice, step-by-step help and progress reports for parents.",
    url: "https://mymathshero.com.au",
    image: "/images/work/mymathshero.jpg",
    imageWidth: 1200,
    imageHeight: 750,
    tags: ["Web app", "EdTech", "Subscriptions", "AI"],
  },
];

/** Drives noindex on /design and its exclusion from the sitemap. */
export const projectsArePlaceholder = projects.length === 0;
