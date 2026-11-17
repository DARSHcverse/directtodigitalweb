/**
 * Shown on the page AND emitted as FAQPage schema.
 * Google requires FAQ schema to match visible page content, so these two
 * must always come from this single source.
 */
export const faqs = [
  {
    question: "How much does a website or app cost?",
    answer:
      "Websites start from £800, and most small-business sites fall between £800 and £3,000. Websites with online booking start from £2,500, web apps from £5,000, and mobile apps for iPhone and Android from £8,000. Every quote is fixed and agreed up front, so there are no surprise invoices.",
  },
  {
    question: "Do you build apps as well as websites?",
    answer:
      "Yes. Web apps that run in the browser, such as booking systems, customer portals and subscription products, and mobile apps for iPhone and Android, built once for both. I built MyMathsHero, a subscription learning app, and DoBook, a booking system with payments.",
  },
  {
    question: "How long does a website take to build?",
    answer:
      "A typical brochure site takes two to four weeks from kick-off to launch. Booking sites usually take three to five weeks, and online shops four to eight. Apps depend on what the first version has to do, so the quote includes a date agreed before work starts.",
  },
  {
    question: "Do you work with businesses outside your area?",
    answer:
      "Yes. I work remotely with small businesses across the United Kingdom. Everything runs over email and video calls, so your location makes no difference to the process or the price.",
  },
  {
    question: "Will my website show up on Google?",
    answer:
      "Every site I build ships with the technical SEO groundwork in place: fast server-rendered pages, proper meta tags, structured data, a sitemap and mobile-friendly layouts. That gives you a solid foundation, though ranking for competitive terms also depends on your content and time.",
  },
  {
    question: "Will I be able to update the website myself?",
    answer:
      "Yes. Every site includes an admin area built into your own website — you go to your address, add /admin, and sign in. On the Starter option you can write and publish blog posts. On Business and E-commerce you can edit any page: prices, services, opening hours, photos and text. It works like writing an email, changes appear within seconds, and you cannot break the design because the layout stays locked.",
  },
  {
    question: "Do you provide hosting and ongoing support?",
    answer:
      "Sites are deployed to modern hosting that is fast and inexpensive to run, and I can manage that for you. Ongoing support and maintenance are available if you want them, and are never bundled in without asking.",
  },
  {
    question: "What do you need from me to get started?",
    answer:
      "An idea of what your business does, examples of sites you like, and any text or images you already have. If content is not ready, that is normal, and I can work through it together as the build progresses.",
  },
] as const;
