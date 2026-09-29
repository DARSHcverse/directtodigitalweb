import { requireOwner } from "@/lib/admin/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { PasswordForm } from "@/components/admin/PasswordForm";

export default async function AccountPage() {
  const owner = await requireOwner();

  return (
    <div className="min-h-screen">
      <AdminHeader email={owner.email} current="account" />

      <main className="mx-auto w-[94%] max-w-[1100px] py-8">
        <h1 className="mb-1 text-3xl font-bold tracking-display text-navy">
          Account
        </h1>
        <p className="mb-8 text-muted">Signed in as {owner.email}</p>

        <section className="border-2 border-edge bg-surface p-6">
          <h2 className="mb-1 text-xl font-bold text-navy">Change password</h2>
          <p className="mb-6 text-sm text-muted">
            You will stay signed in on this device.
          </p>
          <PasswordForm />
        </section>

        <section className="mt-6 border-l-4 border-amber bg-surface p-6">
          <h2 className="mb-2 text-lg font-bold text-navy">
            Locked out?
          </h2>
          <p className="text-sm leading-relaxed text-muted">
            There is no email reset, because the admin deliberately has no
            public sign-up or recovery route. Re-run the setup script with the
            same email and a new password to reset it from the command line.
          </p>
          <code className="mt-3 block overflow-x-auto bg-bg p-3 text-xs text-ink">
            node --env-file=.env.local scripts/create-owner.mjs &lt;email&gt; &lt;new-password&gt;
          </code>
        </section>
      </main>
    </div>
  );
}
