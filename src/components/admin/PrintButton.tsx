"use client";

/** Opens the browser print dialogue, where "Save as PDF" produces the file
 *  sent to the client. */
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full border-2 border-navy-text px-5 py-2.5 text-sm font-bold text-navy-text transition hover:bg-navy-text hover:text-bg"
    >
      Print / PDF
    </button>
  );
}
