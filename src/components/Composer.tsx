"use client";

import { useRef, useState } from "react";
import { MAX_BYTES, formatSize } from "@/lib/attachments-shared";

/**
 * Message box with an optional PDF.
 *
 * The size and type are checked here for a fast, clear response, and checked
 * again on the server — including the file's leading bytes — because anything
 * done in the browser can be bypassed.
 */
export function Composer({
  action,
  projectId,
  placeholder,
  submitLabel,
  pending,
  error,
}: {
  action: (formData: FormData) => void;
  projectId: string;
  placeholder: string;
  submitLabel: string;
  pending?: boolean;
  error?: string | null;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  function onPick(input: HTMLInputElement) {
    const file = input.files?.[0];
    setLocalError(null);

    if (!file) {
      setFileName(null);
      return;
    }
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setLocalError("Only PDF files can be attached.");
      input.value = "";
      setFileName(null);
      return;
    }
    if (file.size > MAX_BYTES) {
      setLocalError(
        `That file is ${formatSize(file.size)}. The limit is ${formatSize(MAX_BYTES)}.`,
      );
      input.value = "";
      setFileName(null);
      return;
    }
    setFileName(file.name);
  }

  function clearFile() {
    if (fileRef.current) fileRef.current.value = "";
    setFileName(null);
    setLocalError(null);
  }

  return (
    <form action={action} className="grid gap-3">
      <input type="hidden" name="project_id" value={projectId} />

      <label htmlFor={`body-${projectId}`} className="sr-only">
        Your message
      </label>
      <textarea
        id={`body-${projectId}`}
        name="body"
        rows={3}
        placeholder={placeholder}
        className="w-full border border-edge rounded-lg bg-surface px-4 py-3 text-ink outline-none transition focus:border-navy focus:shadow-[0_0_0_3px_rgb(15_42_71/0.15)]"
      />

      <div className="flex flex-wrap items-center gap-3">
        <label className="cursor-pointer border-2 border-edge rounded-lg px-4 py-2 text-sm font-bold text-muted transition hover:border-navy hover:text-navy-text">
          Attach PDF
          <input
            ref={fileRef}
            type="file"
            name="file"
            accept="application/pdf,.pdf"
            onChange={(e) => onPick(e.currentTarget)}
            className="sr-only"
          />
        </label>

        {fileName ? (
          <span className="flex items-center gap-2 text-sm">
            <span
              aria-hidden="true"
              className="bg-danger px-1.5 py-0.5 text-[10px] font-bold text-white"
            >
              PDF
            </span>
            <span className="font-medium text-navy-text">{fileName}</span>
            <button
              type="button"
              onClick={clearFile}
              aria-label="Remove attachment"
              className="text-muted transition hover:text-danger"
            >
              ×
            </button>
          </span>
        ) : (
          <span className="text-sm text-muted">
            PDFs only, up to {formatSize(MAX_BYTES)}
          </span>
        )}
      </div>

      {localError || error ? (
        <p role="alert" className="text-sm text-danger">
          {localError ?? error}
        </p>
      ) : null}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="bg-navy rounded-md px-5 py-3 text-sm font-bold text-white transition hover:bg-navy-deep disabled:opacity-60"
        >
          {pending ? "Sending…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
