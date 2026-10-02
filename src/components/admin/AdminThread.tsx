"use client";

import { useActionState } from "react";
import { Thread } from "@/components/Thread";
import { Composer } from "@/components/Composer";
import { replyToClient } from "@/app/(admin)/[adminPath]/projects/actions";
import type { Attachment } from "@/lib/attachments";
import type { Message } from "@/lib/db/types";

export function AdminThread({
  projectId,
  messages,
  attachments,
}: {
  projectId: string;
  messages: Message[];
  attachments: Attachment[];
}) {
  const [, action, pending] = useActionState(async (_: null, fd: FormData) => {
    await replyToClient(fd);
    return null;
  }, null);

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

      <div className="mb-5">
        <Thread
          messages={messages}
          attachments={attachments}
          viewer="owner"
          otherName="Client"
        />
      </div>

      <Composer
        action={action}
        projectId={projectId}
        placeholder="Reply to the client…"
        submitLabel="Send reply"
        pending={pending}
      />
    </section>
  );
}
