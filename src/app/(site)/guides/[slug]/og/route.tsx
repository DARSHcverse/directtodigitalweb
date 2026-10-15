import { ImageResponse } from "next/og";
import { getGuide, listGuides } from "@/lib/guides";
import { site } from "@/lib/site";

const size = { width: 1200, height: 630 };

/**
 * Served at a fixed address, /guides/[slug]/og. As an opengraph-image file
 * in a dynamic segment, Next adds a random suffix to the URL, so the page,
 * its share tags and its schema could not reliably point at it.
 */
export const dynamic = "force-static";

export function generateStaticParams() {
  return listGuides().map((g) => ({ slug: g.slug }));
}

/**
 * The guide's title on a branded card, so a link shared in a WhatsApp or
 * Facebook group says what it is rather than showing the generic site card.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const guide = getGuide(slug);
  const title = guide?.title ?? site.name;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0f2a47",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: "0.18em",
            color: "#f5a623",
            textTransform: "uppercase",
          }}
        >
          Guide for tradespeople
        </div>
        <div
          style={{
            fontSize: title.length > 60 ? 58 : 68,
            fontWeight: 700,
            lineHeight: 1.12,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 120, height: 8, background: "#f5a623" }} />
          <div style={{ fontSize: 30, color: "#cbd7e6" }}>
            {`${site.name} · by Shan`}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
