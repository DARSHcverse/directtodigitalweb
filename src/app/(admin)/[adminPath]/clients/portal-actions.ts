"use server";

import { revalidatePath } from "next/cache";
import { requireOwner } from "@/lib/admin/auth";
import { serviceClient } from "@/lib/db/server";
import { adminPath } from "@/lib/admin/paths";

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

  await db.from("audit_log").insert({
    actor: owner.email,
    action: "client.portal_enabled",
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
  await db
    .from("clients")
    .update({ portal_enabled: false })
    .eq("id", clientId);

  await db.from("audit_log").insert({
    actor: owner.email,
    action: "client.portal_disabled",
    entity: "clients",
    entity_id: clientId,
  });

  revalidatePath(adminPath(`clients/${clientId}`));
}
