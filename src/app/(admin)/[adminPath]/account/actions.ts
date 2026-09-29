"use server";

import { requireOwner } from "@/lib/admin/auth";
import { sessionClient } from "@/lib/db/session";
import { serviceClient } from "@/lib/db/server";

export type PasswordState = { error: string | null; success: string | null };

export async function changePassword(
  _prev: PasswordState,
  formData: FormData,
): Promise<PasswordState> {
  const owner = await requireOwner();

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (next.length < 12) {
    return { error: "Use at least 12 characters.", success: null };
  }
  if (next !== confirm) {
    return { error: "The new passwords do not match.", success: null };
  }
  if (next === current) {
    return { error: "That is already your password.", success: null };
  }

  const supabase = await sessionClient();

  // Re-authenticate before changing it. Without this, anyone who reached an
  // unlocked browser could take the account over without knowing the password.
  const { error: reauthError } = await supabase.auth.signInWithPassword({
    email: owner.email,
    password: current,
  });
  if (reauthError) {
    return { error: "Your current password is not correct.", success: null };
  }

  const { error } = await supabase.auth.updateUser({ password: next });
  if (error) {
    return { error: "Could not update the password. Try again.", success: null };
  }

  await serviceClient().from("audit_log").insert({
    actor: owner.email,
    action: "owner.password_changed",
    entity: "owner_accounts",
  });

  return { error: null, success: "Password updated." };
}
