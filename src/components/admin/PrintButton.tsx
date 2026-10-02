"use client";

/** Opens the browser print dialogue, where "Save as PDF" produces the file
 *  sent to the client. */
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="border-2 border-navy rounded-lg px-5 py-2.5 text-sm font-bold text-navy-text transition hover:bg-navy hover:text-white"
    >
      Print / PDF
    </button>
  );
}
