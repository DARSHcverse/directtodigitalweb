"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

/**
 * A two-tap submit for list cards, where a stray thumb must not email a
 * client. The first tap arms it; the second does it.
 */
export function ConfirmSubmit({ label, className }: { label: string; className: string }) {
  const [armed, setArmed] = useState(false);
  const { pending } = useFormStatus();

  if (!armed) {
    return (
      <button type="button" onClick={() => setArmed(true)} className={className}>
        {label}
      </button>
    );
  }
  return (
    <button type="submit" disabled={pending} onBlur={() => setArmed(false)} autoFocus className={className}>
      {pending ? "…" : "Confirm"}
    </button>
  );
}
