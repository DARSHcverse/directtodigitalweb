"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { sessionClient } from "@/lib/db/session";
import { serviceClient } from "@/lib/db/server";
import { site } from "@/lib/site";

export type LoginState = { error: string | null; sent: boolean };

const emailSchema = z.email();

export async function sendMagicLink(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) {
    return { error: "Enter a valid email address.", sent: false };
  }

  // Only addresses with portal access get a link. Checked with the service
  // role because the caller is not signed in yet.
  const { data: client } = await serviceClient()
    .from("clients")
    .select("id")
    .ilike("email", email)
    .eq("portal_enabled", true)
    .is("deleted_at", null)
    .maybeSingle();

  if (client) {
    const supabase = await sessionClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${site.url}/portal/callback`,
        shouldCreateUser: false,
      },
    });
    if (error) console.error("[portal] magic link failed:", error.message);
  }

  // The same response either way: saying whether an address has access would
  // let anyone test which of their competitors we work with.
  return {
    error: null,
    sent: true,
  };
}

export async function portalSignOut() {
  const supabase = await sessionClient();
  await supabase.auth.signOut();
  redirect("/portal/login");
}
