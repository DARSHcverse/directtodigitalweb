"use client";

import { useActionState, useState } from "react";
import {
  arrangeCall,
  type ArrangeCallState,
} from "@/app/(admin)/[adminPath]/leads/actions";
import { CALL_METHODS } from "@/lib/lead";

const initial: ArrangeCallState = { error: null, sentTo: null };

const input =
  "w-full rounded-lg border-2 border-edge bg-surface px-3 py-2.5 text-ink outline-none transition focus:border-navy";
const label = "mb-1.5 block text-sm font-medium text-muted";

/** Today in the UK, as YYYY-MM-DD, for the date picker's minimum. */
function ukToday(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(
    new Date(),
  );
}

/**
 * Pick a time, choose how, and send the confirmation.
 *
 * Pre-filled with the method they asked for. The Zoom link field appears only
 * for Zoom: create the meeting in Zoom, paste its link here, and it goes into
 * both the email and the calendar file.
 */
export function ArrangeCallForm({
  leadId,
  requestedMethod,
  hasPhone,
}: {
  leadId: string;
  requestedMethod: string | null;
  hasPhone: boolean;
}) {
  const [state, action, pending] = useActionState(arrangeCall, initial);
  const [method, setMethod] = useState<string>(
    CALL_METHODS.some((m) => m.value === requestedMethod)
      ? (requestedMethod as string)
      : hasPhone
        ? CALL_METHODS[0].value
        : CALL_METHODS[1].value,
  );
  const isZoom = method === CALL_METHODS[1].value;

  if (state.sentTo) {
    return (
      <p
        role="status"
        className="rounded-lg border-l-4 border-success bg-bg px-4 py-3 font-semibold text-success"
      >
        Confirmation and calendar invite sent to {state.sentTo}. A copy is in
        your inbox, and it&apos;s noted on this lead.
      </p>
    );
  }

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="id" value={leadId} />

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="date" className={label}>
            Date
          </label>
          <input id="date" name="date" type="date" min={ukToday()} required className={input} />
        </div>
        <div>
          <label htmlFor="time" className={label}>
            Time (UK)
          </label>
          <input
            id="time"
            name="time"
            type="time"
            min="07:00"
            max="23:00"
            step={900}
            required
            className={input}
          />
        </div>
        <div>
          <label htmlFor="minutes" className={label}>
            Length
          </label>
          <select id="minutes" name="minutes" defaultValue="15" className={input}>
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">1 hour</option>
          </select>
        </div>
      </div>

      <fieldset>
        <legend className={label}>How</legend>
        <div className="flex flex-wrap gap-2">
          {CALL_METHODS.map((m) => {
            const disabled = m.value !== CALL_METHODS[1].value && !hasPhone;
            return (
              <label
                key={m.value}
                className={`cursor-pointer rounded-lg border-2 px-4 py-2 text-sm font-semibold transition ${
                  method === m.value
                    ? "border-navy bg-navy text-white"
                    : "border-edge text-navy-text hover:border-navy"
                } ${disabled ? "pointer-events-none opacity-40" : ""}`}
              >
                <input
                  type="radio"
                  name="method"
                  value={m.value}
                  checked={method === m.value}
                  onChange={() => setMethod(m.value)}
                  disabled={disabled}
                  className="sr-only"
                />
                {m.label}
              </label>
            );
          })}
        </div>
        {!hasPhone ? (
          <p className="mt-2 text-xs text-muted">
            No phone number on this lead, so only Zoom is available.
          </p>
        ) : null}
      </fieldset>

      {isZoom ? (
        <div>
          <label htmlFor="zoomLink" className={label}>
            Zoom meeting link
          </label>
          <input
            id="zoomLink"
            name="zoomLink"
            type="url"
            inputMode="url"
            placeholder="https://zoom.us/j/…"
            required
            className={input}
          />
          <p className="mt-1.5 text-xs text-muted">
            Schedule it in Zoom for the same time, then paste the invite link.
          </p>
        </div>
      ) : null}

      <div>
        <label htmlFor="note" className={label}>
          Note to them <span className="font-normal text-muted/70">Optional</span>
        </label>
        <textarea
          id="note"
          name="note"
          rows={3}
          className={`${input} resize-y`}
          placeholder="e.g. Have a look at a couple of sites you like before we talk."
        />
      </div>

      {state.error ? (
        <p role="alert" className="text-sm font-semibold text-danger">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="justify-self-start rounded-md bg-amber px-5 py-2.5 text-sm font-bold text-on-amber transition hover:bg-amber-deep disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send confirmation and invite"}
      </button>
    </form>
  );
}
