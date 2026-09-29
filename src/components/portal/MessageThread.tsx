"use client";

import { useActionState, useRef } from "react";
import { sendMessage, type MessageState } from "@/app/portal/project-actions";
import type { Message } from "@/lib/db/types";
import { cn } from "@/lib/cn";

const initial: MessageState = { error: null };

function when(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MessageThread({
  projectId,
  messages,
  ownerName,
}: {
  projectId: string;
  messages: Message[];
  ownerName: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(
    async (prev: MessageState, formData: FormData) => {
      const result = await sendMessage(prev, formData);
      if (!result.error) formRef.current?.reset();
      return result;
    },
    initial,
  );

  return (
    <div className="grid gap-5">
      {messages.length === 0 ? (
        <p className="text-sm text-muted">
          Nothing here yet. Anything you send goes straight to me.
        </p>
      ) : (
        <ol className="grid gap-3">
          {messages.map((m) => (
            <li
              key={m.id}
              className={cn(
                "border-l-4 bg-bg px-4 py-3",
                m.author === "client" ? "border-edge" : "border-amber",
              )}
            >
              <p className="text-xs font-bold tracking-wide text-muted uppercase">
                {m.author === "client" ? "You" : ownerName} ·{" "}
                {when(m.created_at)}
              </p>
              <p className="mt-1 leading-relaxed whitespace-pre-wrap text-ink">
                {m.body}
              </p>
            </li>
          ))}
        </ol>
      )}

      <form ref={formRef} action={action} className="grid gap-3">
        <input type="hidden" name="project_id" value={projectId} />
        <label htmlFor="body" className="sr-only">
          Your message
        </label>
        <textarea
          id="body"
          name="body"
          rows={3}
          required
          placeholder="Ask a question or send me something…"
          className="w-full border border-edge bg-surface px-4 py-3 text-ink outline-none transition focus:border-navy focus:shadow-[0_0_0_3px_rgb(15_42_71/0.15)]"
        />

        {state.error ? (
          <p role="alert" className="text-sm text-danger">
            {state.error}
          </p>
        ) : null}

        <div>
          <button
            type="submit"
            disabled={pending}
            className="bg-navy px-5 py-3 text-sm font-bold text-white transition hover:bg-navy-deep disabled:opacity-60"
          >
            {pending ? "Sending…" : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
