import { requireOwner } from "@/lib/admin/auth";
import { adminPath } from "@/lib/admin/paths";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { LeadForm } from "@/components/admin/LeadForm";
import { PageHeader, Panel } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function NewLeadPage() {
  const owner = await requireOwner();

  return (
    <div className="min-h-screen">
      <AdminHeader email={owner.email} current="leads" />

      <main className="mx-auto w-[94%] max-w-[900px] py-8">
        <PageHeader
          title="Add a lead"
          subtitle="For enquiries that came by phone, in person or word of mouth."
          back={{ href: adminPath("leads"), label: "Leads" }}
        />
        <Panel>
          <LeadForm />
        </Panel>
      </main>
    </div>
  );
}
