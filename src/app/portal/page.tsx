import type { Metadata } from "next";
import Link from "next/link";
import { requirePortalClient } from "@/lib/portal/auth";
import { clientProjects, clientInvoices } from "@/lib/portal/data";
import { STAGE_LABEL } from "@/lib/admin/projects";
import { formatMoney, formatDate, isOverdue } from "@/lib/admin/invoices";
import { PortalHeader } from "@/components/portal/PortalHeader";
import { cn } from "@/lib/cn";

/** Reads the session cookie, so it can never be static. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your projects",
  robots: { index: false, follow: false },
};

export default async function PortalHome() {
  const client = await requirePortalClient();

  const [projects, invoices] = await Promise.all([
    clientProjects(client.id),
    clientInvoices(client.id),
  ]);

  const unpaid = invoices.filter(
    (i) => i.status === "issued" || i.status === "overdue",
  );

  return (
    <div className="min-h-screen">
      <PortalHeader businessName={client.business_name} />

      <main className="mx-auto w-[94%] max-w-[1000px] py-8">
        <h1 className="mb-1 text-3xl font-bold tracking-display text-navy-text">
          Hello {client.contact_name.split(" ")[0]}
        </h1>
        <p className="mb-8 text-muted">
          Where your work stands, and anything outstanding.
        </p>

        <section aria-labelledby="projects" className="mb-10">
          <h2 id="projects" className="mb-4 text-xl font-bold text-navy-text">
            Your projects
          </h2>

          {projects.length === 0 ? (
            <div className="border-2 border-edge rounded-lg bg-surface p-8 text-center">
              <p className="text-muted">
                Nothing here yet. It will appear once your project starts.
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {projects.map((p) => (
                <Link
                  key={p.id}
                  href={`/portal/projects/${p.id}`}
                  className="block border-2 border-edge rounded-lg bg-surface p-5 no-underline transition hover:border-navy"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-bold text-navy-text">{p.title}</h3>
                    <span className="bg-navy rounded-md px-2 py-0.5 text-xs font-bold tracking-wide text-white uppercase">
                      {STAGE_LABEL[p.stage]}
                    </span>
                  </div>

                  {p.status_note ? (
                    <p className="mt-2 leading-relaxed text-muted">
                      {p.status_note}
                    </p>
                  ) : null}

                  {p.awaiting_client ? (
                    <p className="mt-3 border-l-4 border-amber bg-bg px-4 py-2 text-sm">
                      <span className="font-bold text-navy-text">
                        Waiting on you:{" "}
                      </span>
                      <span className="text-muted">{p.awaiting_client}</span>
                    </p>
                  ) : null}
                </Link>
              ))}
            </div>
          )}
        </section>

        <section aria-labelledby="invoices">
          <h2 id="invoices" className="mb-4 text-xl font-bold text-navy-text">
            Invoices
          </h2>

          {invoices.length === 0 ? (
            <div className="border-2 border-edge rounded-lg bg-surface p-8 text-center">
              <p className="text-muted">No invoices yet.</p>
            </div>
          ) : (
            <>
              {unpaid.length > 0 ? (
                <p className="mb-4 border-l-4 border-amber bg-surface px-4 py-3 text-sm">
                  <span className="font-bold text-navy-text">
                    {formatMoney(
                      unpaid.reduce((s, i) => s + Number(i.total), 0),
                    )}{" "}
                    outstanding
                  </span>
                  <span className="text-muted">
                    {" "}
                    — bank details are on each invoice.
                  </span>
                </p>
              ) : null}

              <div className="grid gap-3">
                {invoices.map((inv) => {
                  const overdue = isOverdue(inv);
                  return (
                    <Link
                      key={inv.id}
                      href={`/portal/invoices/${inv.id}`}
                      className="flex flex-wrap items-center justify-between gap-4 border-2 border-edge rounded-lg bg-surface p-5 no-underline transition hover:border-navy"
                    >
                      <div>
                        <p className="font-bold text-navy-text">
                          {inv.invoice_number}
                        </p>
                        <p className="text-sm text-muted">
                          Issued {formatDate(inv.issued_on)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-navy-text">
                          {formatMoney(inv.total)}
                        </p>
                        <p
                          className={cn(
                            "text-sm font-semibold",
                            inv.status === "paid"
                              ? "text-success"
                              : overdue
                                ? "text-danger"
                                : "text-muted",
                          )}
                        >
                          {inv.status === "paid"
                            ? "Paid"
                            : overdue
                              ? `Overdue — was due ${formatDate(inv.due_on)}`
                              : `Due ${formatDate(inv.due_on)}`}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
