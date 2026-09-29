import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getPortalClient } from "@/lib/portal/auth";
import { PortalLoginForm } from "@/components/portal/LoginForm";
import { site } from "@/lib/site";

/** Reads the session cookie, so it can never be static. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Client sign in",
  robots: { index: false, follow: false },
};

export default async function PortalLoginPage() {
  if (await getPortalClient()) redirect("/portal");

  return (
    <main className="bg-blueprint flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm border-2 border-navy bg-surface p-8">
        <p className="rule-label mb-3 text-xs font-bold tracking-[0.2em] text-navy uppercase">
          {site.name}
        </p>
        <h1 className="mb-2 text-2xl font-bold tracking-display text-navy">
          Client sign in
        </h1>
        <p className="mb-6 text-sm leading-relaxed text-muted">
          Check your project, see invoices, and send me anything I need.
        </p>
        <PortalLoginForm />
      </div>
    </main>
  );
}
