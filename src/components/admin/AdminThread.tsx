import { replyToClient } from "@/app/(admin)/[adminPath]/projects/actions";
import type { Message } from "@/lib/db/types";
import { cn } from "@/lib/cn";

function when(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * The client's message thread, with a reply box.
 *
 * Until now the admin read neither messages nor the brief, so anything a
 * client sent through the portal was invisible.
 */
export function AdminThread({
  projectId,
  messages,
}: {
  projectId: string;
  messages: Message[];
}) {
  const unread = messages.filter(
    (m) => m.author === "client" && !m.read_at,
  ).length;

  return (
    <section className="border-2 border-edge bg-surface p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-navy">Messages</h2>
        {unread > 0 ? (
          <span className="bg-amber px-2 py-0.5 text-xs font-bold text-navy-deep uppercase">
            {unread} new
          </span>
        ) : null}
      </div>

      {messages.length === 0 ? (
        <p className="mb-5 text-sm text-muted">
          Nothing yet. Anything the client sends from their portal appears
          here.
        </p>
      ) : (
        <ol className="mb-5 grid gap-3">
          {messages.map((m) => (
            <li
              key={m.id}
              className={cn(
                "border-l-4 px-4 py-3",
                m.author === "client"
                  ? "border-amber bg-bg"
                  : "border-edge bg-surface",
              )}
            >
              <p className="text-xs font-bold tracking-wide text-muted uppercase">
                {m.author === "client" ? "Client" : "You"} · {when(m.created_at)}
              </p>
              <p className="mt-1 leading-relaxed whitespace-pre-wrap text-ink">
                {m.body}
              </p>
            </li>
          ))}
        </ol>
      )}

      <form action={replyToClient} className="grid gap-3">
        <input type="hidden" name="project_id" value={projectId} />
        <label htmlFor="reply" className="sr-only">
          Reply to the client
        </label>
        <textarea
          id="reply"
          name="body"
          rows={3}
          required
          placeholder="Reply to the client…"
          className="w-full border border-edge bg-surface px-4 py-3 text-ink outline-none transition focus:border-navy focus:shadow-[0_0_0_3px_rgb(15_42_71/0.15)]"
        />
        <div>
          <button
            type="submit"
            className="bg-navy px-5 py-3 text-sm font-bold text-white transition hover:bg-navy-deep"
          >
            Send reply
          </button>
        </div>
      </form>
    </section>
  );
}
