import { NextResponse } from "next/server";
import { Resend } from "resend";
import { leadSchema, leadKindLabel, type LeadInput } from "@/lib/lead";
import { site } from "@/lib/site";

/** Escape untrusted input before it goes anywhere near an HTML email body.
 *  The old Netlify functions interpolated raw user input — this closes that. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, value?: string | null): string {
  if (!value) return "";
  const body = esc(value).replace(/\r?\n/g, "<br>");
  return `<p style="margin:0 0 8px"><strong>${esc(label)}:</strong> ${body}</p>`;
}

/** Best-effort in-memory rate limit. Serverless instances are ephemeral and
 *  not shared, so this blunts bursts rather than guaranteeing a global cap.
 *  Swap for Upstash/Vercel KV if abuse becomes a real problem. */
const HITS = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (HITS.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  HITS.set(ip, recent);
  if (HITS.size > 5000) HITS.clear();
  return recent.length > MAX_PER_WINDOW;
}

function adminEmail(lead: LeadInput): string {
  return `
    <h2 style="margin:0 0 16px">${esc(leadKindLabel[lead.kind])}</h2>
    ${row("Name", lead.name)}
    ${row("Email", lead.email)}
    ${row("Phone", lead.phone)}
    ${row(lead.kind === "booking" ? "Service" : "Project type", lead.topic)}
    ${row("Budget (GBP)", lead.budget)}
    ${row("Timeline", lead.timeline)}
    ${row("Message", lead.message)}
  `;
}

function clientEmail(lead: LeadInput): string {
  return `
    <h2 style="margin:0 0 16px">Thanks, ${esc(lead.name)}.</h2>
    <p>I've received your ${esc(leadKindLabel[lead.kind].toLowerCase())} and will reply within one business day.</p>
    ${lead.topic ? row("You asked about", lead.topic) : ""}
    <p style="margin-top:24px">— ${esc(site.name)}</p>
  `;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Please check your details." },
      { status: 400 },
    );
  }

  const lead = parsed.data;

  // Honeypot tripped — accept silently so bots get no signal.
  if (lead.companyWebsite) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    console.error("Resend env vars missing: RESEND_API_KEY / RESEND_FROM_EMAIL");
    return NextResponse.json(
      { error: "Email is not configured yet. Please try again later." },
      { status: 500 },
    );
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: `${site.name} <${from}>`,
      to: [process.env.LEAD_INBOX ?? site.contactEmail],
      replyTo: lead.email,
      subject: `${leadKindLabel[lead.kind]} from ${lead.name}`,
      html: adminEmail(lead),
    });

    if (error) {
      console.error("Resend admin send failed:", error);
      return NextResponse.json(
        { error: "We couldn't send that just now. Please email me directly." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("Resend threw:", err);
    return NextResponse.json(
      { error: "We couldn't send that just now. Please email me directly." },
      { status: 502 },
    );
  }

  // Confirmation to the client is best-effort: the lead is already captured,
  // so a failure here must not surface as an error to the visitor.
  try {
    await resend.emails.send({
      from: `${site.name} <${from}>`,
      to: [lead.email],
      subject: `Thanks for getting in touch with ${site.name}`,
      html: clientEmail(lead),
    });
  } catch (err) {
    console.error("Client confirmation failed (non-fatal):", err);
  }

  return NextResponse.json({ ok: true });
}
