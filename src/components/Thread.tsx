import type { Attachment } from "@/lib/attachments";
import { formatSize } from "@/lib/attachments-shared";
import type { Message, MessageAuthor } from "@/lib/db/types";
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
 * The conversation, as both sides see it.
 *
 * `viewer` decides which side is "you", so one component serves the admin and
 * the portal rather than two that can drift apart.
 *
 * Files are linked through /portal/files/[id], which re-checks ownership and
 * mints a two-minute signed URL — the storage path is never exposed.
 */
export function Thread({
  messages,
  attachments,
  viewer,
  otherName,
}: {
  messages: Message[];
  attachments: Attachment[];
  viewer: MessageAuthor;
  otherName: string;
}) {
  const byMessage = new Map<string, Attachment[]>();
  for (const a of attachments) {
    if (!a.message_id) continue;
    const list = byMessage.get(a.message_id) ?? [];
    list.push(a);
    byMessage.set(a.message_id, list);
  }

  if (messages.length === 0) {
    return (
      <p className="text-sm leading-relaxed text-muted">
        Nothing here yet. Anything sent appears in this thread, so it stays
        with the project instead of getting lost in an inbox.
      </p>
    );
  }

  return (
    <ol className="grid gap-3">
      {messages.map((m) => {
        const mine = m.author === viewer;
        const files = byMessage.get(m.id) ?? [];

        return (
          <li
            key={m.id}
            className={cn(
              "border-l-4 px-4 py-3",
              mine ? "border-edge bg-surface" : "border-amber bg-bg",
            )}
          >
            <p className="text-xs font-bold tracking-wide text-muted uppercase">
              {mine ? "You" : otherName} · {when(m.created_at)}
            </p>

            {m.body && m.body !== "(file attached)" ? (
              <p className="mt-1 leading-relaxed whitespace-pre-wrap text-ink">
                {m.body}
              </p>
            ) : null}

            {files.length > 0 ? (
              <ul className="mt-3 grid gap-2">
                {files.map((f) => (
                  <li key={f.id}>
                    <a
                      href={`/portal/files/${f.id}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 border border-edge rounded-lg bg-surface px-3 py-2 text-sm no-underline transition hover:border-navy"
                    >
                      <span
                        aria-hidden="true"
                        className="bg-danger px-1.5 py-0.5 text-[10px] font-bold text-white"
                      >
                        PDF
                      </span>
                      <span className="font-medium text-navy-text">
                        {f.file_name}
                      </span>
                      <span className="text-muted">
                        {formatSize(f.byte_size)}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
