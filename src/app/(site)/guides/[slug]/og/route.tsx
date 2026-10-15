import { getGuide, listGuides } from "@/lib/guides";
import { brandCard } from "@/lib/og";
import { site } from "@/lib/site";

/**
 * Share image at a fixed address, /guides/[slug]/og. As an opengraph-image
 * file in a dynamic segment, Next adds a random suffix to the URL, so the
 * page, its share tags and its schema could not reliably point at it.
 */
export const dynamic = "force-static";

export function generateStaticParams() {
  return listGuides().map((g) => ({ slug: g.slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const guide = getGuide(slug);
  return brandCard({
    eyebrow: "Guide for tradespeople",
    title: guide?.title ?? site.name,
    footer: `${site.name} · by Shan`,
  });
}
