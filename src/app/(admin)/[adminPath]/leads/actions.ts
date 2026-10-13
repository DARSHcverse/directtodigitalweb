"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ownerForAction, requireOwner } from "@/lib/admin/auth";
import { serviceClient } from "@/lib/db/server";
import { adminPath } from "@/lib/admin/paths";
import type { LeadStatus } from "@/lib/db/types";
import { CALL_METHODS } from "@/lib/lead";
import { site } from "@/lib/site";
import { isEmailConfigured, sendEmail } from "@/lib/email/send";
import { callConfirmation } from "@/lib/email/templates";
import {
  buildIcs,
  formatUkDateTime,
  googleCalendarHref,
  londonToUtc,
} from "@/lib/calendar";

const VALID: LeadStatus[] = ["new", "contacted", "quoted", "won", "lost"];

export type LeadFormState = { error: string | null };

const leadSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.email("Enter a valid email address").max(200),
  phone: z.string().trim().max(40).optional(),
  topic: z.string().trim().max(80).optional(),
  budget: z.string().trim().max(80).optional(),
  timeline: z.string().trim().max(80).optional(),
  message: z.string().trim().max(5000).optional(),
});

/**
 * Adds a lead by hand.
 *
 * Enquiries that arrive by phone or in person were previously impossible to
 * record — the only way into the pipeline was the website form.
 */
export async function createLead(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const owner = await ownerForAction();
  if (!owner) return { error: "Your session has expired. Sign in again." };

  const parsed = leadSchema.safeParse({
    name: formData.get("name") ?? "",
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
    topic: formData.get("topic") ?? "",
    budget: formData.get("budget") ?? "",
    timeline: formData.get("timeline") ?? "",
    message: formData.get("message") ?? "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the details." };
  }

  const d = parsed.data;
  const db = serviceClient();
  const { data, error } = await db
    .from("leads")
    .insert({
      kind: "contact",
      name: d.name,
      email: d.email,
      phone: d.phone || null,
      topic: d.topic || null,
      budget: d.budget || null,
      timeline: d.timeline || null,
      message: d.message || null,
      source_path: "added by hand",
      status: "new",
    })
    .select("id")
    .single();

  if (error) return { error: "Could not save that lead. Try again." };

  await db.from("audit_log").insert({
    actor: owner.email,
    action: "lead.created",
    entity: "leads",
    entity_id: data.id as string,
  });

  redirect(adminPath("leads"));
}

/**
 * Hides a lead. Spam and mistakes need somewhere to go, but business records
 * are kept for six years, so this is a soft delete like everywhere else.
 */
export async function archiveLead(formData: FormData) {
  const owner = await requireOwner();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const db = serviceClient();
  await db
    .from("leads")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  await db.from("audit_log").insert({
    actor: owner.email,
    action: "lead.archived",
    entity: "leads",
    entity_id: id,
  });

  revalidatePath(adminPath("leads"));
}

export async function updateLeadStatus(formData: FormData) {
  // Every mutation re-checks the session: a server action is a public
  // endpoint, and the page guard does not protect it.
  const owner = await requireOwner();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as LeadStatus;

  if (!id || !VALID.includes(status)) return;

  const db = serviceClient();
  await db.from("leads").update({ status }).eq("id", id);
  await db.from("audit_log").insert({
    actor: owner.email,
    action: "lead.status",
    entity: "leads",
    entity_id: id,
    detail: { status },
  });

  revalidatePath(adminPath(`leads/${id}`));
  revalidatePath(adminPath("leads"));
}

export async function updateLeadNotes(formData: FormData) {
  const owner = await requireOwner();

  const id = String(formData.get("id") ?? "");
  const notes = String(formData.get("notes") ?? "").slice(0, 5000);
  if (!id) return;

  const db = serviceClient();
  await db.from("leads").update({ notes }).eq("id", id);
  await db.from("audit_log").insert({
    actor: owner.email,
    action: "lead.notes",
    entity: "leads",
    entity_id: id,
  });

  revalidatePath(adminPath(`leads/${id}`));
  revalidatePath(adminPath("leads"));
}

/**
 * Permanently deletes a lead.
 *
 * Archiving is the right default for real enquiries — business records are
 * expected to survive — but it leaves test rows in the table forever, and
 * there was no way to clear them.
 *
 * A lead is safe to delete outright: nothing depends on it. The one reference
 * is projects.lead_id, which is `on delete set null`, so a project that came
 * from this lead keeps working and simply forgets where it came from.
 *
 * The audit entry is written before the row goes, and records the name and
 * email, because after this there is nothing left to look up.
 */
export async function deleteLead(formData: FormData) {
  const owner = await requireOwner();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const db = serviceClient();

  const { data: lead } = await db
    .from("leads")
    .select("name, email")
    .eq("id", id)
    .maybeSingle();

  await db.from("audit_log").insert({
    actor: owner.email,
    action: "lead.deleted",
    entity: "leads",
    entity_id: id,
    detail: lead ?? null,
  });

  const { error } = await db.from("leads").delete().eq("id", id);
  if (error) throw new Error(`Could not delete lead: ${error.message}`);

  revalidatePath(adminPath("leads"));
}

export type ArrangeCallState = { error: string | null; sentTo: string | null };

const METHOD_VALUES = CALL_METHODS.map((m) => m.value) as [string, ...string[]];

const arrangeSchema = z
  .object({
    id: z.string().uuid(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date"),
    time: z.string().regex(/^\d{2}:\d{2}$/, "Pick a time"),
    minutes: z.coerce.number().int().min(10).max(120),
    method: z.enum(METHOD_VALUES),
    zoomLink: z.string().trim().max(500).optional().or(z.literal("")),
    note: z.string().trim().max(1000).optional().or(z.literal("")),
  })
  .superRefine((v, ctx) => {
    if (v.method === "Zoom video call") {
      if (!v.zoomLink || !/^https:\/\/\S+$/.test(v.zoomLink)) {
        ctx.addIssue({
          code: "custom",
          path: ["zoomLink"],
          message: "Paste the Zoom meeting link (starting https://)",
        });
      }
    }
  });

/**
 * Confirms a call with an enquirer: emails the time, how it will happen and
 * — for Zoom — the link, with a calendar file attached. Shan is copied in, so
 * the same invite lands in his calendar.
 *
 * The arrangement is recorded on the lead itself: appended to its notes, a
 * new lead moves to "contacted", and the audit log keeps the detail. No
 * schema change was needed for that.
 */
export async function arrangeCall(
  _prev: ArrangeCallState,
  formData: FormData,
): Promise<ArrangeCallState> {
  const owner = await ownerForAction();
  if (!owner) return { error: "Your session has expired. Sign in again.", sentTo: null };

  const parsed = arrangeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the details.", sentTo: null };
  }
  const v = parsed.data;

  const start = londonToUtc(v.date, v.time);
  if (!start) return { error: "That date or time isn't valid.", sentTo: null };
  if (start.getTime() < Date.now()) {
    return { error: "That time has already passed.", sentTo: null };
  }

  const db = serviceClient();
  const { data: lead } = await db
    .from("leads")
    .select("id, name, email, phone, status, notes")
    .eq("id", v.id)
    .is("deleted_at", null)
    .maybeSingle();
  if (!lead) return { error: "That lead no longer exists.", sentTo: null };

  if (v.method !== "Zoom video call" && !lead.phone) {
    return {
      error: "This lead has no phone number. Choose Zoom, or add their number first.",
      sentTo: null,
    };
  }
  if (!isEmailConfigured()) {
    return { error: "Email is not configured on the server.", sentTo: null };
  }

  const when = formatUkDateTime(start);
  const zoomLink = v.method === "Zoom video call" ? v.zoomLink || null : null;
  const location =
    zoomLink ?? `${v.method}${lead.phone ? ` to ${lead.phone}` : ""}`;

  const event = {
    uid: `call-${lead.id}-${start.getTime()}@${new URL(site.url).hostname}`,
    start,
    minutes: v.minutes,
    summary: `Website call with Shan, ${site.name}`,
    description: [
      `${v.method} with Shan from ${site.name}.`,
      zoomLink ? `Join: ${zoomLink}` : `Shan will call you${lead.phone ? ` on ${lead.phone}` : ""}.`,
      v.note || "",
      `Need to move it? Reply to the confirmation email or call ${site.phone.display}.`,
    ]
      .filter(Boolean)
      .join("\n\n"),
    location,
  };

  const mail = callConfirmation({
    name: lead.name,
    method: v.method,
    when,
    minutes: v.minutes,
    zoomLink,
    phone: lead.phone,
    note: v.note || null,
    calendarHref: googleCalendarHref(event),
  });

  const sent = await sendEmail({
    to: lead.email,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
    bcc: process.env.LEAD_INBOX ?? site.contactEmail,
    attachments: [
      {
        filename: "call-with-shan.ics",
        content: buildIcs(event),
        contentType: "text/calendar; charset=utf-8",
      },
    ],
  });
  if (!sent.ok) {
    return { error: `The email didn't send: ${sent.error}`, sentTo: null };
  }

  const record = `Call arranged ${new Date().toLocaleDateString("en-GB")}: ${v.method}, ${when}${
    zoomLink ? ` — ${zoomLink}` : ""
  }`;
  await db
    .from("leads")
    .update({
      notes: lead.notes ? `${lead.notes}\n${record}` : record,
      ...(lead.status === "new" ? { status: "contacted" } : {}),
    })
    .eq("id", lead.id);

  await db.from("audit_log").insert({
    actor: owner.email,
    action: "lead.call_arranged",
    entity: "leads",
    entity_id: lead.id,
    detail: { method: v.method, start: start.toISOString(), minutes: v.minutes },
  });

  revalidatePath(adminPath(`leads/${lead.id}`));
  revalidatePath(adminPath("leads"));
  return { error: null, sentTo: lead.email };
}

/** Delete from the lead's own page, then go back to the list it came from. */
export async function deleteLeadAndReturn(formData: FormData) {
  await deleteLead(formData);
  redirect(adminPath("leads"));
}
