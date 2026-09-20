/**
 * Shown on the page AND emitted as FAQPage schema.
 * Google requires FAQ schema to match visible page content, so these two
 * must always come from this single source.
 */
export const faqs = [
  {
    question: "How much does a website cost?",
    answer:
      "Most small-business sites fall between £800 and £3,000 depending on the number of pages and features. E-commerce builds start higher. Every quote is fixed and agreed up front, so there are no surprise invoices.",
  },
  {
    question: "How long does a website take to build?",
    answer:
      "A typical brochure site takes two to four weeks from kick-off to launch. Larger or e-commerce projects usually run four to eight weeks. Timelines depend mostly on how quickly content and feedback come back.",
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
    question: "Do you provide hosting and ongoing support?",
    answer:
      "Sites are deployed to modern hosting that is fast and inexpensive to run, and I can manage that for you. Ongoing support and maintenance are available if you want them, and are never bundled in without asking.",
  },
  {
    question: "What do you need from me to get started?",
    answer:
      "An idea of what your business does, examples of sites you like, and any text or images you already have. If content is not ready, that is normal, and we can work through it together as the build progresses.",
  },
] as const;
