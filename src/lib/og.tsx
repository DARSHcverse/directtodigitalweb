import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

/**
 * The branded share card: a small amber label, a large title, and the name
 * underneath. Used for guides and trade pages, so a link shared in a
 * Facebook group or text message says what it is.
 *
 * Satori, which renders these, needs every element with more than one child
 * to be display:flex, and text passed as a single string.
 */
export function brandCard({
  eyebrow,
  title,
  footer,
}: {
  eyebrow: string;
  title: string;
  footer: string;
}) {
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
          {eyebrow}
        </div>
        <div
          style={{
            fontSize: title.length > 60 ? 58 : 72,
            fontWeight: 700,
            lineHeight: 1.12,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 120, height: 8, background: "#f5a623" }} />
          <div style={{ fontSize: 30, color: "#cbd7e6" }}>{footer}</div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
