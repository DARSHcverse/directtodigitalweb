"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

/**
 * Full-screen confirmation shown after a form is submitted.
 *
 * Replaces a line of green text under the button, which sat below the fold on
 * a phone and left people unsure whether anything had happened — the usual
 * result being a second submission, or giving up.
 *
 * Rendered as a modal dialog rather than a separate thank-you page so the
 * form state survives: if they came from a trade page, the back button still
 * returns them there.
 */
export function SuccessOverlay({
  open,
  heading,
  message,
  onClose,
}: {
  open: boolean;
  heading: string;
  message: string;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  // Move focus into the dialog so a screen reader announces it and Escape
  // has somewhere to act from.
  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);

    // Stop the page scrolling behind the overlay.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-heading"
      className="fixed inset-0 z-[100] flex items-center justify-center px-5"
    >
      <div
        aria-hidden="true"
        onClick={onClose}
        className="animate-overlay-in absolute inset-0 bg-navy-deep/70 backdrop-blur-sm"
      />

      <div className="animate-card-in relative w-full max-w-md border-2 border-navy rounded-lg bg-surface">
        <div className="h-1.5 w-full bg-amber" />

        <div className="px-8 pt-10 pb-8 text-center">
          <svg
            viewBox="0 0 80 80"
            className="mx-auto mb-6 h-20 w-20"
            aria-hidden="true"
          >
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="var(--color-amber)"
              strokeWidth="4"
              className="animate-ring-draw"
              pathLength={1}
            />
            <path
              d="M24 41.5 L35 52.5 L57 29"
              fill="none"
              stroke="var(--color-navy)"
              strokeWidth="6"
              strokeLinecap="square"
              strokeLinejoin="miter"
              className="animate-tick-draw"
              pathLength={1}
            />
          </svg>

          <h2
            id="success-heading"
            className="mb-3 text-3xl leading-tight font-bold tracking-display text-navy-text"
          >
            {heading}
          </h2>

          <p className="mb-7 leading-relaxed text-muted">{message}</p>

          <div className="mb-6 border-y border-edge py-5 text-left">
            <p className="mb-3 text-xs font-bold tracking-[0.2em] text-muted uppercase">
              What happens next
            </p>
            <ol className="grid gap-2.5 text-sm text-ink">
              {[
                "A confirmation email is on its way to you",
                "I read it myself — no call centre, no bots",
                "You get a straight answer within one working day",
              ].map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="font-bold text-amber-deep">{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/design"
              className="flex-1 bg-navy rounded-md px-5 py-3.5 text-sm font-bold text-white no-underline transition hover:bg-navy-deep"
            >
              See recent work
            </Link>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="flex-1 border-2 border-navy rounded-lg px-5 py-3.5 text-sm font-bold text-navy-text transition hover:bg-navy hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
