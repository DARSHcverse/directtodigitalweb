import { requireOwner } from "@/lib/admin/auth";
import { getSettings, missingForInvoicing } from "@/lib/admin/settings";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function SettingsPage() {
  const owner = await requireOwner();
  const settings = await getSettings();
  const missing = missingForInvoicing(settings);

  return (
    <div className="min-h-screen">
      <AdminHeader email={owner.email} current="settings" />

      <main className="mx-auto w-[94%] max-w-[900px] py-8">
        <h1 className="mb-1 text-3xl font-bold tracking-display text-navy-text">
          Business settings
        </h1>
        <p className="mb-8 text-muted">
          These details appear on every invoice you send.
        </p>

        {missing.length > 0 ? (
          <div className="mb-6 border-l-4 border-amber bg-surface p-5">
            <p className="font-bold text-navy-text">Still needed</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              Invoices cannot be issued until you add {missing.join(", ")}.
            </p>
          </div>
        ) : null}

        {settings ? (
          <div className="border-2 border-edge rounded-lg bg-surface p-6">
            <SettingsForm settings={settings} />
          </div>
        ) : (
          <div className="border-2 border-edge rounded-lg bg-surface p-8 text-center">
            <p className="font-bold text-navy-text">Settings row missing</p>
            <p className="mt-2 text-sm text-muted">
              The business_settings table should contain exactly one row. Re-run
              the migrations if this persists.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
