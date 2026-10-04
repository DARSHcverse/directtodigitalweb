import { requireOwner } from "@/lib/admin/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { PasswordForm } from "@/components/admin/PasswordForm";

export default async function AccountPage() {
  const owner = await requireOwner();

  return (
    <AdminShell email={owner.email} current="account">
        <h1 className="mb-1 text-3xl font-bold tracking-display text-navy-text">
          Account
        </h1>
        <p className="mb-8 text-muted">Signed in as {owner.email}</p>

        <section className="border-2 border-edge rounded-lg bg-surface p-6">
          <h2 className="mb-1 text-xl font-bold text-navy-text">Change password</h2>
          <p className="mb-6 text-sm text-muted">
            You will stay signed in on this device.
          </p>
          <PasswordForm />
        </section>

        <section className="mt-6 border-l-4 border-amber bg-surface p-6">
          <h2 className="mb-2 text-lg font-bold text-navy-text">
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
</AdminShell>
  );
}
