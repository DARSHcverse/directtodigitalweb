import type { Metadata } from "next";
import { site } from "@/lib/site";

/**
 * Builds page metadata with a canonical URL, which Next does not infer.
 * Without canonicals, query-string and trailing-slash variants compete
 * against each other in the index.
 */
export function pageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${site.url}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: site.locale,
      siteName: site.name,
      title: `${title} | ${site.name}`,
      description,
      url,
      images: [
        { url: "/opengraph-image", width: 1200, height: 630, alt: title },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description,
      images: ["/opengraph-image"],
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}
