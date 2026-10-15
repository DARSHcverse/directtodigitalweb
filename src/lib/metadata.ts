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
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
  /**
   * Use the title exactly, without " | Trade Web Co". For titles that would
   * pass 60 characters with the suffix, where Google would cut them off.
   */
  absoluteTitle?: boolean;
}): Metadata {
  const url = `${site.url}${path}`;
  const full = absoluteTitle ? title : `${title} | ${site.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: site.locale,
      siteName: site.name,
      title: full,
      description,
      url,
      images: [
        { url: "/opengraph-image", width: 1200, height: 630, alt: title },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: full,
      description,
      images: ["/opengraph-image"],
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}
