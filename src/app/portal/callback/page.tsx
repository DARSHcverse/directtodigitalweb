import type { Metadata } from "next";
import { CallbackHandler } from "@/components/portal/CallbackHandler";

export const metadata: Metadata = {
  title: "Signing you in",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Completes a magic-link sign-in.
 *
 * Supabase returns the session in one of two shapes depending on the flow:
 *
 *   PKCE     ?code=...              readable on the server
 *   implicit #access_token=...      fragment, never sent to the server
 *
 * A server route cannot see a fragment at all, so this page runs on the
 * client and handles whichever arrives. Without it, an implicit-flow link
 * silently bounces back to the login screen with no explanation.
 */
export default function PortalCallbackPage() {
  return (
    <main className="bg-blueprint flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm border-2 border-navy bg-surface p-8 text-center">
        <CallbackHandler />
      </div>
    </main>
  );
}
