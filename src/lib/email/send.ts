import "server-only";
import { Resend } from "resend";
import { site } from "@/lib/site";

/**
 * Single place every outbound email goes through.
 *
 * Keeps the from address, reply-to and error handling consistent, and means
 * a missing API key is reported the same way everywhere rather than throwing
 * from whichever feature happened to send first.
 */

export type SendResult = { ok: boolean; error?: string };

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    console.error("[email] RESEND_API_KEY or RESEND_FROM_EMAIL is not set");
    return { ok: false, error: "not_configured" };
  }

  try {
    const { error } = await new Resend(apiKey).emails.send({
      // "Shan at Trade Web Co" is how he introduces himself, and a human name
      // in the sender is more likely to be opened than a bare business name.
      from: `Shan at ${site.name} <${from}>`,
      to: [to],
      subject,
      html,
      // Sending both parts improves deliverability and serves text-only
      // clients; HTML-only mail is treated as more spam-like.
      text,
      // Default replies to the mailbox that is actually read. The sending
      // domain is verified for sending only, so without this a client hitting
      // reply would write to an address with no inbox behind it.
      replyTo: replyTo ?? site.contactEmail,
    });

    if (error) {
      console.error("[email] send failed:", error.message);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    console.error("[email] send threw:", err);
    return { ok: false, error: "threw" };
  }
}
