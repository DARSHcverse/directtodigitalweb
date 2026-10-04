import Link from "next/link";
import { requireOwner } from "@/lib/admin/auth";
import { adminPath } from "@/lib/admin/paths";
import { clientOptions } from "@/lib/admin/projects";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ client?: string }>;
}) {
  const owner = await requireOwner();
  const { client } = await searchParams;
  const clients = await clientOptions();

  return (
    <AdminShell email={owner.email} current="projects">
        <Link
          href={adminPath("projects")}
          className="text-sm font-semibold text-muted no-underline hover:text-navy-text"
        >
          ← Projects
        </Link>

        <h1 className="mt-3 mb-1 text-3xl font-bold tracking-display text-navy-text">
          New project
        </h1>
        <p className="mb-8 text-muted">
          Starts at the brief stage. You can move it along as the build
          progresses.
        </p>

        {clients.length === 0 ? (
          <div className="border-2 border-edge rounded-lg bg-surface p-8 text-center">
            <p className="font-bold text-navy-text">Add a client first</p>
            <p className="mt-2 text-sm text-muted">
              A project has to belong to someone.
            </p>
            <Link
              href={adminPath("clients/new")}
              className="mt-5 inline-block bg-amber rounded-md px-5 py-3 text-sm font-bold text-on-amber no-underline transition hover:bg-amber-deep"
            >
              Add a client
            </Link>
          </div>
        ) : (
          <div className="border-2 border-edge rounded-lg bg-surface p-6">
            <ProjectForm clients={clients} presetClientId={client} />
          </div>
        )}
</AdminShell>
  );
}
