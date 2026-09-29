"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ownerForAction } from "@/lib/admin/auth";
import { serviceClient } from "@/lib/db/server";
import { adminPath } from "@/lib/admin/paths";

export type SettingsState = { error: string | null; success: string | null };

const schema = z.object({
  trading_name: z.string().trim().min(1, "Trading name is required").max(120),
  legal_name: z.string().trim().max(120),
  company_number: z.string().trim().max(40).optional(),
  address: z.string().trim().max(500),
  email: z.string().trim().max(200),
  phone: z.string().trim().max(40).optional(),
  vat_registered: z.boolean(),
  vat_number: z.string().trim().max(40).optional(),
  vat_rate: z.string().trim().optional(),
  bank_account_name: z.string().trim().max(120).optional(),
  bank_sort_code: z.string().trim().max(20).optional(),
  bank_account_no: z.string().trim().max(20).optional(),
  payment_terms_days: z.string().trim().optional(),
  invoice_prefix: z.string().trim().max(10),
  invoice_footer: z.string().trim().max(500).optional(),
});

export async function saveSettings(
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const owner = await ownerForAction();
  if (!owner) {
    return { error: "Your session has expired. Sign in again.", success: null };
  }

  const parsed = schema.safeParse({
    trading_name: formData.get("trading_name") ?? "",
    legal_name: formData.get("legal_name") ?? "",
    company_number: formData.get("company_number") ?? "",
    address: formData.get("address") ?? "",
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
    vat_registered: formData.get("vat_registered") === "on",
    vat_number: formData.get("vat_number") ?? "",
    vat_rate: formData.get("vat_rate") ?? "",
    bank_account_name: formData.get("bank_account_name") ?? "",
    bank_sort_code: formData.get("bank_sort_code") ?? "",
    bank_account_no: formData.get("bank_account_no") ?? "",
    payment_terms_days: formData.get("payment_terms_days") ?? "",
    invoice_prefix: formData.get("invoice_prefix") ?? "",
    invoice_footer: formData.get("invoice_footer") ?? "",
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Check the details.",
      success: null,
    };
  }

  const d = parsed.data;

  if (d.vat_registered && !d.vat_number?.trim()) {
    return {
      error: "A VAT number is required when registered for VAT.",
      success: null,
    };
  }

  const { error } = await serviceClient()
    .from("business_settings")
    .update({
      trading_name: d.trading_name,
      // Falls back to the trading name so an invoice always carries a name.
      legal_name: d.legal_name || d.trading_name,
      company_number: d.company_number || null,
      address_lines: d.address
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .slice(0, 6),
      email: d.email,
      phone: d.phone || null,
      vat_registered: d.vat_registered,
      vat_number: d.vat_number || null,
      vat_rate: d.vat_rate ? Number(d.vat_rate) : 20,
      bank_account_name: d.bank_account_name || null,
      bank_sort_code: d.bank_sort_code || null,
      bank_account_no: d.bank_account_no || null,
      payment_terms_days: d.payment_terms_days
        ? Number(d.payment_terms_days)
        : 14,
      invoice_prefix: d.invoice_prefix || "TWC-",
      invoice_footer: d.invoice_footer || null,
    })
    .eq("id", true);

  if (error) return { error: "Could not save those settings.", success: null };

  await serviceClient().from("audit_log").insert({
    actor: owner.email,
    action: "settings.updated",
    entity: "business_settings",
  });

  revalidatePath(adminPath("settings"));
  return { error: null, success: "Settings saved." };
}
