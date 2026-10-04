"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

function CompactSubmit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-sm font-bold text-danger transition hover:underline disabled:opacity-60"
    >
      {pending ? "…" : "Yes"}
    </button>
  );
}

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-danger px-4 py-2 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
    >
      {pending ? "Deleting…" : label}
    </button>
  );
}

/**
 * Permanent delete, behind a confirmation step.
 *
 * Archiving is reversible, so a single click is fine for it. This is not: the
 * row and everything under it goes, and there is no undo. The confirmation
 * spells out what will be destroyed rather than asking "are you sure", which
 * tells nobody anything.
 *
 * It is a two-state inline control rather than window.confirm() so the warning
 * can name the actual consequences, and rather than a modal because nothing
 * else here needs one.
 */
export function DeleteButton({
  action,
  id,
  what,
  consequence,
  label = "Delete permanently",
  compact,
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  /** What is being deleted, e.g. "Smith Plumbing". */
  what: string;
  /** What else goes with it. Omit when nothing does. */
  consequence?: string;
  label?: string;
  /** Inline in a row, rather than a block in a detail page. */
  compact?: boolean;
}) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className={
          compact
            ? "text-sm font-bold text-danger transition hover:underline"
            : "rounded-md border-2 border-danger px-4 py-2 text-sm font-bold text-danger transition hover:bg-danger hover:text-white"
        }
      >
        Delete
      </button>
    );
  }

  // In a table cell there is no room for a panel, so the confirmation is a
  // short inline "Delete? Yes / No" rather than a block that would blow the
  // row height apart.
  if (compact) {
    return (
      <span className="inline-flex items-center gap-2 whitespace-nowrap">
        <span className="text-sm text-muted">Delete?</span>
        <form action={action} className="inline">
          <input type="hidden" name="id" value={id} />
          <CompactSubmit />
        </form>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="text-sm font-bold text-muted transition hover:text-navy-text"
        >
          No
        </button>
      </span>
    );
  }

  return (
    <div className="rounded-lg border-2 border-danger bg-surface p-4">
      <p className="text-sm font-bold text-navy-text">
        Permanently delete {what}?
      </p>
      <p className="mt-1 text-sm text-muted">
        {consequence ? `${consequence} ` : ""}This cannot be undone.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <form action={action}>
          <input type="hidden" name="id" value={id} />
          <Submit label={label} />
        </form>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-md border-2 border-edge px-4 py-2 text-sm font-bold text-muted transition hover:border-navy hover:text-navy-text"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
