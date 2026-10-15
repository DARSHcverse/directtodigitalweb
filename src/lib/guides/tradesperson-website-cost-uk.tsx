import {
  A,
  H2,
  InlineCta,
  List,
  P,
  Table,
} from "@/components/guides/GuideBlocks";
import type { Guide } from "./types";

const slug = "tradesperson-website-cost-uk";

/**
 * Guide 1, from Part H of the SEO and content pack.
 *
 * Figures and their sources (re-check on the day it is published):
 * - Wix UK £9–£25 a month on yearly billing for Light, Core and Business:
 *   startups.co.uk, expertmarket.com, wise.com, checked 15 Oct 2026. Whether
 *   VAT is included is not stated consistently, so the copy does not say.
 * - .co.uk domain £7–£15 a year; freelancer £800–£3,000; agency £2,500+:
 *   whito.co.uk "Plumber website cost UK", 2026.
 * - Pay-monthly trade sites £30–£179 a month: Websites 4 Trades, Onebase
 *   Media, Test Valley Digital, seen 13 Oct 2026. Not named on the page.
 * - One-off trade builds £595–£995: Websites for Tradespeople, 13 Oct 2026.
 * - 35% of sole traders without a website: UK Business Data Survey 2024.
 * - 97% read reviews for local businesses: BrightLocal 2026.
 */
function Body() {
  return (
    <>
      <P>
        I build trade websites for a living, so I&apos;m not neutral. I&apos;ll
        give you the ranges as they stand and you can judge for yourself.
      </P>

      <H2 id="four-ways">The four ways to get a website, and what each costs</H2>
      <Table
        caption="What each way of getting a website costs a UK tradesperson"
        head={["Route", "What you pay", "What you get", "Watch out for"]}
        rows={[
          [
            "Do it yourself (Wix, Squarespace and similar)",
            "Roughly £9 to £25 a month on the plans most small businesses use, paying yearly, plus a domain at about £7 to £15 a year",
            "Full control, if you have the time",
            "Your evenings. A lot of DIY trade sites end up half finished.",
          ],
          [
            "Pay-monthly trade website",
            "About £30 to £180 a month, from the UK trade web firms I checked in October 2026",
            "No big upfront bill; hosting and changes often included",
            "Over two or three years it often costs more than a one-off build, and on some plans you don't own the site",
          ],
          [
            "One-off build from a freelancer or trade specialist",
            "About £600 to £3,000; most four to six page trade sites sit in the lower half",
            "A site you own, built around your trade",
            "Hosting is extra (usually a few pounds a month). Get the price fixed in writing.",
          ],
          [
            "Agency",
            "Usually £2,500 upwards, often much more",
            "A team and account managers",
            "You're paying for things a sole trader rarely needs",
          ],
        ]}
      />

      <H2 id="what-you-pay-for">What you&apos;re actually paying for</H2>
      <List>
        <li>
          <strong>Your domain</strong> (yourname.co.uk): around £7 to £15 a
          year. It should be registered in your name, not your web
          designer&apos;s.
        </li>
        <li>
          <strong>Hosting</strong>: for a small, fast site, a few pounds a
          month.
        </li>
        <li>
          <strong>The build</strong>: design, layout, and making it work
          properly on a phone, where most of your customers will see it.
        </li>
        <li>
          <strong>The words</strong>: the part most people underestimate.
          &ldquo;Quality workmanship, no job too small&rdquo; tells a customer
          nothing.
        </li>
        <li>
          <strong>Google setup</strong>: page titles, descriptions, a sitemap,
          Search Console, and a link to your Google Business Profile.
        </li>
        <li>
          <strong>Photos</strong>: your own jobs beat stock photos every time.
        </li>
      </List>

      <InlineCta slug={slug} trade="none" />

      <H2 id="pay-monthly-sum">The sum nobody does: pay-monthly over three years</H2>
      <P>
        Say a pay-monthly plan costs £50 a month. That&apos;s £600 a year and
        £1,800 over three years, and on some plans the site goes when the
        payments stop. A one-off build from £800, plus hosting at £5 a month,
        comes to about £980 over the same three years, and you own it. Your
        numbers will be different, so do the sum with the actual quotes in
        front of you.
      </P>
      <P>
        Pay-monthly isn&apos;t always worse. If you can&apos;t find the money up
        front, or you want someone else handling every change, it can make
        sense. Just know which one you&apos;re buying.
      </P>

      <H2 id="cost-of-not-having-one">The cost of not having one</H2>
      <P>
        A third of UK sole traders still have no website: 35%, according to
        the government&apos;s{" "}
        <A href="https://www.gov.uk/government/statistics/uk-business-data-survey-2024">
          UK Business Data Survey 2024
        </A>
        . That&apos;s an opening for the ones who do. And 97% of people read
        reviews when choosing a local business (
        <A href="https://www.brightlocal.com/research/local-consumer-review-survey/">
          BrightLocal, 2026
        </A>
        ). Even a recommendation from a neighbour gets checked online before
        the phone rings.
      </P>
      <P>
        If you pay for leads on Checkatrade, MyBuilder, Rated People or Bark,
        add up what that cost you last year. Your own site doesn&apos;t replace
        those overnight, but it gives the customers who already know your name
        somewhere to land that isn&apos;t a list of your competitors.
      </P>

      <H2 id="what-it-has-to-do">What a trade website has to do, whatever you pay</H2>
      <List ordered>
        <li>Show who you are, what you do and where, in the first few seconds.</li>
        <li>Put a phone number you can tap at the top of every page on a mobile.</li>
        <li>
          Show proof: Gas Safe or NICEIC numbers, insurance, real photos,
          reviews.
        </li>
        <li>
          Have a quote form that asks the right questions: the job, the
          postcode, a photo.
        </li>
        <li>Load quickly on a phone with a weak signal.</li>
      </List>
      <P>
        If a £2,000 site doesn&apos;t do these and a £600 one does, the £600 one
        is the better site. Here&apos;s what that looks like for{" "}
        <A href="/for/plumbers">plumbers</A>,{" "}
        <A href="/for/electricians">electricians</A>,{" "}
        <A href="/for/builders">builders</A> and{" "}
        <A href="/for/roofers">roofers</A>.
      </P>

      <H2 id="questions-to-ask">Questions to ask before you pay anyone</H2>
      <List>
        <li>Is the price fixed, in writing, and what exactly does it include?</li>
        <li>Is the domain registered in my name?</li>
        <li>Who holds the hosting login, and what does hosting cost each year?</li>
        <li>If I stop a monthly plan, what happens to my site?</li>
        <li>Who writes the words?</li>
        <li>Can I change things myself, and do I have to?</li>
        <li>What happens if you&apos;re not around in two years&apos; time?</li>
      </List>

      <H2 id="what-i-charge">What I charge</H2>
      <P>
        Starter sites are from £800 (up to four pages), Business from £1,800
        (up to ten pages, and you can edit any page yourself), and online shops
        from £3,000. The price is fixed and agreed before I start. There&apos;s
        no monthly fee, hosting is billed to you at cost, and you own
        everything I build. <A href="/pricing">See full pricing</A>.
      </P>
      <P>
        Most plumbers, electricians and roofers I talk to are best on Starter
        or Business. If you&apos;d honestly be better off with a cheap DIY
        builder, I&apos;ll tell you.
      </P>
    </>
  );
}

export const tradespersonWebsiteCost: Guide = {
  slug,
  title: "How much does a website cost for a tradesperson in the UK?",
  metaTitle: "Tradesperson Website Cost UK (2026 Prices)",
  metaDescription:
    "What a trade website costs in the UK: DIY, pay-monthly, freelancer and agency prices, the hidden costs, and what to ask before you pay anyone.",
  excerpt:
    "DIY, pay-monthly, freelancer or agency: what each really costs a UK tradesperson, and the questions to ask before you pay anyone.",
  shortAnswer:
    "For most sole traders and small trade firms, somewhere between about £150 and £3,000, depending on who builds it and how you pay. Agencies can charge a lot more, but most plumbers, electricians and builders don't need one.",
  relatedTrade: "none",
  publishedAt: "2026-10-15",
  updatedAt: "2026-10-15",
  readMinutes: 6,
  // Approved by Shan on 15 Oct 2026.
  status: "published",
  Body,
};
