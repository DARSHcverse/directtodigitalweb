"use client";

import { useActionState } from "react";
import { Thread } from "@/components/Thread";
import { Composer } from "@/components/Composer";
import { sendMessage, type MessageState } from "@/app/portal/project-actions";
import type { Attachment } from "@/lib/attachments";
import type { Message } from "@/lib/db/types";

const initial: MessageState = { error: null };

export function MessageThread({
  projectId,
  messages,
  attachments,
  ownerName,
}: {
  projectId: string;
  messages: Message[];
  attachments: Attachment[];
  ownerName: string;
}) {
  const [state, action, pending] = useActionState(sendMessage, initial);

  return (
    <div className="grid gap-5">
      <Thread
        messages={messages}
        attachments={attachments}
        viewer="client"
        otherName={ownerName}
      />

      <Composer
        action={action}
        projectId={projectId}
        placeholder="Ask a question, or send me something…"
        submitLabel="Send"
        pending={pending}
        error={state.error}
      />
    </div>
  );
}
