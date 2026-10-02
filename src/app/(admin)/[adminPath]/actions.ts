"use server";

import { redirect } from "next/navigation";
import { sessionClient } from "@/lib/db/session";
import { adminPath } from "@/lib/admin/paths";

export type SignInState = { error: string | null };

export async function signIn(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await sessionClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Deliberately vague: distinguishing "no such user" from "wrong password"
    // tells an attacker which emails exist.
    return { error: "Those details were not recognised." };
  }

  redirect(adminPath("dashboard"));
}

export async function signOut() {
  const supabase = await sessionClient();
  await supabase.auth.signOut();
  redirect(adminPath("login"));
}
