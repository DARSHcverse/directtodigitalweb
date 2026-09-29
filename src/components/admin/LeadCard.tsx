"use client";

import { useState } from "react";
import {
  updateLeadStatus,
  updateLeadNotes,
} from "@/app/(admin)/[adminPath]/leads/actions";
import type { Lead, LeadStatus } from "@/lib/db/types";
import Link from "next/link";
import { cn } from "@/lib/cn";

const STATUSES: LeadStatus[] = ["new", "contacted", "quoted", "won", "lost"];

const STATUS_STYLE: Record<LeadStatus, string> = {
  new: "bg-amber text-navy-deep",
  contacted: "bg-navy text-white",
  quoted: "bg-navy-soft text-white",
  won: "bg-success text-white",
  lost: "bg-edge text-muted",
};

function when(iso: string) {
  const d = new Date(iso);
  const days = Math.floor((Date.now() - d.getTime()) / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Links are passed in rather than built here: adminPath() reads a
 *  server-only env var, which is undefined in a client component and would
 *  silently fall back to the default segment. */
export function LeadCard({
  lead,
  newClientHref,
  clientHref,
}: {
  lead: Lead;
  newClientHref: string;
  clientHref: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <article className="border-2 border-edge bg-surface">
      <div className="flex flex-wrap items-start justify-between gap-4 p-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-bold text-navy">{lead.name}</h2>
            <span
              className={cn(
                "px-2 py-0.5 text-xs font-bold tracking-wide uppercase",
                STATUS_STYLE[lead.status],
              )}
            >
              {lead.status}
            </span>
            {lead.source_path ? (
              <span className="text-xs text-muted">{lead.source_path}</span>
            ) : null}
          </div>

          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
            <a
              href={`mailto:${lead.email}`}
              className="font-medium text-navy hover:text-amber-deep"
            >
              {lead.email}
            </a>
            {lead.phone ? (
              <a
                href={`tel:${lead.phone.replace(/\s/g, "")}`}
                className="font-medium text-navy hover:text-amber-deep"
              >
                {lead.phone}
              </a>
            ) : null}
            <span className="text-muted">{when(lead.created_at)}</span>
          </div>

          {(lead.topic || lead.budget || lead.timeline) && (
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {[
                lead.topic && `Type: ${lead.topic}`,
                lead.budget && `Budget: ${lead.budget}`,
                lead.timeline && `Timeline: ${lead.timeline}`,
              ]
                .filter(Boolean)
                .map((chip) => (
                  <span key={String(chip)} className="border border-edge px-2 py-1 text-muted">
                    {chip}
                  </span>
                ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="shrink-0 border-2 border-navy px-4 py-2 text-sm font-bold text-navy transition hover:bg-navy hover:text-white"
        >
          {open ? "Close" : "Open"}
        </button>
      </div>

      {open ? (
        <div className="border-t-2 border-edge bg-bg p-5">
          {lead.message ? (
            <div className="mb-5">
              <p className="mb-2 text-xs font-bold tracking-[0.2em] text-muted uppercase">
                Message
              </p>
              <p className="leading-relaxed whitespace-pre-wrap text-ink">
                {lead.message}
              </p>
            </div>
          ) : null}

          <div className="mb-5">
            <p className="mb-2 text-xs font-bold tracking-[0.2em] text-muted uppercase">
              Status
            </p>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <form key={s} action={updateLeadStatus}>
                  <input type="hidden" name="id" value={lead.id} />
                  <input type="hidden" name="status" value={s} />
                  <button
                    type="submit"
                    disabled={s === lead.status}
                    className={cn(
                      "border-2 px-3 py-1.5 text-sm font-semibold transition",
                      s === lead.status
                        ? "border-navy bg-navy text-white"
                        : "border-edge text-muted hover:border-navy hover:text-navy",
                    )}
                  >
                    {s}
                  </button>
                </form>
              ))}
            </div>
          </div>

          <form action={updateLeadNotes}>
            <input type="hidden" name="id" value={lead.id} />
            <label
              htmlFor={`notes-${lead.id}`}
              className="mb-2 block text-xs font-bold tracking-[0.2em] text-muted uppercase"
            >
              Notes
            </label>
            <textarea
              id={`notes-${lead.id}`}
              name="notes"
              rows={3}
              defaultValue={lead.notes ?? ""}
              className="w-full border border-edge bg-surface px-4 py-3 text-ink outline-none focus:border-navy"
            />
            <button
              type="submit"
              className="mt-2 bg-navy px-4 py-2 text-sm font-bold text-white transition hover:bg-navy-deep"
            >
              Save notes
            </button>
          </form>

          <div className="mt-5 border-t border-edge pt-5">
            {lead.client_id ? (
              <Link
                href={clientHref}
                className="text-sm font-bold text-navy no-underline hover:text-amber-deep"
              >
                View client →
              </Link>
            ) : (
              <Link
                href={newClientHref}
                className="inline-block bg-amber px-4 py-2 text-sm font-bold text-navy-deep no-underline transition hover:bg-amber-deep"
              >
                Convert to client
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </article>
  );
}
