"use client";

import { useState } from "react";
import type { LeadInput } from "@/lib/lead";

type Status = {
  loading: boolean;
  success: string | null;
  error: string | null;
};

const IDLE: Status = { loading: false, success: null, error: null };

/** Shared submit logic for the contact, quote and booking forms. */
export function useLeadForm<T extends Record<string, string>>(initial: T) {
  const [form, setForm] = useState<T>(initial);
  const [status, setStatus] = useState<Status>(IDLE);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function submit(
    lead: Omit<LeadInput, "companyWebsite">,
    honeypot: string,
    successMessage: string,
  ) {
    setStatus({ loading: true, success: null, error: null });
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, companyWebsite: honeypot }),
      });

      const data: unknown = await res.json().catch(() => null);

      if (!res.ok) {
        const message =
          data && typeof data === "object" && "error" in data
            ? String((data as { error: unknown }).error)
            : "Something went wrong. Please try again.";
        throw new Error(message);
      }

      setStatus({ loading: false, success: successMessage, error: null });
      setForm(initial);
      return true;
    } catch (err) {
      setStatus({
        loading: false,
        success: null,
        error: err instanceof Error ? err.message : "Something went wrong.",
      });
      return false;
    }
  }

  return { form, setForm, status, handleChange, submit };
}
