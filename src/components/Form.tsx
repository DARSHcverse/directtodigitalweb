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
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  /** Marks a field as skippable. Without this every box looks compulsory,
   *  which makes a short form feel like a long one. */
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <label
        htmlFor={htmlFor}
        className="flex items-baseline gap-2 text-sm font-medium text-muted"
      >
        {label}
        {optional ? (
          <span className="text-xs font-normal text-muted/70">Optional</span>
        ) : null}
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

/**
 * A tappable choice, used instead of a <select> or a free-text box for the
 * questions people find hardest to answer.
 *
 * Budget and timeline were open text fields, which is the worst way to ask
 * the two questions a tradesperson is least sure about — most either guess,
 * leave them blank, or give up. Presenting the real ranges turns recall into
 * recognition, and one tap beats typing on a phone in a van.
 *
 * Built on radio inputs rather than buttons so keyboard and screen-reader
 * behaviour (arrow keys, group semantics, required) comes from the platform.
 */
export function ChoiceGroup({
  label,
  name,
  value,
  options,
  onChange,
  hint,
  optional,
  columns = 2,
}: {
  label: string;
  name: string;
  value: string;
  options: readonly { value: string; label: string; note?: string }[];
  onChange: (name: string, value: string) => void;
  hint?: string;
  optional?: boolean;
  columns?: 2 | 3;
}) {
  // An odd option count in an even grid leaves a hole on the last row, so the
  // final card stretches to fill it.
  const fillsLastRow = columns === 2 && options.length % 2 === 1;
  return (
    <fieldset className="grid gap-2 border-0 p-0">
      <legend className="mb-1 flex items-baseline gap-2 text-sm font-medium text-muted">
        {label}
        {optional ? (
          <span className="text-xs font-normal text-muted/70">Optional</span>
        ) : null}
      </legend>

      <div
        className={cn(
          "grid gap-2",
          columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2",
        )}
      >
        {options.map((o, i) => {
          const active = value === o.value;
          const last = i === options.length - 1;
          return (
            <label
              key={o.value}
              className={cn(
                "flex cursor-pointer flex-col justify-center rounded-lg border-2 px-4 py-3 transition",
                fillsLastRow && last && "sm:col-span-2",
                "has-[:focus-visible]:outline has-[:focus-visible]:outline-2",
                "has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-navy",
                active
                  ? "border-navy bg-navy text-white"
                  : "border-edge bg-surface hover:border-navy",
              )}
            >
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={active}
                onChange={() => onChange(name, o.value)}
                className="sr-only"
              />
              <span
                className={cn(
                  "text-sm font-semibold",
                  active ? "text-white" : "text-navy-text",
                )}
              >
                {o.label}
              </span>
              {o.note ? (
                <span
                  className={cn(
                    "mt-0.5 text-xs",
                    active ? "text-white/75" : "text-muted",
                  )}
                >
                  {o.note}
                </span>
              ) : null}
            </label>
          );
        })}
      </div>

      {hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </fieldset>
  );
}

/** A labelled step divider, so a long form reads as three short sections. */
export function FormSection({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-4">
      <h2 className="flex items-center gap-2.5 text-xs font-bold tracking-[0.14em] text-muted uppercase">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-navy text-[0.7rem] text-white">
          {step}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}
