import "server-only";
import { redirect } from "next/navigation";
import { sessionClient } from "@/lib/db/session";
import { serviceClient } from "@/lib/db/server";
import { adminPath } from "@/lib/admin/paths";

export type Owner = { id: string; email: string };

/**
 * Resolves the signed-in owner, or null.
 *
 * Uses getUser() rather than getSession(): getSession reads the cookie
 * without verifying it, so a forged cookie would pass. getUser validates
 * against the auth server.
 *
 * Owner status is then confirmed against owner_accounts, because a valid
 * session only proves someone signed in — not that they are the owner.
 */
export async function getOwner(): Promise<Owner | null> {
  let userId: string | null = null;
  let email: string | null = null;

  try {
    const supabase = await sessionClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;
    userId = data.user.id;
    email = data.user.email ?? null;
  } catch {
    // Supabase not configured — treat as signed out rather than crashing.
    return null;
  }

  try {
    const { data, error } = await serviceClient()
      .from("owner_accounts")
      .select("user_id, email")
      .eq("user_id", userId)
      .maybeSingle();

    if (error || !data) return null;
    return {
      id: data.user_id as string,
      email: (data.email as string) ?? email ?? "",
    };
  } catch {
    return null;
  }
}

/** Guard for every admin page. Redirects to the login screen when absent. */
export async function requireOwner(): Promise<Owner> {
  const owner = await getOwner();
  if (!owner) redirect(adminPath("login"));
  return owner;
}
