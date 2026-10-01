import { site } from "@/lib/site";

/**
 * Email layout shared by every message we send.
 *
 * Written as table-based HTML with inline styles on purpose. Email clients —
 * Outlook especially — do not reliably support flexbox, grid, external
 * stylesheets or most modern CSS, so the techniques used on the website would
 * break here. Everything is deliberately conservative.
 */

export const BRAND = {
  navy: "#0f2a47",
  navyDeep: "#081726",
  amber: "#f5a623",
  ink: "#10151c",
  muted: "#59636f",
  surface: "#ffffff",
  page: "#f1f4f8",
  edge: "#e3e6ea",
} as const;

/** Escape anything that came from a person before it reaches an email body. */
export function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Preserves line breaks typed into a textarea. */
export function escMultiline(value: string): string {
  return esc(value).replace(/\r?\n/g, "<br>");
}

export function button(href: string, label: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;">
      <tr>
        <td style="background-color:${BRAND.amber};">
          <a href="${esc(href)}"
             style="display:inline-block;padding:14px 28px;font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:bold;color:${BRAND.navyDeep};text-decoration:none;letter-spacing:0.3px;">
            ${esc(label)}
          </a>
        </td>
      </tr>
    </table>`;
}

/** A labelled row, used for enquiry and invoice details. */
export function detailRow(label: string, value?: string | null): string {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid ${BRAND.edge};font-family:Helvetica,Arial,sans-serif;font-size:14px;color:${BRAND.muted};width:38%;vertical-align:top;">
        ${esc(label)}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid ${BRAND.edge};font-family:Helvetica,Arial,sans-serif;font-size:15px;color:${BRAND.ink};">
        ${escMultiline(value)}
      </td>
    </tr>`;
}

export function detailTable(rows: string): string {
  if (!rows.trim()) return "";
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:8px 0 24px;border-collapse:collapse;">
      ${rows}
    </table>`;
}

/** Amber-ruled callout, matching the website's section device. */
export function callout(text: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:24px 0;">
      <tr>
        <td style="background-color:${BRAND.page};border-left:4px solid ${BRAND.amber};padding:16px 20px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:${BRAND.ink};">
          ${text}
        </td>
      </tr>
    </table>`;
}

/**
 * Sign-off. Darshan trades as Shan with clients, so that is the name that
 * goes on correspondence.
 */
function signature(): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:32px;border-top:1px solid ${BRAND.edge};">
      <tr>
        <td style="padding-top:24px;">
          <p style="margin:0 0 4px;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-style:italic;color:${BRAND.navy};">
            Shan
          </p>
          <p style="margin:0 0 2px;font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:bold;color:${BRAND.ink};">
            ${esc(site.name)}
          </p>
          <p style="margin:0 0 12px;font-family:Helvetica,Arial,sans-serif;font-size:13px;color:${BRAND.muted};">
            Websites for tradespeople, across the UK
          </p>
          <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:13px;color:${BRAND.muted};">
            <a href="mailto:${esc(site.contactEmail)}" style="color:${BRAND.navy};text-decoration:none;">${esc(site.contactEmail)}</a>
            &nbsp;·&nbsp;
            <a href="${esc(site.url)}" style="color:${BRAND.navy};text-decoration:none;">${esc(site.url.replace(/^https?:\/\//, ""))}</a>
          </p>
        </td>
      </tr>
    </table>`;
}

/**
 * Wraps body content in the branded shell.
 *
 * `preheader` is the grey snippet shown next to the subject line in most
 * inboxes. Left unset, clients scrape the first visible text, which is often
 * a header or an unsubscribe line.
 */
export function emailLayout({
  heading,
  preheader,
  body,
  showSignature = true,
}: {
  heading: string;
  preheader: string;
  body: string;
  showSignature?: boolean;
}): string {
  return `<!doctype html>
<html lang="en-GB">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>${esc(heading)}</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.page};">
  <!-- Preheader: shown in the inbox preview, hidden in the message itself. -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    ${esc(preheader)}
  </div>

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${BRAND.page};">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;background-color:${BRAND.surface};border:2px solid ${BRAND.navy};">

          <!-- Masthead -->
          <tr>
            <td style="background-color:${BRAND.navy};padding:24px 32px;">
              <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:20px;font-weight:bold;color:#ffffff;letter-spacing:-0.3px;">
                Trade Web <span style="color:${BRAND.amber};">Co.</span>
              </p>
            </td>
          </tr>

          <!-- Amber rule -->
          <tr><td style="height:4px;background-color:${BRAND.amber};font-size:0;line-height:0;">&nbsp;</td></tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 20px;font-family:Helvetica,Arial,sans-serif;font-size:24px;line-height:1.25;font-weight:bold;color:${BRAND.navy};">
                ${esc(heading)}
              </h1>
              ${body}
              ${showSignature ? signature() : ""}
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;">
          <tr>
            <td style="padding:20px 32px;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:${BRAND.muted};text-align:center;">
              ${esc(site.name)} · Websites for UK tradespeople<br>
              <a href="${esc(site.url)}/privacy" style="color:${BRAND.muted};">Privacy</a>
              &nbsp;·&nbsp;
              <a href="${esc(site.url)}/terms" style="color:${BRAND.muted};">Terms</a>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Plain-text alternative. Improves deliverability and serves anyone reading
 *  in a text-only client. */
export function plainTextFooter(): string {
  return `

—
Shan
${site.name}
Websites for tradespeople, across the UK
${site.contactEmail}
${site.url}`;
}
