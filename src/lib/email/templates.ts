import {
  emailLayout,
  detailRow,
  detailTable,
  callout,
  button,
  esc,
  escMultiline,
  plainTextFooter,
  BRAND,
} from "@/lib/email/layout";
import { leadKindLabel, type LeadInput } from "@/lib/lead";
import { site } from "@/lib/site";

const p = (text: string) =>
  `<p style="margin:0 0 16px;font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.65;color:${BRAND.ink};">${text}</p>`;

/** First name only — "Hi Dave" reads better than "Hi Dave Morris". */
function firstName(name: string): string {
  return esc(name.trim().split(/\s+/)[0] ?? name);
}

/* ────────────────────────────────────────────────────────────
   To the customer: acknowledging their enquiry
   ──────────────────────────────────────────────────────────── */

export function customerWelcome(lead: LeadInput): {
  subject: string;
  html: string;
  text: string;
} {
  const name = firstName(lead.name);
  const isCall = lead.kind === "booking";

  // What happens next matters more than thanking them: the common worry
  // after sending an enquiry is not knowing whether it arrived.
  const body = [
    p(`Thanks for getting in touch — your ${esc(leadKindLabel[lead.kind].toLowerCase())} has arrived safely.`),
    p(
      isCall
        ? `I'll email you <strong>within one working day</strong> to confirm an exact time${
            lead.topic === "Zoom video call" ? ", with the Zoom link" : ""
          }. If it's urgent, just reply to this email and it comes directly to me.`
        : `I read every enquiry myself, and I'll come back to you <strong>within one working day</strong> with a straight answer. If it's urgent, just reply to this email and it comes directly to me.`,
    ),
    lead.topic || lead.budget || lead.timeline
      ? `<p style="margin:24px 0 8px;font-family:Helvetica,Arial,sans-serif;font-size:13px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:${BRAND.muted};">What you sent</p>` +
        detailTable(
          detailRow(isCall ? "Call by" : "Looking for", lead.topic) +
            detailRow("Budget", lead.budget) +
            detailRow(isCall ? "When suits" : "Timeline", lead.timeline),
        )
      : "",
    callout(
      `<strong style="color:${BRAND.navy};">While you wait</strong><br>
       Have a think about three things: what you want people to do when they land on your site, any sites you like the look of, and whether you have photos of recent jobs. That's most of the groundwork done.`,
    ),
    button(`${site.url}/design`, "See recent work"),
  ].join("");

  const html = emailLayout({
    heading: `Thanks, ${name} — I've got it`,
    preheader: "Your enquiry has arrived. I'll reply within one working day.",
    body,
  });

  const text = `Thanks, ${lead.name} — I've got it

Your ${leadKindLabel[lead.kind].toLowerCase()} has arrived safely.

I read every enquiry myself, and I'll come back to you within one working
day with a straight answer. If it's urgent, just reply to this email.

While you wait, have a think about three things: what you want people to do
when they land on your site, any sites you like the look of, and whether you
have photos of recent jobs. That's most of the groundwork done.

See recent work: ${site.url}/design${plainTextFooter()}`;

  return {
    subject: `Thanks ${name} — I've got your enquiry`,
    html,
    text,
  };
}

/* ────────────────────────────────────────────────────────────
   To Shan: a new enquiry
   ──────────────────────────────────────────────────────────── */

export function ownerLeadAlert(
  lead: LeadInput,
  sourcePath: string | null,
): { subject: string; html: string; text: string } {
  // Built so the phone number and email are tappable straight from a phone,
  // which is where this gets read.
  const body = [
    p(
      `<strong style="color:${BRAND.navy};">${esc(lead.name)}</strong> got in touch${
        sourcePath ? ` from <code style="background:${BRAND.page};padding:2px 6px;">${esc(sourcePath)}</code>` : ""
      }.`,
    ),
    detailTable(
      detailRow("Name", lead.name) +
        detailRow("Trade", lead.trade) +
        detailRow("Town", lead.town) +
        detailRow("Email", lead.email) +
        detailRow("Phone", lead.phone) +
        detailRow("Current site", lead.website) +
        detailRow(
          lead.kind === "booking" ? "Call by" : "Project type",
          lead.topic,
        ) +
        detailRow("Budget", lead.budget) +
        detailRow(
          lead.kind === "booking" ? "When suits" : "Timeline",
          lead.timeline,
        ) +
        // Which channel produced this, so a flyer or referral test can be
        // judged from the inbox without opening the database.
        detailRow("Source", sourceLabel(lead)) +
        detailRow("First page", lead.landingPage),
    ),
    lead.message
      ? `<p style="margin:24px 0 8px;font-family:Helvetica,Arial,sans-serif;font-size:13px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:${BRAND.muted};">Their message</p>` +
        callout(escMultiline(lead.message))
      : "",
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;">
       <tr>
         <td style="background-color:${BRAND.navy};">
           <a href="mailto:${esc(lead.email)}" style="display:inline-block;padding:14px 24px;font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:bold;color:#ffffff;text-decoration:none;">Reply to ${firstName(lead.name)}</a>
         </td>
         ${
           lead.phone
             ? `<td style="padding-left:12px;">
                  <a href="tel:${esc(lead.phone.replace(/\s/g, ""))}" style="display:inline-block;padding:12px 24px;border:2px solid ${BRAND.navy};font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:bold;color:${BRAND.navy};text-decoration:none;">Call</a>
                </td>`
             : ""
         }
       </tr>
     </table>`,
  ].join("");

  const html = emailLayout({
    heading: `New ${leadKindLabel[lead.kind].toLowerCase()}`,
    preheader: `${lead.name}${lead.topic ? ` — ${lead.topic}` : ""}${lead.budget ? ` · ${lead.budget}` : ""}`,
    body,
    // An internal alert needs no sign-off.
    showSignature: false,
  });

  const text = `New ${leadKindLabel[lead.kind].toLowerCase()}${sourcePath ? ` from ${sourcePath}` : ""}

Name:     ${lead.name}
${lead.trade ? `Trade:    ${lead.trade}\n` : ""}${lead.town ? `Town:     ${lead.town}\n` : ""}Email:    ${lead.email}
${lead.phone ? `Phone:    ${lead.phone}\n` : ""}${lead.topic ? `Type:     ${lead.topic}\n` : ""}${lead.budget ? `Budget:   ${lead.budget}\n` : ""}${lead.timeline ? `Timeline: ${lead.timeline}\n` : ""}${lead.website ? `Site:     ${lead.website}\n` : ""}${sourceLabel(lead) ? `Source:   ${sourceLabel(lead)}\n` : ""}
${lead.message ? `\nMessage:\n${lead.message}\n` : ""}`;

  return {
    subject: `${leadKindLabel[lead.kind]} — ${lead.name}${lead.trade ? `, ${lead.trade}` : ""}${lead.town ? `, ${lead.town}` : ""}${lead.budget ? ` (${lead.budget})` : ""}`,
    html,
    text,
  };
}

/** ref, or utm source/medium/campaign, or the external referrer. */
function sourceLabel(lead: LeadInput): string | null {
  if (lead.ref) return `ref=${lead.ref}`;
  const utm = [lead.utmSource, lead.utmMedium, lead.utmCampaign]
    .filter(Boolean)
    .join(" / ");
  if (utm) return utm;
  return lead.referrer || null;
}

/* ────────────────────────────────────────────────────────────
   To the client: portal access
   ──────────────────────────────────────────────────────────── */

export function portalInvite(
  contactName: string,
  joinCode: string,
): { subject: string; html: string; text: string } {
  const name = firstName(contactName);

  const body = [
    p(`Hi ${name},`),
    p(
      `I've set up an account for you so you can check on your website whenever you like — no need to email me and wait for a reply.`,
    ),
    p(`You'll be able to see:`),
    `<ul style="margin:0 0 20px;padding-left:20px;font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.8;color:${BRAND.ink};">
       <li>Exactly where your build has got to</li>
       <li>Anything I'm waiting on from you</li>
       <li>Your invoices, with the bank details on them</li>
       <li>A place to send me notes about the site</li>
     </ul>`,
    `<p style="margin:24px 0 8px;font-family:Helvetica,Arial,sans-serif;font-size:13px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:${BRAND.muted};">Your code</p>`,
    // The code is the whole point of the email, so it is set large and
    // monospaced — this gets read off a phone screen and typed into a form.
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 24px;">
       <tr>
         <td align="center" style="border:2px solid ${BRAND.navy};padding:20px;">
           <span style="font-family:'Courier New',Courier,monospace;font-size:28px;font-weight:bold;letter-spacing:3px;color:${BRAND.navy};">${esc(joinCode)}</span>
         </td>
       </tr>
     </table>`,
    callout(
      `<strong style="color:${BRAND.navy};">No password, no email to wait for.</strong><br>
       Type that code in and you're straight through. Keep this email — the same code works every time.`,
    ),
    button(`${site.url}/portal`, "Sign in with your code"),
    p(
      `<span style="font-size:14px;color:${BRAND.muted};">Lost it? Just reply and I'll send a new one.</span>`,
    ),
  ].join("");

  const html = emailLayout({
    heading: "Your project portal is ready",
    preheader: "Check your build, invoices and messages any time — no password needed.",
    body,
  });

  const text = `Your project portal is ready

Hi ${name},

I've set up an account so you can check on your website whenever you like.

You'll be able to see where your build has got to, anything I'm waiting on
from you, your invoices with bank details, and a place to send me notes.

YOUR CODE:  ${joinCode}

No password, no email to wait for — type that code in and you're straight
through. Keep this email; the same code works every time.

Sign in: ${site.url}/portal

Lost it? Just reply and I'll send a new one.${plainTextFooter()}`;

  return { subject: "Your project portal is ready", html, text };
}

/* ────────────────────────────────────────────────────────────
   To the client: an invoice
   ──────────────────────────────────────────────────────────── */

export function invoiceEmail({
  contactName,
  invoiceNumber,
  total,
  dueOn,
  paymentRef,
  bank,
}: {
  contactName: string;
  invoiceNumber: string;
  total: string;
  dueOn: string;
  paymentRef: string | null;
  bank: {
    accountName: string | null;
    sortCode: string | null;
    accountNo: string | null;
  };
}): { subject: string; html: string; text: string } {
  const name = firstName(contactName);

  const body = [
    p(`Hi ${name},`),
    p(`Here's invoice <strong>${esc(invoiceNumber)}</strong> for the work on your website.`),
    detailTable(
      detailRow("Invoice", invoiceNumber) +
        detailRow("Amount due", total) +
        detailRow("Due by", dueOn),
    ),
    `<p style="margin:24px 0 8px;font-family:Helvetica,Arial,sans-serif;font-size:13px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:${BRAND.muted};">Paying by bank transfer</p>`,
    detailTable(
      detailRow("Account name", bank.accountName) +
        detailRow("Sort code", bank.sortCode) +
        detailRow("Account number", bank.accountNo) +
        detailRow("Reference", paymentRef),
    ),
    button(`${site.url}/portal`, "View invoice in your portal"),
    p(
      `<span style="font-size:14px;color:${BRAND.muted};">Any questions about this invoice, just reply and I'll sort it.</span>`,
    ),
  ].join("");

  const html = emailLayout({
    heading: `Invoice ${invoiceNumber}`,
    preheader: `${total} due by ${dueOn}`,
    body,
  });

  const text = `Invoice ${invoiceNumber}

Hi ${name},

Here's invoice ${invoiceNumber} for the work on your website.

Amount due: ${total}
Due by:     ${dueOn}

Paying by bank transfer:
  Account name:   ${bank.accountName ?? "—"}
  Sort code:      ${bank.sortCode ?? "—"}
  Account number: ${bank.accountNo ?? "—"}
${paymentRef ? `  Reference:      ${paymentRef}\n` : ""}
View it in your portal: ${site.url}/portal

Any questions, just reply.${plainTextFooter()}`;

  return {
    subject: `Invoice ${invoiceNumber} — ${total}`,
    html,
    text,
  };
}

/* ────────────────────────────────────────────────────────────
   To the enquirer: a call confirmed
   ──────────────────────────────────────────────────────────── */

/**
 * Confirms an arranged call. Sent from the lead page in the admin with a
 * calendar file attached, so the time is in their diary without retyping.
 *
 * Says plainly who calls whom: a phone or WhatsApp call is outgoing from
 * Shan, so they only need to answer; a Zoom call needs them to click the
 * link, which is the one thing they have to do.
 */
export function callConfirmation({
  name,
  method,
  when,
  minutes,
  zoomLink,
  phone,
  note,
  calendarHref,
}: {
  name: string;
  method: string;
  when: string;
  minutes: number;
  zoomLink: string | null;
  phone: string | null;
  note: string | null;
  calendarHref: string;
}): { subject: string; html: string; text: string } {
  const first = firstName(name);
  const isZoom = method === "Zoom video call";
  const isWhatsApp = method === "WhatsApp call";

  const how = isZoom
    ? "Join with the link below. It opens in your browser; you don't need a Zoom account."
    : isWhatsApp
      ? `I'll call you on WhatsApp${phone ? ` at ${phone}` : ""}. Nothing to set up — just answer.`
      : `I'll ring you${phone ? ` on ${phone}` : ""}. Nothing to set up — just answer.`;

  const body = [
    p(`Hi ${esc(first)},`),
    p(`Thanks for asking for a call. Here's when we'll talk:`),
    detailTable(
      detailRow("When", `${when} (UK time)`) +
        detailRow("How", method) +
        detailRow("Length", `About ${minutes} minutes`),
    ),
    p(esc(how)),
    isZoom && zoomLink ? button(zoomLink, "Join the Zoom call") : "",
    note ? callout(escMultiline(note)) : "",
    p(
      `It's in the attached calendar file, or you can <a href="${esc(calendarHref)}" style="color:${BRAND.navy};">add it to Google Calendar</a>. If the time no longer works, just reply to this email and we'll move it.`,
    ),
  ].join("");

  const html = emailLayout({
    heading: "Your call is booked",
    preheader: `${method}, ${when} UK time.`,
    body,
  });

  const text = `Hi ${first},

Thanks for asking for a call. Here's when we'll talk:

When:   ${when} (UK time)
How:    ${method}
Length: About ${minutes} minutes

${how}
${isZoom && zoomLink ? `\nJoin: ${zoomLink}\n` : ""}${note ? `\n${note}\n` : ""}
It's in the attached calendar file, or add it to Google Calendar:
${calendarHref}

If the time no longer works, just reply to this email and we'll move it.${plainTextFooter()}`;

  return {
    subject: `Your call with Shan: ${when}`,
    html,
    text,
  };
}
