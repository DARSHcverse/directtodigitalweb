import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default social card, used wherever a page does not define its own. */
export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0f2a47",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 88,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            marginBottom: 24,
          }}
        >
          {site.name}
        </div>
        <div style={{ fontSize: 40, color: "#cbd7e6", lineHeight: 1.3 }}>
          {site.tagline}
        </div>
        <div
          style={{
            marginTop: 48,
            width: 180,
            height: 8,
            background: "linear-gradient(90deg, #f5a623, #d98b0f)",
          }}
        />
      </div>
    ),
    size,
  );
}
