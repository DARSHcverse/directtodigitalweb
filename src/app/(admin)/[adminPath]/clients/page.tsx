import Link from "next/link";
import { requireOwner } from "@/lib/admin/auth";
import { adminPath } from "@/lib/admin/paths";
import { listClients } from "@/lib/admin/clients";
import { AdminShell } from "@/components/admin/AdminShell";
import { PageHeader } from "@/components/admin/ui";
import { ClientsTable } from "@/components/admin/ClientsTable";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const owner = await requireOwner();
  const { q } = await searchParams;
  const clients = await listClients(q);

  return (
    <AdminShell email={owner.email} current="clients">
        <PageHeader
          title="Clients"
          subtitle={`${clients.length} ${clients.length === 1 ? "client" : "clients"}`}
          action={{ href: adminPath("clients/new"), label: "Add client" }}
        />

        <ClientsTable clients={clients} />

      </AdminShell>
  );
}
