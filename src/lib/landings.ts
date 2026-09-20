import type { Project } from "@/lib/projects";
import { projects } from "@/lib/projects";

export type Landing = {
  slug: string;
  /** Page <h1>. */
  heading: string;
  /** Title tag — lead with the search term. */
  title: string;
  metaDescription: string;
  /** Opening paragraph under the h1. */
  intro: string;
  /** Who this page is for, shown as a short reassurance line. */
  audience: string;
  /** The problems this audience actually has. */
  painPoints: string[];
  /** What the site does about them. */
  solutions: { title: string; body: string }[];
  /** Slugs from projects.ts used as proof on this page. */
  proofSlugs: string[];
  /** Page-specific FAQs, kept distinct from the homepage set. */
  faqs: { question: string; answer: string }[];
};

/**
 * Audience and service landing pages.
 *
 * Each targets a real search intent and is backed by work in projects.ts —
 * no page claims a niche the portfolio cannot evidence. Thin, duplicated
 * landing pages are worse than none, so each has its own copy and FAQs
 * rather than a templated paragraph with the noun swapped.
 */
export const landings: Landing[] = [
  {
    slug: "small-business-websites",
    heading: "Websites for small businesses",
    title: "Small Business Website Design UK",
    metaDescription:
      "Website design for UK small businesses. Fixed quotes from £800, built to be found on Google and to turn visitors into enquiries. No jargon, no retainers.",
    intro:
      "Most small businesses do not need a complicated website. They need one that loads quickly, explains what they do, works on a phone, and makes it easy to get in touch. That is what I build.",
    audience: "Sole traders, trades, salons, consultants and local services",
    painPoints: [
      "An old site that looks dated next to competitors",
      "No site at all, just a social media page",
      "A site that nobody can find on Google",
      "Enquiry forms that quietly stopped working",
      "An agency that charges a monthly retainer for very little",
    ],
    solutions: [
      {
        title: "Built to be found",
        body: "Every page is server-rendered with proper titles, descriptions and structured data, so search engines can actually read your site. The technical groundwork is done before you write a word of content.",
      },
      {
        title: "Designed for phones first",
        body: "Most visitors arrive on a phone. Your site is built for that screen first and scaled up, rather than a desktop layout awkwardly squeezed down.",
      },
      {
        title: "Enquiries that reach you",
        body: "Contact and quote forms deliver straight to your inbox with spam filtering built in, so you never lose a lead to a form that silently failed.",
      },
      {
        title: "Yours to keep",
        body: "No monthly retainer and no lock-in. Hosting typically costs a few pounds a month, billed to you directly and never marked up.",
      },
    ],
    proofSlugs: ["crown-auto-trading", "the-shan-booth"],
    faqs: [
      {
        question: "I only need a few pages. Is that too small a job?",
        answer:
          "Not at all. A sharp four-page site that loads fast and ranks well is often more effective than twenty pages nobody reads. The Starter option exists for exactly this.",
      },
      {
        question: "I have no logo or written content. Can you still help?",
        answer:
          "Yes. Most small businesses are in that position. I can work from what you have, guide you on what each page needs to say, and structure the site so content can be added as it comes together.",
      },
      {
        question: "Will I be able to update it myself?",
        answer:
          "That depends on what you want to change. For sites that need regular updates I build in an editing setup and show you how to use it. For sites that rarely change, small updates are usually quicker to send to me.",
      },
    ],
  },
  {
    slug: "booking-websites",
    heading: "Websites with online booking",
    title: "Booking System Website Design",
    metaDescription:
      "Websites with online booking built in — take appointments and deposits 24/7, cut no-shows with automated reminders, and stop losing bookings to voicemail.",
    intro:
      "If customers have to phone you to book, you are only open when you answer the phone. A booking system takes enquiries at midnight on a Sunday and puts them straight into your calendar.",
    audience: "Salons, clinics, event hire, tutors and appointment-based services",
    painPoints: [
      "Bookings lost because nobody answered the phone",
      "Hours spent on back-and-forth messages to agree a time",
      "No-shows because nobody was reminded",
      "Double bookings from a diary kept in two places",
      "Chasing deposits and payments after the event",
    ],
    solutions: [
      {
        title: "Bookings around the clock",
        body: "Customers pick a time that suits them and confirm it themselves. Your availability rules decide what is offered, so you stay in control of the calendar.",
      },
      {
        title: "Deposits taken up front",
        body: "Secure Stripe checkout takes a deposit or full payment at the point of booking, which cuts no-shows sharply and improves your cash flow.",
      },
      {
        title: "Automatic reminders",
        body: "Confirmation and reminder emails go out without you doing anything, which is the single most effective way to reduce missed appointments.",
      },
      {
        title: "One calendar, not three",
        body: "Bookings land in one place, so the diary, the inbox and the website cannot disagree with each other.",
      },
    ],
    proofSlugs: ["do-book", "the-shan-booth", "photo-booth-hire-swansea"],
    faqs: [
      {
        question: "Can it handle multiple staff or resources?",
        answer:
          "Yes. Availability can be set per staff member, room or piece of equipment, so the system only offers times that are genuinely free.",
      },
      {
        question: "Do I have to take payment at the time of booking?",
        answer:
          "No. Deposits, full payment or no payment at all are all options, and you can set different rules for different services.",
      },
      {
        question: "Can it connect to the calendar I already use?",
        answer:
          "Usually yes. Tell me what you currently use and I will confirm before quoting, rather than promising an integration and discovering a limitation later.",
      },
    ],
  },
  {
    slug: "website-redesign",
    heading: "Website redesign",
    title: "Website Redesign Services UK",
    metaDescription:
      "Redesign your existing website without losing your Google rankings. Faster, modern, mobile-ready rebuilds with redirects handled properly at launch.",
    intro:
      "A redesign should not undo years of search visibility. The aim is to keep everything that is working — your content, your rankings, your URLs — and rebuild the rest on foundations that are actually fast.",
    audience: "Businesses with a site that is dated, slow or hard to use on a phone",
    painPoints: [
      "A site that looks like it was built a decade ago",
      "Pages that take too long to load",
      "A layout that falls apart on a phone",
      "Losing rankings after a previous redesign went wrong",
      "No way to update anything without calling a developer",
    ],
    solutions: [
      {
        title: "Rankings protected",
        body: "Existing URLs are mapped and redirected properly, so the authority your pages have built up carries over instead of being thrown away at launch.",
      },
      {
        title: "Genuinely faster",
        body: "Rebuilt on modern foundations with optimised images and server-rendered pages. Speed affects both how you rank and how many visitors stay.",
      },
      {
        title: "Content kept",
        body: "Your existing copy, images and pages come across. Nothing is discarded without you deciding it should be.",
      },
      {
        title: "Fixed while we are in there",
        body: "Technical problems holding the old site back — missing meta tags, broken links, no sitemap — get fixed as part of the rebuild.",
      },
    ],
    proofSlugs: ["mymathshero", "crown-auto-trading"],
    faqs: [
      {
        question: "Will I lose my Google rankings?",
        answer:
          "Not if the migration is done properly. The risk comes from changing URLs without redirects, which is the most common way redesigns go wrong. Old URLs are mapped to new ones before launch, so links and rankings follow.",
      },
      {
        question: "Can you keep my existing design?",
        answer:
          "Yes, if you like it. Sometimes the design is fine and the problem is purely speed or mobile layout. I will tell you honestly which of the two you are dealing with.",
      },
      {
        question: "How long does a redesign take?",
        answer:
          "Usually two to four weeks for a typical small-business site, since the content already exists. Larger sites take longer, mostly in mapping URLs carefully.",
      },
    ],
  },
];

export function getLanding(slug: string): Landing | undefined {
  return landings.find((l) => l.slug === slug);
}

export function proofFor(landing: Landing): Project[] {
  return landing.proofSlugs
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is Project => p !== undefined);
}
