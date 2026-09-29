import "server-only";
import { serviceClient } from "@/lib/db/server";
import type { BusinessSettings } from "@/lib/db/types";

/**
 * Business identity and bank details, used on every invoice.
 *
 * Stored rather than hardcoded so trading as a sole trader now and a limited
 * company later is a settings change, not a code change.
 */
export async function getSettings(): Promise<BusinessSettings | null> {
  const { data } = await serviceClient()
    .from("business_settings")
    .select("*")
    .eq("id", true)
    .maybeSingle();

  return (data as BusinessSettings) ?? null;
}

/** Fields an invoice cannot legally go out without. */
export function missingForInvoicing(s: BusinessSettings | null): string[] {
  if (!s) return ["business settings"];
  const missing: string[] = [];
  if (!s.legal_name.trim()) missing.push("your name or trading name");
  if (s.address_lines.length === 0) missing.push("an address");
  if (!s.bank_account_name?.trim()) missing.push("bank account name");
  if (!s.bank_sort_code?.trim()) missing.push("sort code");
  if (!s.bank_account_no?.trim()) missing.push("account number");
  return missing;
}
