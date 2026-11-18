"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * A bottom sheet on phones and a centred panel on larger screens. Built on
 * <dialog>, which brings focus trapping and Escape with it.
 */
export function Sheet({
  open,
  onClose,
  label,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClose={onClose}
      // A click on the dialog itself can only be its backdrop.
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="admin-sheet"
    >
      <div className="max-h-[85dvh] overflow-y-auto p-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        <span aria-hidden="true" className="mx-auto mb-4 block h-1 w-10 rounded-full bg-edge md:hidden" />
        {open ? children : null}
      </div>
    </dialog>
  );
}
