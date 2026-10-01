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

  // What happens next matters more than thanking them: the common worry
  // after sending an enquiry is not knowing whether it arrived.
  const body = [
    p(`Thanks for getting in touch — your ${esc(leadKindLabel[lead.kind].toLowerCase())} has arrived safely.`),
    p(
      `I read every enquiry myself, and I'll come back to you <strong>within one working day</strong> with a straight answer. If it's urgent, just reply to this email and it comes directly to me.`,
    ),
    lead.topic || lead.budget || lead.timeline
      ? `<p style="margin:24px 0 8px;font-family:Helvetica,Arial,sans-serif;font-size:13px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:${BRAND.muted};">What you sent</p>` +
        detailTable(
          detailRow("Looking for", lead.topic) +
            detailRow("Budget", lead.budget) +
            detailRow("Timeline", lead.timeline),
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
        detailRow("Email", lead.email) +
        detailRow("Phone", lead.phone) +
        detailRow(
          lead.kind === "booking" ? "Service" : "Project type",
          lead.topic,
        ) +
        detailRow("Budget", lead.budget) +
        detailRow("Timeline", lead.timeline),
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
Email:    ${lead.email}
${lead.phone ? `Phone:    ${lead.phone}\n` : ""}${lead.topic ? `Type:     ${lead.topic}\n` : ""}${lead.budget ? `Budget:   ${lead.budget}\n` : ""}${lead.timeline ? `Timeline: ${lead.timeline}\n` : ""}
${lead.message ? `\nMessage:\n${lead.message}\n` : ""}`;

  return {
    subject: `${leadKindLabel[lead.kind]} — ${lead.name}${lead.budget ? ` (${lead.budget})` : ""}`,
    html,
    text,
  };
}

/* ────────────────────────────────────────────────────────────
   To the client: portal access
   ──────────────────────────────────────────────────────────── */

export function portalInvite(contactName: string): {
  subject: string;
  html: string;
  text: string;
} {
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
    callout(
      `<strong style="color:${BRAND.navy};">There's no password.</strong><br>
       Enter your email and I'll send you a sign-in link each time. Nothing to remember, nothing to forget.`,
    ),
    button(`${site.url}/portal`, "Open your portal"),
    p(
      `<span style="font-size:14px;color:${BRAND.muted};">Use this email address when you sign in. If anything doesn't work, just reply here.</span>`,
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

There's no password — enter your email and I'll send you a sign-in link
each time.

Open your portal: ${site.url}/portal

Use this email address when you sign in. If anything doesn't work, just
reply here.${plainTextFooter()}`;

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
