import { site, serviceCatalogue } from "@/lib/site";

/**
 * JSON-LD builders.
 *
 * Deliberately modelled as ProfessionalService rather than LocalBusiness:
 * this is a remote, UK-wide operation with no public premises, and
 * LocalBusiness without a real postal address is a weak (and risky) signal.
 */

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
    image: `${site.url}/images/d2d-logo.png`,
    logo: {
      "@type": "ImageObject",
      url: `${site.url}/images/d2d-logo.png`,
      width: 1024,
      height: 1024,
    },
    founder: { "@type": "Person", name: site.founder },
    areaServed: { "@type": "Country", name: site.areaServed },
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
          areaServed: { "@type": "Country", name: site.areaServed },
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

export function contactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url: `${site.url}/contact`,
    name: `Contact ${site.name}`,
    mainEntity: { "@id": ORG_ID },
  };
}
