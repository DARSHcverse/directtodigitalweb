import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

const field =
  "rounded-lg border border-edge bg-surface px-4 py-3 text-ink outline-none transition " +
  "focus:border-navy focus:shadow-[0_0_0_3px_rgb(15_42_71/0.15)]";

export function FormShell({
  onSubmit,
  children,
}: {
  onSubmit: ComponentProps<"form">["onSubmit"];
  children: ReactNode;
}) {
  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="mx-auto grid max-w-[640px] gap-5 border-2 border-edge rounded-lg bg-surface p-8"
    >
      {children}
    </form>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={htmlFor} className="text-sm font-medium text-muted">
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(field, className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(field, "resize-y", className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(field, className)} {...props} />;
}

/**
 * Off-screen honeypot. Real users never fill this; bots usually do.
 * Paired with the server-side check in /api/lead.
 */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
      <label htmlFor="company-website">Leave this field empty</label>
      <input
        id="company-website"
        name="companyWebsite"
        type="text"
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}

/** Point-of-collection notice. UK GDPR expects this where the data is
 *  entered, not only in a footer link. */
export function PrivacyNotice() {
  return (
    <p className="text-sm leading-relaxed text-muted">
      Your details are used only to reply to this enquiry. No marketing, no
      mailing list, no sharing.{" "}
      <Link href="/privacy" className="font-semibold text-navy-text hover:text-amber-deep">
        Privacy policy
      </Link>
      .
    </p>
  );
}

export function FormStatus({
  success,
  error,
}: {
  success?: string | null;
  error?: string | null;
}) {
  if (!success && !error) return null;
  return (
    <p
      role="status"
      aria-live="polite"
      className={cn("text-base", success ? "text-success" : "text-danger")}
    >
      {success ?? error}
    </p>
  );
}
