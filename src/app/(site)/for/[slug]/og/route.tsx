import { getLanding, landings } from "@/lib/landings";
import { brandCard } from "@/lib/og";
import { site } from "@/lib/site";

/** Share image for a trade or service page, at /for/[slug]/og. */
export const dynamic = "force-static";

export function generateStaticParams() {
  return landings.map((l) => ({ slug: l.slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const landing = getLanding(slug);
  return brandCard({
    eyebrow: landing ? "Fixed price from £800 · no monthly fee" : site.name,
    title: landing?.heading ?? site.tagline,
    footer: `${site.name} · ${site.phone.display}`,
  });
}
