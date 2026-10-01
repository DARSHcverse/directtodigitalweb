import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/lead";
import { site } from "@/lib/site";
import { isDbConfigured, serviceClient } from "@/lib/db/server";
import { isEmailConfigured, sendEmail } from "@/lib/email/send";
import { customerWelcome, ownerLeadAlert } from "@/lib/email/templates";

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

  // Which page the enquiry came from, so we learn what actually converts.
  const referer = request.headers.get("referer");
  let sourcePath: string | null = null;
  if (referer) {
    try {
      sourcePath = new URL(referer).pathname.slice(0, 200);
    } catch {
      sourcePath = null;
    }
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

  // Persist first, notify second.
  //
  // The enquiry is the thing of value: if email delivery fails the lead must
  // still exist. Previously a Resend outage lost it permanently, since the
  // inbox was the only record.
  let stored = false;
  if (isDbConfigured()) {
    try {
      const { error } = await serviceClient().from("leads").insert({
        kind: lead.kind,
        name: lead.name,
        email: lead.email,
        phone: lead.phone || null,
        topic: lead.topic || null,
        budget: lead.budget || null,
        timeline: lead.timeline || null,
        message: lead.message || null,
        source_path: sourcePath,
        // Hashed, not raw: enough to correlate abuse, not a stored identifier.
        ip_hash:
          ip === "unknown"
            ? null
            : createHash("sha256").update(ip).digest("hex").slice(0, 32),
      });
      if (error) {
        console.error("Lead insert failed:", error.message);
      } else {
        stored = true;
      }
    } catch (err) {
      // Never fail the visitor's submission over a database problem — the
      // email below is still a usable fallback.
      console.error("Lead insert threw:", err);
    }
  }

  // Notify. Templates live in lib/email so every message shares one layout,
  // and the lead is already safe whether or not delivery succeeds.
  if (!isEmailConfigured()) {
    if (stored) return NextResponse.json({ ok: true });
    return NextResponse.json(
      { error: "Email is not configured yet. Please try again later." },
      { status: 500 },
    );
  }

  const alert = ownerLeadAlert(lead, sourcePath);
  const toOwner = await sendEmail({
    to: process.env.LEAD_INBOX ?? site.contactEmail,
    subject: alert.subject,
    html: alert.html,
    text: alert.text,
    // Replying to the notification goes straight to the enquirer.
    replyTo: lead.email,
  });

  if (!toOwner.ok && !stored) {
    return NextResponse.json(
      { error: "We couldn't send that just now. Please email me directly." },
      { status: 502 },
    );
  }

  // The acknowledgement is best-effort: the enquiry is already captured, so a
  // failure here must not be shown to the visitor as a failed submission.
  const welcome = customerWelcome(lead);
  await sendEmail({
    to: lead.email,
    subject: welcome.subject,
    html: welcome.html,
    text: welcome.text,
  });

  return NextResponse.json({ ok: true });
}