"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { sessionClient } from "@/lib/db/session";
import { serviceClient } from "@/lib/db/server";
import { normaliseJoinCode } from "@/lib/portal/join-code";

export type LoginState = { error: string | null };

/** Failures tolerated from one source in 15 minutes before refusing. */
const MAX_FAILURES = 8;

async function sourceHash(): Promise<string> {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  // Hashed, not stored raw: enough to throttle abuse without keeping an
  // identifier for everyone who mistypes their code.
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

/**
 * Signs a client in with their join code.
 *
 * Replaces magic links. A code can be read over the phone, kept on an
 * invoice, and used immediately — no waiting on an inbox, and nothing that
 * expires while the client is still reading the email.
 *
 * The code is never compared in application code: verify_join_code() does a
 * bcrypt comparison inside the database, so the hash never leaves it.
 */
export async function signInWithCode(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const raw = String(formData.get("code") ?? "");
  const code = normaliseJoinCode(raw);

  const db = serviceClient();
  const ipHash = await sourceHash();

  // Throttle before doing any work, so guessing costs the attacker time.
  const { data: failures } = await db.rpc("recent_join_failures", {
    p_ip_hash: ipHash,
  });

  if ((failures ?? 0) >= MAX_FAILURES) {
    return {
      error: "Too many attempts. Please wait 15 minutes and try again.",
    };
  }

  if (!code) {
    await db.from("join_code_attempts").insert({ ip_hash: ipHash });
    return { error: "That code doesn't look right. It looks like TWC-XXXX-XXXX." };
  }

  const { data: clientId } = await db.rpc("verify_join_code", {
    p_code: code,
  });

  if (!clientId) {
    await db.from("join_code_attempts").insert({ ip_hash: ipHash });
    // Deliberately vague: saying whether a code exists would let someone
    // confirm guesses one at a time.
    return { error: "That code was not recognised. Check it and try again." };
  }

  const { data: client } = await db
    .from("clients")
    .select("id, email, auth_user_id, business_name")
    .eq("id", clientId)
    .maybeSingle();

  if (!client?.auth_user_id) {
    await db.from("join_code_attempts").insert({ ip_hash: ipHash });
    return { error: "That code was not recognised. Check it and try again." };
  }

  // The code proves who they are; a one-time link turns that into a session
  // without the client ever seeing an email.
  const { data: link, error: linkError } = await db.auth.admin.generateLink({
    type: "magiclink",
    email: client.email as string,
  });

  if (linkError || !link.properties?.hashed_token) {
    console.error("[portal] could not create session:", linkError?.message);
    return { error: "Could not sign you in just now. Please try again." };
  }

  const supabase = await sessionClient();
  const { error: verifyError } = await supabase.auth.verifyOtp({
    token_hash: link.properties.hashed_token,
    type: "magiclink",
  });

  if (verifyError) {
    console.error("[portal] session exchange failed:", verifyError.message);
    return { error: "Could not sign you in just now. Please try again." };
  }

  await db.from("join_code_attempts").insert({
    ip_hash: ipHash,
    succeeded: true,
  });

  await db
    .from("clients")
    .update({ join_code_last_used_at: new Date().toISOString() })
    .eq("id", client.id);

  redirect("/portal");
}

export async function portalSignOut() {
  const supabase = await sessionClient();
  await supabase.auth.signOut();
  redirect("/portal/login");
}
