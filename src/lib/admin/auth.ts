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
  } catch (err) {
    // Misconfiguration must not look identical to "not signed in": without a
    // log, a missing env var on the host presents as an endless login loop
    // with no clue why.
    console.error("[admin] session lookup failed:", err);
    return null;
  }

  try {
    const { data, error } = await serviceClient()
      .from("owner_accounts")
      .select("user_id, email")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("[admin] owner lookup failed:", error.message);
      return null;
    }
    if (!data) {
      // Authenticated, but not registered as the owner. Expected for anyone
      // who signed up through Supabase directly.
      console.warn(`[admin] user ${email ?? userId} is not in owner_accounts`);
      return null;
    }
    return {
      id: data.user_id as string,
      email: (data.email as string) ?? email ?? "",
    };
  } catch (err) {
    console.error(
      "[admin] owner lookup threw — is SUPABASE_SECRET_KEY set on this host?",
      err,
    );
    return null;
  }
}

/** Guard for admin PAGES. Redirects to login when there is no owner. */
export async function requireOwner(): Promise<Owner> {
  const owner = await getOwner();
  if (!owner) redirect(adminPath("login"));
  return owner;
}

/**
 * Guard for server ACTIONS that report errors through useActionState.
 *
 * requireOwner() cannot be used there: its redirect() throws NEXT_REDIRECT,
 * which React catches while settling the action state, so the user is sent to
 * the login page even when the real failure was something else entirely.
 * Returning null lets the action surface a proper message instead.
 */
export async function ownerForAction(): Promise<Owner | null> {
  return getOwner();
}
