import { redirect } from "next/navigation";
import { getOwner } from "@/lib/admin/auth";
import { adminPath } from "@/lib/admin/paths";
import { LoginForm } from "@/components/admin/LoginForm";

export default async function LoginPage() {
  // Already signed in — no reason to show the form again.
  if (await getOwner()) redirect(adminPath("leads"));

  return (
    <main className="bg-blueprint flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm border-2 border-navy bg-surface p-8">
        <p className="rule-label mb-3 text-xs font-bold tracking-[0.2em] text-navy uppercase">
          Trade Web Co
        </p>
        <h1 className="mb-6 text-2xl font-bold tracking-display text-navy">
          Sign in
        </h1>
        <LoginForm />
      </div>
    </main>
  );
}
