"use server";

import { revalidatePath } from "next/cache";
import { requireOwner } from "@/lib/admin/auth";
import { serviceClient } from "@/lib/db/server";
import { adminPath } from "@/lib/admin/paths";
import { sendEmail } from "@/lib/email/send";
import { portalInvite } from "@/lib/email/templates";
import { generateJoinCode } from "@/lib/portal/join-code";

/**
 * Grants a client access to the portal.
 *
 * Creates (or reuses) a Supabase auth user for their email and links it to
 * the client row. Access is then enforced by RLS through
 * clients.auth_user_id, so a client can only ever read their own records —
 * the check lives in the database rather than in page code.
 *
 * Sign-in is by emailed link. No password is set, stored or reset, which
 * removes a whole class of support and security problems for accounts that
 * are used occasionally.
 */
export async function enablePortal(formData: FormData) {
  const owner = await requireOwner();
  const clientId = String(formData.get("id") ?? "");
  if (!clientId) return;

  const db = serviceClient();

  const { data: client } = await db
    .from("clients")
    .select("id, email, auth_user_id")
    .eq("id", clientId)
    .is("deleted_at", null)
    .maybeSingle();

  if (!client) return;

  let userId = client.auth_user_id as string | null;

  if (!userId) {
    const { data: created, error } = await db.auth.admin.createUser({
      email: client.email as string,
      email_confirm: true,
    });

    if (error) {
      // Most likely the address already has an account, from a previous
      // invite or another project. Find it rather than failing.
      const { data: list } = await db.auth.admin.listUsers();
      userId =
        list?.users?.find((u) => u.email === client.email)?.id ?? null;
      if (!userId) {
        console.error("[admin] portal invite failed:", error.message);
        return;
      }
    } else {
      userId = created.user?.id ?? null;
    }
  }

  if (!userId) return;

  await db
    .from("clients")
    .update({ auth_user_id: userId, portal_enabled: true })
    .eq("id", clientId);

  // Issue a join code at the same time. The plain code is shown to the owner
  // once here and emailed to the client; only its hash is stored.
  const code = generateJoinCode();
  await db.rpc("set_join_code", { p_client_id: clientId, p_code: code });

  const { data: full } = await db
    .from("clients")
    .select("contact_name, email")
    .eq("id", clientId)
    .maybeSingle();

  if (full) {
    const invite = portalInvite(full.contact_name as string, code);
    await sendEmail({
      to: full.email as string,
      subject: invite.subject,
      html: invite.html,
      text: invite.text,
    });
  }

  await db.from("audit_log").insert({
    actor: owner.email,
    action: "client.portal_enabled",
    entity: "clients",
    entity_id: clientId,
  });

  revalidatePath(adminPath(`clients/${clientId}`));
}

/**
 * Issues a fresh code, replacing any previous one.
 *
 * Used when a client loses theirs, or when access should be rotated — the
 * old code stops working the moment this runs.
 */
export async function resendJoinCode(formData: FormData) {
  const owner = await requireOwner();
  const clientId = String(formData.get("id") ?? "");
  if (!clientId) return;

  const db = serviceClient();
  const { data: client } = await db
    .from("clients")
    .select("contact_name, email, portal_enabled")
    .eq("id", clientId)
    .is("deleted_at", null)
    .maybeSingle();

  if (!client?.portal_enabled) return;

  const code = generateJoinCode();
  await db.rpc("set_join_code", { p_client_id: clientId, p_code: code });

  const invite = portalInvite(client.contact_name as string, code);
  await sendEmail({
    to: client.email as string,
    subject: invite.subject,
    html: invite.html,
    text: invite.text,
  });

  await db.from("audit_log").insert({
    actor: owner.email,
    action: "client.join_code_reissued",
    entity: "clients",
    entity_id: clientId,
  });

  revalidatePath(adminPath(`clients/${clientId}`));
}

export async function disablePortal(formData: FormData) {
  const owner = await requireOwner();
  const clientId = String(formData.get("id") ?? "");
  if (!clientId) return;

  const db = serviceClient();

  // The auth user is kept so access can be restored without a new invite;
  // the flag alone controls whether current_client_id() resolves.
  // Clear the code too: leaving it would let a revoked client sign in again
  // the moment access was restored, without a new invitation.
  await db
    .from("clients")
    .update({ portal_enabled: false, join_code_hash: null })
    .eq("id", clientId);

  await db.from("audit_log").insert({
    actor: owner.email,
    action: "client.portal_disabled",
    entity: "clients",
    entity_id: clientId,
  });

  revalidatePath(adminPath(`clients/${clientId}`));
}
