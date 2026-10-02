import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOwner } from "@/lib/admin/auth";
import { adminPath } from "@/lib/admin/paths";
import { getClient } from "@/lib/admin/clients";
import { archiveClient } from "@/app/(admin)/[adminPath]/clients/actions";
import {
  enablePortal,
  disablePortal,
  resendJoinCode,
} from "@/app/(admin)/[adminPath]/clients/portal-actions";
import { site } from "@/lib/site";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ClientForm } from "@/components/admin/ClientForm";

function date(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const owner = await requireOwner();
  const { id } = await params;

  const result = await getClient(id);
  if (!result) notFound();

  const { client, projects, leads } = result;

  return (
    <div className="min-h-screen">
      <AdminHeader email={owner.email} current="clients" />

      <main className="mx-auto w-[94%] max-w-[1100px] py-8">
        <Link
          href={adminPath("clients")}
          className="text-sm font-semibold text-muted no-underline hover:text-navy"
        >
          ← Clients
        </Link>

        <div className="mt-3 mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-display text-navy">
              {client.business_name}
            </h1>
            <p className="text-muted">
              {client.contact_name} · Client since {date(client.created_at)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={`mailto:${client.email}`}
              className="border-2 border-navy px-4 py-2.5 text-sm font-bold text-navy no-underline transition hover:bg-navy hover:text-white"
            >
              Email
            </a>
            {client.phone ? (
              <a
                href={`tel:${client.phone.replace(/\s/g, "")}`}
                className="border-2 border-navy px-4 py-2.5 text-sm font-bold text-navy no-underline transition hover:bg-navy hover:text-white"
              >
                Call
              </a>
            ) : null}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <section className="border-2 border-edge bg-surface p-6">
            <h2 className="mb-6 text-xl font-bold text-navy">Details</h2>
            <ClientForm client={client} />
          </section>

          <div className="grid gap-6">
            <section className="border-2 border-edge bg-surface p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-navy">Projects</h2>
                <Link
                  href={`${adminPath("projects/new")}?client=${client.id}`}
                  className="border-2 border-navy px-3 py-1.5 text-sm font-bold text-navy no-underline transition hover:bg-navy hover:text-white"
                >
                  Add
                </Link>
              </div>
              {projects.length === 0 ? (
                <p className="text-sm text-muted">No projects yet.</p>
              ) : (
                <ul className="grid gap-3">
                  {projects.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={adminPath(`projects/${p.id}`)}
                        className="block border border-edge p-3 no-underline transition hover:border-navy"
                      >
                        <p className="font-semibold text-navy">{p.title}</p>
                        <p className="text-sm text-muted">{p.stage}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="border-2 border-edge bg-surface p-6">
              <h2 className="mb-4 text-xl font-bold text-navy">
                Original enquiry
              </h2>
              {leads.length === 0 ? (
                <p className="text-sm text-muted">
                  Added directly, not from a lead.
                </p>
              ) : (
                <ul className="grid gap-3">
                  {leads.map((l) => (
                    <li key={l.id} className="border border-edge p-3 text-sm">
                      <p className="font-semibold text-navy">
                        {date(l.created_at)}
                        {l.source_path ? ` · ${l.source_path}` : ""}
                      </p>
                      {l.message ? (
                        <p className="mt-1 whitespace-pre-wrap text-muted">
                          {l.message}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="border-2 border-edge bg-surface p-6">
              <h2 className="mb-2 text-lg font-bold text-navy">
                Client portal
              </h2>
              {client.portal_enabled ? (
                <>
                  <p className="mb-3 text-sm leading-relaxed text-muted">
                    They sign in at{" "}
                    <span className="font-semibold text-navy">
                      {`${site.url}/portal`}
                    </span>{" "}
                    with their join code.
                  </p>
                  <p className="mb-4 text-sm text-muted">
                    {client.join_code_last_used_at
                      ? `Last used ${date(client.join_code_last_used_at)}.`
                      : client.join_code_set_at
                        ? "Code sent, not used yet."
                        : "No code issued — send one below."}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <form action={resendJoinCode}>
                      <input type="hidden" name="id" value={client.id} />
                      <button
                        type="submit"
                        className="bg-amber px-4 py-2 text-sm font-bold text-navy-deep transition hover:bg-amber-deep"
                      >
                        Send a new code
                      </button>
                    </form>
                    <form action={disablePortal}>
                      <input type="hidden" name="id" value={client.id} />
                      <button
                        type="submit"
                        className="border-2 border-edge px-4 py-2 text-sm font-bold text-muted transition hover:border-navy hover:text-navy"
                      >
                        Revoke access
                      </button>
                    </form>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-muted">
                    Sending a new code replaces the old one immediately. The
                    code itself is stored hashed, so it can be reissued but
                    never looked up.
                  </p>
                </>
              ) : (
                <>
                  <p className="mb-4 text-sm leading-relaxed text-muted">
                    Issues a join code and emails it to them. They can then
                    check progress, read invoices, fill in their brief and
                    message you — no password, no sign-in link to wait for.
                  </p>
                  <form action={enablePortal}>
                    <input type="hidden" name="id" value={client.id} />
                    <button
                      type="submit"
                      className="bg-amber px-4 py-2 text-sm font-bold text-navy-deep transition hover:bg-amber-deep"
                    >
                      Give portal access
                    </button>
                  </form>
                </>
              )}
            </section>

            <section className="border-l-4 border-danger bg-surface p-6">
              <h2 className="mb-2 text-lg font-bold text-navy">Archive</h2>
              <p className="mb-4 text-sm leading-relaxed text-muted">
                Hides this client from the list. Nothing is deleted — records
                are kept for six years, as HMRC requires.
              </p>
              <form action={archiveClient}>
                <input type="hidden" name="id" value={client.id} />
                <button
                  type="submit"
                  className="border-2 border-danger px-4 py-2 text-sm font-bold text-danger transition hover:bg-danger hover:text-white"
                >
                  Archive client
                </button>
              </form>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
