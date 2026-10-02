"use client";

import { useActionState } from "react";
import { saveBrief, type BriefState } from "@/app/portal/project-actions";
import { BRIEF_FIELDS } from "@/lib/portal/brief-fields";
import type { ProjectBrief } from "@/lib/db/types";

const initial: BriefState = { error: null, success: null };

export function BriefForm({
  projectId,
  brief,
}: {
  projectId: string;
  brief: ProjectBrief | null;
}) {
  const [state, action, pending] = useActionState(saveBrief, initial);

  return (
    <form action={action} className="grid gap-6">
      <input type="hidden" name="project_id" value={projectId} />

      {BRIEF_FIELDS.map((f) => (
        <div key={f.name}>
          <label
            htmlFor={f.name}
            className="mb-2 block text-sm font-semibold text-navy-text"
          >
            {f.label}
          </label>
          {f.hint ? (
            <p className="mb-2 text-sm text-muted">{f.hint}</p>
          ) : null}
          <textarea
            id={f.name}
            name={f.name}
            rows={f.rows}
            defaultValue={brief?.[f.name] ?? ""}
            className="w-full border border-edge rounded-lg bg-surface px-4 py-3 text-ink outline-none transition focus:border-navy focus:shadow-[0_0_0_3px_rgb(15_42_71/0.15)]"
          />
        </div>
      ))}

      {state.error ? (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p role="status" className="text-sm font-semibold text-success">
          {state.success}
        </p>
      ) : null}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="bg-navy rounded-md px-6 py-3.5 text-sm font-bold tracking-wide text-white transition hover:bg-navy-deep disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        <p className="mt-3 text-sm text-muted">
          You can come back and add more at any time until the build starts.
        </p>
      </div>
    </form>
  );
}
