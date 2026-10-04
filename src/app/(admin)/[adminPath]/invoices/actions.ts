"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ownerForAction, requireOwner } from "@/lib/admin/auth";
import { serviceClient } from "@/lib/db/server";
import { adminPath } from "@/lib/admin/paths";
import { getSettings } from "@/lib/admin/settings";
import { isEmailConfigured, sendEmail } from "@/lib/email/send";
import { invoiceEmail } from "@/lib/email/templates";
import { formatMoney, formatDate } from "@/lib/admin/invoices";

export type InvoiceFormState = { error: string | null };

const lineSchema = z.object({
  description: z.string().trim().min(1).max(300),
  quantity: z.number().min(0).max(10_000),
  unit_price: z.number().min(0).max(1_000_000),
});

const invoiceSchema = z.object({
  client_id: z.uuid("Choose a client"),
  project_id: z.string().trim().optional(),
  notes: z.string().trim().max(2000).optional(),
  payment_ref: z.string().trim().max(80).optional(),
});

/** Lines arrive as parallel arrays from the repeated form fields. */
function readLines(formData: FormData) {
  const descriptions = formData.getAll("line_description").map(String);
  const quantities = formData.getAll("line_quantity").map(String);
  const prices = formData.getAll("line_price").map(String);

  const lines: z.infer<typeof lineSchema>[] = [];
  for (let i = 0; i < descriptions.length; i += 1) {
    const description = (descriptions[i] ?? "").trim();
    if (!description) continue; // blank rows are just unused slots

    const quantity = Number(quantities[i] ?? "1");
    const unit_price = Number(prices[i] ?? "0");
    if (Number.isNaN(quantity) || Number.isNaN(unit_price)) continue;

    lines.push({ description, quantity, unit_price });
  }
  return lines;
}

/**
 * Totals are computed server-side and stored on the invoice.
 *
 * Stored rather than derived on read, because an issued invoice must keep the
 * figures it was sent with even if the VAT rate changes later.
 */
function computeTotals(
  lines: z.infer<typeof lineSchema>[],
  vatRegistered: boolean,
  vatRate: number,
) {
  const subtotal = lines.reduce(
    (sum, l) => sum + l.quantity * l.unit_price,
    0,
  );
  const rate = vatRegistered ? vatRate : 0;
  const vat_amount = Math.round(subtotal * rate) / 100;
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    vat_rate: rate,
    vat_amount,
    total: Math.round((subtotal + vat_amount) * 100) / 100,
  };
}

export async function createInvoice(
  _prev: InvoiceFormState,
  formData: FormData,
): Promise<InvoiceFormState> {
  const owner = await ownerForAction();
  if (!owner) return { error: "Your session has expired. Sign in again." };

  const parsed = invoiceSchema.safeParse({
    client_id: formData.get("client_id") ?? "",
    project_id: formData.get("project_id") ?? "",
    notes: formData.get("notes") ?? "",
    payment_ref: formData.get("payment_ref") ?? "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the details." };
  }

  const lines = readLines(formData);
  if (lines.length === 0) {
    return { error: "Add at least one line with a description." };
  }

  const settings = await getSettings();
  const totals = computeTotals(
    lines,
    settings?.vat_registered ?? false,
    Number(settings?.vat_rate ?? 0),
  );

  const db = serviceClient();
  const { data, error } = await db
    .from("invoices")
    .insert({
      client_id: parsed.data.client_id,
      project_id: parsed.data.project_id || null,
      notes: parsed.data.notes || null,
      payment_ref: parsed.data.payment_ref || null,
      status: "draft",
      ...totals,
    })
    .select("id")
    .single();

  if (error) return { error: "Could not create that invoice. Try again." };

  const invoiceId = data.id as string;

  const { error: lineError } = await db.from("invoice_lines").insert(
    lines.map((l, i) => ({ ...l, invoice_id: invoiceId, position: i })),
  );

  if (lineError) {
    // An invoice with no lines is useless, so do not leave one behind.
    await db.from("invoices").delete().eq("id", invoiceId);
    return { error: "Could not save the invoice lines. Try again." };
  }

  await db.from("audit_log").insert({
    actor: owner.email,
    action: "invoice.created",
    entity: "invoices",
    entity_id: invoiceId,
  });

  redirect(adminPath(`invoices/${invoiceId}`));
}

export async function updateDraft(
  _prev: InvoiceFormState,
  formData: FormData,
): Promise<InvoiceFormState> {
  const owner = await ownerForAction();
  if (!owner) return { error: "Your session has expired. Sign in again." };

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing invoice." };

  const db = serviceClient();
  const { data: existing } = await db
    .from("invoices")
    .select("status")
    .eq("id", id)
    .maybeSingle();

  // An issued invoice is a document the client already holds. Corrections go
  // out as a credit note, never as a silent edit.
  if (!existing || existing.status !== "draft") {
    return { error: "Only draft invoices can be edited." };
  }

  const parsed = invoiceSchema.safeParse({
    client_id: formData.get("client_id") ?? "",
    project_id: formData.get("project_id") ?? "",
    notes: formData.get("notes") ?? "",
    payment_ref: formData.get("payment_ref") ?? "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the details." };
  }

  const lines = readLines(formData);
  if (lines.length === 0) {
    return { error: "Add at least one line with a description." };
  }

  const settings = await getSettings();
  const totals = computeTotals(
    lines,
    settings?.vat_registered ?? false,
    Number(settings?.vat_rate ?? 0),
  );

  const { error } = await db
    .from("invoices")
    .update({
      client_id: parsed.data.client_id,
      project_id: parsed.data.project_id || null,
      notes: parsed.data.notes || null,
      payment_ref: parsed.data.payment_ref || null,
      ...totals,
    })
    .eq("id", id);

  if (error) return { error: "Could not save those changes." };

  // Replace the lines wholesale — simpler and safer than diffing rows.
  await db.from("invoice_lines").delete().eq("invoice_id", id);
  await db
    .from("invoice_lines")
    .insert(lines.map((l, i) => ({ ...l, invoice_id: id, position: i })));

  await db.from("audit_log").insert({
    actor: owner.email,
    action: "invoice.updated",
    entity: "invoices",
    entity_id: id,
  });

  revalidatePath(adminPath(`invoices/${id}`));
  return { error: null };
}

/**
 * Issues the invoice, assigning its number.
 *
 * The number comes from issue_invoice() in the database, which locks a
 * counter row so concurrent issues cannot skip or reuse a number. A Postgres
 * sequence would not do: sequences deliberately leave gaps on rollback, and
 * HMRC expects an unbroken run.
 */
export async function issueInvoice(formData: FormData) {
  const owner = await requireOwner();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const db = serviceClient();
  const { error } = await db.rpc("issue_invoice", { p_invoice_id: id });

  if (error) {
    console.error("[admin] issue_invoice failed:", error.message);
    return;
  }

  await db.from("audit_log").insert({
    actor: owner.email,
    action: "invoice.issued",
    entity: "invoices",
    entity_id: id,
  });

  // Email it to the client. Best-effort: the invoice is issued and numbered
  // either way, and it is also visible in their portal.
  await emailInvoice(id, owner.email);

  revalidatePath(adminPath(`invoices/${id}`));
  revalidatePath(adminPath("invoices"));
}

/**
 * Emails an issued invoice to its client and records that it went.
 *
 * Shared by issuing and by the Send button, so there is one code path and a
 * resend is identical to the original. Returns a reason on failure rather
 * than throwing: issuing must not roll back because an email bounced, and the
 * caller decides whether the failure is worth surfacing.
 */
async function emailInvoice(
  id: string,
  actor: string,
): Promise<{ ok: true; to: string } | { ok: false; reason: string }> {
  const db = serviceClient();

  const { data: issued } = await db
    .from("invoices")
    .select(
      "invoice_number, total, due_on, payment_ref, client:clients(contact_name, email)",
    )
    .eq("id", id)
    .maybeSingle();

  const client = issued?.client as
    | { contact_name: string; email: string }
    | null
    | undefined;

  if (!issued?.invoice_number) {
    return { ok: false, reason: "A draft has no number yet — issue it first." };
  }
  if (!client?.email) {
    return { ok: false, reason: "This client has no email address." };
  }
  if (!isEmailConfigured()) {
    return { ok: false, reason: "Email is not configured on the server." };
  }

  const settings = await getSettings();
  const mail = invoiceEmail({
    contactName: client.contact_name,
    invoiceNumber: issued.invoice_number as string,
    total: formatMoney(issued.total as number),
    dueOn: formatDate(issued.due_on as string | null),
    paymentRef: (issued.payment_ref as string | null) ?? null,
    bank: {
      accountName: settings?.bank_account_name ?? null,
      sortCode: settings?.bank_sort_code ?? null,
      accountNo: settings?.bank_account_no ?? null,
    },
  });

  const sent = await sendEmail({
    to: client.email,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
  });

  if (!sent.ok) {
    return {
      ok: false,
      reason: `The email provider rejected it: ${sent.error}`,
    };
  }

  await db
    .from("invoices")
    .update({ sent_at: new Date().toISOString(), sent_to: client.email })
    .eq("id", id);

  await db.from("audit_log").insert({
    actor,
    action: "invoice.sent",
    entity: "invoices",
    entity_id: id,
    detail: { to: client.email },
  });

  return { ok: true, to: client.email };
}

/**
 * Sends, or re-sends, an issued invoice.
 *
 * Issuing already emails it, but silently and only once. A client who deleted
 * the email, or whose address was wrong at the time, previously had no route
 * to a copy — and re-issuing is impossible once a number is assigned.
 */
export async function sendInvoice(formData: FormData) {
  const owner = await requireOwner();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const result = await emailInvoice(id, owner.email);

  revalidatePath(adminPath(`invoices/${id}`));

  if (!result.ok) {
    redirect(`${adminPath(`invoices/${id}`)}?send=failed`);
  }
  redirect(`${adminPath(`invoices/${id}`)}?send=ok`);
}

export async function markPaid(formData: FormData) {
  const owner = await requireOwner();
  const id = String(formData.get("id") ?? "");
  const undo = String(formData.get("undo") ?? "") === "1";
  if (!id) return;

  const db = serviceClient();
  await db
    .from("invoices")
    .update(
      undo
        ? { status: "issued", paid_on: null }
        : { status: "paid", paid_on: new Date().toISOString().slice(0, 10) },
    )
    .eq("id", id);

  await db.from("audit_log").insert({
    actor: owner.email,
    action: undo ? "invoice.unpaid" : "invoice.paid",
    entity: "invoices",
    entity_id: id,
  });

  revalidatePath(adminPath(`invoices/${id}`));
  revalidatePath(adminPath("invoices"));
}

export async function cancelInvoice(formData: FormData) {
  const owner = await requireOwner();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const db = serviceClient();
  const { data: existing } = await db
    .from("invoices")
    .select("status")
    .eq("id", id)
    .maybeSingle();

  if (!existing) return;

  // A draft was never sent, so it can simply be removed. An issued invoice
  // is cancelled in place, keeping its number in the sequence.
  if (existing.status === "draft") {
    await db
      .from("invoices")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);
  } else {
    await db.from("invoices").update({ status: "cancelled" }).eq("id", id);
  }

  await db.from("audit_log").insert({
    actor: owner.email,
    action: "invoice.cancelled",
    entity: "invoices",
    entity_id: id,
  });

  redirect(adminPath("invoices"));
}
