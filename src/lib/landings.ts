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
    slug: "plumbers",
    heading: "Websites for plumbers",
    title: "Website Design for Plumbers UK",
    metaDescription:
      "Websites for UK plumbers, built for emergency callouts. Phone number above the fold, loads fast on a van signal, and set up for you. Fixed quotes from £800.",
    intro:
      "When someone's boiler fails on a Sunday, they search, they scan, and they ring the first plumber who looks reliable and shows a number. Your website has about ten seconds to be that plumber.",
    audience: "Plumbers, heating engineers and boiler specialists",
    painPoints: [
      "Emergency callouts going to whoever appears first on Google",
      "No easy way to show you are Gas Safe registered",
      "Customers ringing for prices you have already published nowhere",
      "A site that loads too slowly on a phone with one bar of signal",
      "Nothing online to back up a recommendation from a neighbour",
    ],
    solutions: [
      {
        title: "Phone number that follows them down the page",
        body: "A tap-to-call button stays visible while they scroll. For an emergency job, removing one step between reading and ringing is worth more than any design flourish.",
      },
      {
        title: "Gas Safe and credentials up front",
        body: "Registration numbers, insurance and qualifications sit where people look for them, because for a stranger coming into someone's home this is the deciding factor.",
      },
      {
        title: "Built for a bad signal",
        body: "Optimised images and server-rendered pages, so the site opens quickly on 4G in a van or a cold hallway, not just on office broadband.",
      },
      {
        title: "Emergency and planned work separated",
        body: "Urgent callouts and planned bathroom work are different customers with different questions. The site answers both without making either wade through the other.",
      },
    ],
    proofSlugs: ["crown-auto-trading", "the-shan-booth"],
    faqs: [
      {
        question: "Do I need a website if I already get work by word of mouth?",
        answer:
          "Referrals still get checked. Someone recommended to you will search your name before ringing, and finding nothing makes them hesitate. A website does not replace word of mouth, it stops it leaking.",
      },
      {
        question: "Should I put my prices on the site?",
        answer:
          "Usually a callout rate or a starting price, rather than a full price list. It filters out the people who were never going to book, and saves you the calls that go nowhere.",
      },
      {
        question: "Can customers book jobs online?",
        answer:
          "Yes, if that suits how you work. Some plumbers want enquiries only so they can judge urgency themselves. Others want a calendar for planned work. Both are straightforward to build.",
      },
    ],
  },
  {
    slug: "electricians",
    heading: "Websites for electricians",
    title: "Website Design for Electricians UK",
    metaDescription:
      "Websites for UK electricians. Show your NICEIC or NAPIT registration, win EICR and rewire enquiries, and get found locally. Fixed quotes from £800.",
    intro:
      "Electrical work is bought on trust and paperwork. Customers want to know you are registered, insured and certified before they let you near a consumer unit — and most of them want to check that without ringing you.",
    audience: "Electricians, EICR testers and electrical contractors",
    painPoints: [
      "Competing with unregistered traders who quote lower",
      "No clear way to display NICEIC, NAPIT or Part P credentials",
      "Landlords needing EICR certificates cannot find you",
      "Commercial enquiries going to firms that simply look bigger",
      "Explaining the same certification questions on every call",
    ],
    solutions: [
      {
        title: "Credentials that do the selling",
        body: "Registration bodies, Part P compliance and insurance are shown clearly rather than buried in an about page. This is the single strongest differentiator against an unregistered competitor.",
      },
      {
        title: "Pages for the work you want",
        body: "EICR testing, rewires, consumer unit upgrades and EV charger installs each get their own page, so you appear for the specific job someone is searching for.",
      },
      {
        title: "Built for landlord enquiries",
        body: "Landlords needing certificates are repeat, predictable work. The site is structured so that enquiry is easy to make and easy for you to price.",
      },
      {
        title: "Looks established",
        body: "A sole trader with a well-built site reads as more credible than a larger firm with a neglected one. That gap is where commercial enquiries are won.",
      },
    ],
    proofSlugs: ["do-book", "crown-auto-trading"],
    faqs: [
      {
        question: "Will a website help me win commercial work?",
        answer:
          "It helps you survive the shortlist. Commercial clients check that you exist, that you are registered, and that you look like you will still be trading next year. A weak site gets you filtered out before any conversation.",
      },
      {
        question: "Can I show my certificates and registration numbers?",
        answer:
          "Yes, and you should. Registration numbers, insurance details and scheme logos build more trust for electrical work than any amount of design.",
      },
      {
        question: "Do I need separate pages for each service?",
        answer:
          "For the services you actively want more of, yes. Someone searching \"EICR certificate\" and someone searching \"full house rewire\" are different customers, and a single services page serves neither well.",
      },
    ],
  },
  {
    slug: "builders",
    heading: "Websites for builders",
    title: "Website Design for Builders UK",
    metaDescription:
      "Websites for UK builders and extension specialists. Show finished work properly, filter out time-wasters, and win bigger jobs. Fixed quotes from £800.",
    intro:
      "Nobody commits fifty thousand pounds to an extension from a Facebook page. For work at that value, people want to see what you have finished, who you did it for, and what it cost them in disruption.",
    audience: "Builders, extension and renovation specialists",
    painPoints: [
      "Serious enquiries lost to firms that simply look more established",
      "Photos of finished work scattered across a personal phone",
      "Time wasted quoting jobs that were never realistic",
      "No way to show the scale of work you actually handle",
      "Competing on price because nothing else distinguishes you",
    ],
    solutions: [
      {
        title: "Project galleries that sell",
        body: "Finished work shown properly, with before and after, scope and timescale. For high-value work this is the most persuasive thing on the entire site.",
      },
      {
        title: "Fewer wasted quotes",
        body: "Being clear about the size and type of work you take on means the enquiries that reach you are closer to the ones you want, so less of your evening goes on quotes that go nowhere.",
      },
      {
        title: "Proof you finish",
        body: "Client testimonials and completed projects answer the fear behind every building enquiry, which is being left with an unfinished job and a builder who stopped answering.",
      },
      {
        title: "Looks the size you are",
        body: "Presentation is what separates a two-van firm that wins extensions from one that only gets small repairs. The site closes that gap.",
      },
    ],
    proofSlugs: ["crown-auto-trading", "mymathshero"],
    faqs: [
      {
        question: "I have hundreds of photos. Can you use them?",
        answer:
          "Yes. Send what you have and I will pick and crop the strongest ones. A dozen well-presented projects beats a hundred unsorted phone photos.",
      },
      {
        question: "Should I show prices for building work?",
        answer:
          "Rarely fixed prices, but indicative ranges help. Saying single-storey extensions typically start around a certain figure saves you quoting for budgets that were never going to work.",
      },
      {
        question: "Can I add new projects myself?",
        answer:
          "Yes, if you want to. I can set up a simple way to add projects and photos, and show you how. If you would rather send them to me, that works too.",
      },
    ],
  },
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
