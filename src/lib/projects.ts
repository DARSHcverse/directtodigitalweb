export type Project = {
  slug: string;
  title: string;
  /** Client or sector. */
  client: string;
  /** What the site does, in the client's terms. */
  summary: string;
  /** Live site. */
  url: string;
  /** Screenshot under /public/images/work. */
  image: string;
  /** Width/height of the captured screenshot, for correct aspect ratio. */
  imageWidth: number;
  imageHeight: number;
  tags: string[];
};

/**
 * Real client work. Screenshots were captured from the live sites; retake them
 * if a site is redesigned, since a stale screenshot is worse than none.
 *
 * TODO(Darshan): the `summary` lines describe what each site does, taken from
 * the sites themselves. If you can add an outcome to any of them — enquiries,
 * bookings, sales — say so and I will work it in. Results convert far better
 * than feature lists.
 */
export const projects: Project[] = [
  {
    slug: "do-book",
    title: "DoBook",
    client: "Booking & scheduling SaaS",
    summary:
      "An all-in-one online booking and appointment platform for service businesses. Handles appointments, clients, invoices, reminders and payments, with free and Pro plans.",
    url: "https://www.do-book.com/",
    image: "/images/work/dobook.jpg",
    imageWidth: 1200,
    imageHeight: 750,
    tags: ["Web app", "Booking system", "Payments", "SaaS"],
  },
  {
    slug: "mymathshero",
    title: "MyMathsHero",
    client: "Education technology",
    summary:
      "A personalised AI maths tutor for primary school children from Prep to Year 6. Curriculum-aligned practice, step-by-step help and progress reports for parents.",
    url: "https://mymathshero.com.au",
    image: "/images/work/mymathshero.jpg",
    imageWidth: 1200,
    imageHeight: 750,
    tags: ["Web app", "EdTech", "Subscriptions", "AI"],
  },
  {
    slug: "photo-booth-hire-swansea",
    title: "Photo Booth Hire Swansea",
    client: "Event hire, South Wales",
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
    client: "Event hire, Melbourne",
    summary:
      "A photo booth hire site for weddings, corporate events and parties, with online quotes, secure payments and automated booking confirmations.",
    url: "https://www.photoboothwithshan.com.au",
    image: "/images/work/shanbooth.jpg",
    imageWidth: 1200,
    imageHeight: 677,
    tags: ["Website", "Bookings", "Stripe payments"],
  },
  {
    slug: "crown-auto-trading",
    title: "Crown Auto Trading",
    client: "Used car dealership",
    summary:
      "A dealership site for a used car and auto repair business, presenting stock, trade-ins and workshop services with viewing enquiries built in.",
    url: "https://autobodyshop.vercel.app",
    image: "/images/work/autobodyshop.jpg",
    imageWidth: 1200,
    imageHeight: 750,
    tags: ["Website", "Local business", "Enquiries"],
  },
];

/** Drives noindex on /design and its exclusion from the sitemap. */
export const projectsArePlaceholder = projects.length === 0;
