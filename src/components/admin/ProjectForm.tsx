"use client";

import { useActionState } from "react";
import {
  createProject,
  updateProject,
  type ProjectFormState,
} from "@/app/(admin)/[adminPath]/projects/actions";
import type { Client, Project } from "@/lib/db/types";

const initial: ProjectFormState = { error: null };

const field =
  "w-full border border-edge bg-surface px-4 py-3 text-ink outline-none transition focus:border-navy focus:shadow-[0_0_0_3px_rgb(15_42_71/0.15)]";
const label = "mb-2 block text-sm font-medium text-muted";

export function ProjectForm({
  project,
  clients,
  presetClientId,
}: {
  project?: Project;
  clients: Pick<Client, "id" | "business_name" | "contact_name">[];
  presetClientId?: string;
}) {
  const editing = Boolean(project);
  const [state, action, pending] = useActionState(
    editing ? updateProject : createProject,
    initial,
  );

  return (
    <form action={action} className="grid gap-5">
      {editing ? <input type="hidden" name="id" value={project!.id} /> : null}

      <div>
        <label htmlFor="client_id" className={label}>
          Client
        </label>
        <select
          id="client_id"
          name="client_id"
          required
          defaultValue={project?.client_id ?? presetClientId ?? ""}
          className={field}
        >
          <option value="" disabled>
            Choose a client…
          </option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.business_name} ({c.contact_name})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="title" className={label}>
          Project title
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={project?.title ?? ""}
          placeholder="e.g. New website — 5 pages"
          className={field}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="tier" className={label}>
            Package
          </label>
          <input
            id="tier"
            name="tier"
            defaultValue={project?.tier ?? ""}
            placeholder="Starter / Business"
            className={field}
          />
        </div>
        <div>
          <label htmlFor="agreed_price" className={label}>
            Agreed price (£)
          </label>
          <input
            id="agreed_price"
            name="agreed_price"
            inputMode="decimal"
            defaultValue={project?.agreed_price ?? ""}
            placeholder="1800"
            className={field}
          />
        </div>
        <div>
          <label htmlFor="target_date" className={label}>
            Target launch
          </label>
          <input
            id="target_date"
            name="target_date"
            type="date"
            defaultValue={project?.target_date ?? ""}
            className={field}
          />
        </div>
      </div>

      <div>
        <label htmlFor="status_note" className={label}>
          Status note
        </label>
        <textarea
          id="status_note"
          name="status_note"
          rows={3}
          defaultValue={project?.status_note ?? ""}
          placeholder="What is happening now — the client sees this."
          className={field}
        />
      </div>

      <div>
        <label htmlFor="awaiting_client" className={label}>
          Waiting on the client for
        </label>
        <input
          id="awaiting_client"
          name="awaiting_client"
          defaultValue={project?.awaiting_client ?? ""}
          placeholder="e.g. Photos of recent jobs"
          className={field}
        />
      </div>

      <div>
        <label htmlFor="live_url" className={label}>
          Live URL
        </label>
        <input
          id="live_url"
          name="live_url"
          defaultValue={project?.live_url ?? ""}
          placeholder="https://…"
          className={field}
        />
      </div>

      {state.error ? (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      ) : null}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="bg-navy px-6 py-3.5 text-sm font-bold tracking-wide text-white transition hover:bg-navy-deep disabled:opacity-60"
        >
          {pending ? "Saving…" : editing ? "Save changes" : "Create project"}
        </button>
      </div>
    </form>
  );
}
