import { NextResponse, type NextRequest } from "next/server";
import { sessionClient } from "@/lib/db/session";

/**
 * Completes a magic-link sign-in.
 *
 * Supabase sends the client here with a one-time code, which is exchanged for
 * a session and written to cookies. The code is single-use and short-lived,
 * so a forwarded link cannot be replayed.
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const origin = request.nextUrl.origin;

  if (!code) {
    return NextResponse.redirect(`${origin}/portal/login?error=missing`);
  }

  try {
    const supabase = await sessionClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("[portal] code exchange failed:", error.message);
      return NextResponse.redirect(`${origin}/portal/login?error=expired`);
    }
  } catch (err) {
    console.error("[portal] callback threw:", err);
    return NextResponse.redirect(`${origin}/portal/login?error=failed`);
  }

  return NextResponse.redirect(`${origin}/portal`);
}
