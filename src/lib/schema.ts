import { site, serviceCatalogue } from "@/lib/site";

/**
 * JSON-LD builders.
 *
 * Deliberately modelled as ProfessionalService rather than LocalBusiness:
 * there are no public premises, and LocalBusiness implies a place customers
 * visit. The address is locality-only for the same reason.
 */

/**
 * Towns covered, then the whole country. Listing the towns lets search
 * engines connect the business to Swansea, Watford and London searches
 * without pretending to an office in each.
 */
function areas() {
  return [
    ...site.areasServed.map((name) => ({ "@type": "City", name })),
    { "@type": "Country", name: site.areaServed },
  ];
}

const ORG_ID = `${site.url}/#organisation`;
const SITE_ID = `${site.url}/#website`;

export function organisationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": ORG_ID,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    description: site.description,
    email: site.contactEmail,
    telephone: site.phone.e164,
    openingHours: site.phone.openingHours,
    // Pointed at the old brand's /images/d2d-logo.png, which no longer exists,
    // so every crawl of this schema found a broken image.
    image: `${site.url}/TradeIcon.png`,
    logo: {
      "@type": "ImageObject",
      url: `${site.url}/TradeIcon.png`,
      width: 1080,
      height: 1080,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: site.locality,
      addressRegion: site.region,
      addressCountry: "GB",
    },
    founder: {
      "@type": "Person",
      name: site.founder,
      image: `${site.url}/shan.webp`,
      ...(site.sameAs.length > 0 ? { sameAs: site.sameAs } : {}),
    },
    areaServed: areas(),
    priceRange: "££",
    currenciesAccepted: site.currency,
    ...(site.sameAs.length > 0 ? { sameAs: site.sameAs } : {}),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Web design services",
      itemListElement: serviceCatalogue.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: service.description,
          provider: { "@id": ORG_ID },
          areaServed: areas(),
        },
      })),
    },
  };
}

export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    url: site.url,
    name: site.name,
    description: site.description,
    inLanguage: "en-GB",
    publisher: { "@id": ORG_ID },
  };
}

export function breadcrumbSchema(
  trail: ReadonlyArray<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${site.url}${crumb.path}`,
    })),
  };
}

export function faqSchema(
  faqs: ReadonlyArray<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

/**
 * Service schema for a landing page.
 *
 * Tells Google this page is about one specific service rather than the
 * business generally, which is what lets a trade page compete for its own
 * query instead of being treated as a duplicate of the homepage.
 */
export function serviceSchema({
  name,
  description,
  path,
  audience,
}: {
  name: string;
  description: string;
  path: string;
  /** Who the service is for, e.g. "Plumbers, heating engineers…". */
  audience?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${site.url}${path}#service`,
    name,
    description,
    serviceType: "Website design",
    ...(audience
      ? { audience: { "@type": "BusinessAudience", name: audience } }
      : {}),
    url: `${site.url}${path}`,
    provider: { "@id": ORG_ID },
    areaServed: areas(),
    // "from £800" rather than a fixed figure: every project is quoted, and
    // a precise price here would be a claim we cannot honour.
    offers: {
      "@type": "Offer",
      priceCurrency: site.currency,
      price: "800",
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: "800",
        priceCurrency: site.currency,
        valueAddedTaxIncluded: false,
      },
      availability: "https://schema.org/InStock",
    },
  };
}

export function contactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url: `${site.url}/contact`,
    name: `Contact ${site.name}`,
    mainEntity: { "@id": ORG_ID },
  };
}

/**
 * A guide, as an article Google can attribute to a named author. Dates come
 * from the guide record, so dateModified moves only when facts change.
 */
export function blogPostingSchema(guide: {
  slug: string;
  title: string;
  metaDescription: string;
  publishedAt: string;
  updatedAt: string;
}) {
  const url = `${site.url}/guides/${guide.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: guide.title,
    description: guide.metaDescription,
    url,
    mainEntityOfPage: url,
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt,
    image: `${url}/og`,
    inLanguage: "en-GB",
    author: {
      "@type": "Person",
      name: site.founder,
      url: `${site.url}/about`,
    },
    publisher: { "@id": ORG_ID },
  };
}
