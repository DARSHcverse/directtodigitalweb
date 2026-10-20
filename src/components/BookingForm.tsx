"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/Button";
import {
  ChoiceGroup,
  Field,
  FormSection,
  FormShell,
  FormStatus,
  Honeypot,
  PrivacyNotice,
  Input,
  Textarea,
} from "@/components/Form";
import { useLeadForm } from "@/lib/useLeadForm";
import { SuccessOverlay } from "@/components/SuccessOverlay";
import { CALL_DAYS, CALL_METHODS, CALL_TIMES } from "@/lib/lead";
import { site } from "@/lib/site";

/**
 * Request a call: by phone or Zoom, at a rough time that suits.
 *
 * This page used to be called "Book a call" but was a plain form, so it set
 * up an expectation of picking a slot and then made people wait for an
 * email. It is now honest about what happens: they say how and roughly when,
 * Shan confirms an exact time — with a Zoom link and a calendar invite if
 * it's a video call — from the admin.
 */
export function BookingForm() {
  const formRef = useRef<HTMLDivElement>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  // The form resets after a successful send, so the method is captured at
  // submit time; reading it afterwards gave the phone wording for Zoom.
  const [sentZoom, setSentZoom] = useState(false);
  const { form, status, handleChange, setField, submit } = useLeadForm({
    method: CALL_METHODS[0].value as string,
    day: CALL_DAYS[0].value as string,
    time: "",
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });

  const isZoom = form.method === CALL_METHODS[1].value;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const honeypot =
      formRef.current?.querySelector<HTMLInputElement>("#company-website")
        ?.value ?? "";

    const ok = await submit(
      {
        kind: "booking",
        name: form.fullName,
        email: form.email,
        phone: form.phone,
        topic: form.method,
        // When suits them, as one readable line for the email and admin.
        timeline: [form.day, form.time].filter(Boolean).join(", "),
        message: form.message,
      },
      honeypot,
      "Thanks — I'll confirm a time shortly.",
    );

    if (ok) {
      setSentZoom(isZoom);
      setShowSuccess(true);
    }
  }

  return (
    <>
      <SuccessOverlay
        open={showSuccess}
        heading={"Request received"}
        message={
          sentZoom
            ? "Thanks — I’ll email you a time and a Zoom link, usually within one working day."
            : "Thanks — I’ll be in touch to confirm a time, usually within one working day."
        }
        onClose={() => setShowSuccess(false)}
      />

      <div ref={formRef}>
        <FormShell onSubmit={handleSubmit}>
          <Honeypot />

          <FormSection step={1} title="How would you like to talk?">
            <ChoiceGroup
              label="Choose one"
              name="method"
              value={form.method}
              options={CALL_METHODS}
              onChange={setField}
              columns={2}
              hint={
                isZoom
                  ? "Good for going through ideas on screen. You don't need a Zoom account; the link opens in your browser."
                  : undefined
              }
            />
          </FormSection>

          <FormSection step={2} title="When suits you?">
            <ChoiceGroup
              label="Day"
              name="day"
              value={form.day}
              options={CALL_DAYS}
              onChange={setField}
              columns={3}
            />
            <ChoiceGroup
              label="Time"
              name="time"
              value={form.time}
              options={CALL_TIMES}
              onChange={setField}
              optional
              columns={3}
              hint="I'll confirm an exact time by email before we talk."
            />
          </FormSection>

          <FormSection step={3} title="Your details">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Your name" htmlFor="fullName">
                <Input
                  id="fullName"
                  name="fullName"
                  autoComplete="name"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field label="Email" htmlFor="email">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </Field>
            </div>

            <Field
              label="Phone"
              htmlFor="phone"
              optional={isZoom}
              hint={isZoom ? undefined : "The number I'll call you on."}
            >
              <Input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={handleChange}
                required={!isZoom}
              />
            </Field>

            <Field
              label="What would you like to talk about?"
              htmlFor="message"
              optional
            >
              <Textarea
                id="message"
                name="message"
                rows={4}
                value={form.message}
                onChange={handleChange}
                placeholder="e.g. I'm a roofer in Watford with no website yet, and I'd like to hear some ideas."
              />
            </Field>
          </FormSection>

          <div className="grid gap-3 border-t border-edge pt-6">
            <Button type="submit" variant="primary" disabled={status.loading}>
              {status.loading ? "Sending…" : "Request a call"}
            </Button>
            <p className="text-center text-sm text-muted">
              Free and no obligation. Rather ring now?{" "}
              <a
                href={`tel:${site.phone.e164}`}
                className="font-semibold text-navy-text hover:text-amber-deep"
              >
                {site.phone.display}
              </a>
            </p>
            <FormStatus error={status.error} />
            <PrivacyNotice />
          </div>
        </FormShell>
      </div>
    </>
  );
}
