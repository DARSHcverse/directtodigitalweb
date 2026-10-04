import { requireOwner } from "@/lib/admin/auth";
import { adminPath } from "@/lib/admin/paths";
import { AdminShell } from "@/components/admin/AdminShell";
import { LeadForm } from "@/components/admin/LeadForm";
import { PageHeader, Panel } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function NewLeadPage() {
  const owner = await requireOwner();

  return (
    <AdminShell email={owner.email} current="leads">
        <PageHeader
          title="Add a lead"
          subtitle="For enquiries that came by phone, in person or word of mouth."
          back={{ href: adminPath("leads"), label: "Leads" }}
        />
        <Panel>
          <LeadForm />
        </Panel>
</AdminShell>
  );
}
