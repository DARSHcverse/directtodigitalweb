"use client";

import { useFormStatus } from "react-dom";

function Field({
  label,
  value,
  name,
  options,
}: {
  label: string;
  value: string;
  name: string;
  options: readonly { value: string; label: string }[];
}) {
  const { pending } = useFormStatus();
  return (
    <select
      aria-label={label}
      name={name}
      defaultValue={value}
      disabled={pending}
      onChange={(e) => e.currentTarget.form?.requestSubmit()}
      className="min-h-11 w-full min-w-0 rounded-lg border border-edge bg-surface px-2 text-base font-semibold text-navy-text outline-none focus:border-navy disabled:opacity-60 md:text-sm"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

/** Change a status straight from a list: choosing a value saves it. */
export function QuickSelect({
  action,
  id,
  ...field
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  label: string;
  name: string;
  value: string;
  options: readonly { value: string; label: string }[];
}) {
  return (
    <form action={action} className="min-w-0">
      <input type="hidden" name="id" value={id} />
      <Field {...field} />
    </form>
  );
}
