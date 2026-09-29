import "server-only";
import { redirect } from "next/navigation";
import { sessionClient } from "@/lib/db/session";
import { serviceClient } from "@/lib/db/server";
import type { Client } from "@/lib/db/types";

/**
 * Resolves the signed-in client, or null.
 *
 * Uses getUser() rather than getSession(): getSession reads the cookie
 * without verifying it, so a forged cookie would pass.
 *
 * The client row is then looked up by auth_user_id with portal_enabled still
 * true, so revoking access takes effect immediately even for a session that
 * is still valid.
 */
export async function getPortalClient(): Promise<Client | null> {
  let userId: string;

  try {
    const supabase = await sessionClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;
    userId = data.user.id;
  } catch (err) {
    console.error("[portal] session lookup failed:", err);
    return null;
  }

  try {
    const { data, error } = await serviceClient()
      .from("clients")
      .select("*")
      .eq("auth_user_id", userId)
      .eq("portal_enabled", true)
      .is("deleted_at", null)
      .maybeSingle();

    if (error) {
      console.error("[portal] client lookup failed:", error.message);
      return null;
    }
    return (data as Client) ?? null;
  } catch (err) {
    console.error(
      "[portal] client lookup threw — is SUPABASE_SECRET_KEY set on this host?",
      err,
    );
    return null;
  }
}

/** Guard for portal pages. */
export async function requirePortalClient(): Promise<Client> {
  const client = await getPortalClient();
  if (!client) redirect("/portal/login");
  return client;
}

/** Guard for portal server actions — returns null instead of redirecting,
 *  so useActionState can surface a real message. */
export async function portalClientForAction(): Promise<Client | null> {
  return getPortalClient();
}
