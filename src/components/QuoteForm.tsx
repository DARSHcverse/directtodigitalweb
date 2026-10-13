"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
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
import { budgetBands, projectTypes, timelineOptions } from "@/lib/site";
import { TRADES } from "@/lib/lead";

const projectOptions = projectTypes.map((t) => ({ value: t, label: t }));
const tradeOptions = TRADES.map((t) => ({ value: t, label: t }));

/**
 * Trade pages link here with ?trade=plumber and so on. Pre-selecting it
 * saves a tap and, more usefully, means the enquiry records which trade page
 * actually produced it.
 */
const TRADE_FROM_PARAM: Record<string, (typeof TRADES)[number]> = {
  plumber: "Plumber / heating",
  plumbers: "Plumber / heating",
  electrician: "Electrician",
  electricians: "Electrician",
  builder: "Builder",
  builders: "Builder",
  roofer: "Roofer",
  roofers: "Roofer",
};

/**
 * The quote form.
 *
 * Built around who fills it in: a tradesperson on a phone, probably between
 * jobs. Three things follow from that.
 *
 * Budget and timeline are tappable bands rather than text boxes. They are the
 * two questions people are least certain about, and asking them as open text
 * is where a form like this loses people — they guess, leave it blank, or
 * stop. "Not sure yet" is a first-class answer rather than an empty field.
 *
 * Only name and email are required, and everything else says so, so the page
 * reads as two questions with optional detail instead of a seven-field form.
 *
 * It stays one page. A multi-step wizard would hide the length but add taps
 * and a sense of commitment, and there is not enough here to justify either.
 */
export function QuoteForm() {
  const formRef = useRef<HTMLDivElement>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const preset = TRADE_FROM_PARAM[useSearchParams().get("trade") ?? ""] ?? "";
  const { form, status, handleChange, setField, submit } = useLeadForm({
    trade: preset as string,
    town: "",
    website: "",
    name: "",
    email: "",
    phone: "",
    projectType: projectTypes[0],
    budget: "",
    timeline: "",
    details: "",
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const honeypot =
      formRef.current?.querySelector<HTMLInputElement>("#company-website")
        ?.value ?? "";

    const ok = await submit(
      {
        kind: "quote",
        trade: form.trade,
        town: form.town,
        website: form.website,
        name: form.name,
        email: form.email,
        phone: form.phone,
        topic: form.projectType,
        budget: form.budget,
        timeline: form.timeline,
        message: form.details,
      },
      honeypot,
      "Thanks — I'll send over a tailored estimate soon.",
    );

    if (ok) setShowSuccess(true);
  }

  return (
    <>
      <SuccessOverlay
        open={showSuccess}
        heading={"Quote request sent"}
        message={
          "Thanks — I’ve got the details and I’ll put together a fixed price for you."
        }
        onClose={() => setShowSuccess(false)}
      />

      <div ref={formRef}>
        <FormShell onSubmit={handleSubmit}>
          <Honeypot />

          <FormSection step={1} title="Your business">
            <ChoiceGroup
              label="What's your trade?"
              name="trade"
              value={form.trade}
              options={tradeOptions}
              onChange={setField}
              columns={3}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Town or area"
                htmlFor="town"
                hint="Where most of your jobs are."
              >
                <Input
                  id="town"
                  name="town"
                  autoComplete="address-level2"
                  value={form.town}
                  onChange={handleChange}
                  placeholder="e.g. Swansea"
                  required
                />
              </Field>
              <Field
                label="Do you have a website now?"
                htmlFor="website"
                optional
                hint="Paste the address, or leave blank."
              >
                <Input
                  id="website"
                  name="website"
                  type="url"
                  inputMode="url"
                  autoComplete="url"
                  value={form.website}
                  onChange={handleChange}
                  placeholder="e.g. smithplumbing.co.uk"
                />
              </Field>
            </div>
          </FormSection>

          <FormSection step={2} title="What you need">
            <ChoiceGroup
              label="What kind of project is it?"
              name="projectType"
              value={form.projectType}
              options={projectOptions}
              onChange={setField}
              columns={2}
            />
          </FormSection>

          <FormSection step={3} title="Budget and timing">
            <ChoiceGroup
              label="Rough budget"
              name="budget"
              value={form.budget}
              options={budgetBands}
              onChange={setField}
              optional
              columns={2}
              hint="Only a guide — the quote I send back is fixed."
            />
            <ChoiceGroup
              label="When would you like it live?"
              name="timeline"
              value={form.timeline}
              options={timelineOptions}
              onChange={setField}
              optional
              columns={3}
            />
          </FormSection>

          <FormSection step={4} title="How to reach you">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Your name" htmlFor="name">
                <Input
                  id="name"
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field label="Email" htmlFor="email">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </Field>
            </div>

            <Field label="Phone" htmlFor="phone" optional hint="If you would rather I rang you.">
              <Input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={handleChange}
              />
            </Field>

            <Field
              label="Anything else"
              htmlFor="details"
              optional
              hint="The kind of jobs you want more of is the most useful thing to know."
            >
              <Textarea
                id="details"
                name="details"
                rows={4}
                value={form.details}
                onChange={handleChange}
                placeholder="e.g. Mainly boiler installs and servicing, and I'd like fewer small call-outs."
              />
            </Field>
          </FormSection>

          <div className="grid gap-3 border-t border-edge pt-6">
            <Button type="submit" variant="primary" disabled={status.loading}>
              {status.loading ? "Sending…" : "Get my fixed quote"}
            </Button>
            {/* Says what happens next. The old form ended on a bare button,
                which left the obvious question unanswered at the exact moment
                someone decides whether to press it. */}
            <p className="text-center text-sm text-muted">
              I reply within one working day with a fixed price. No obligation,
              and no sales pitch.
            </p>
            <FormStatus error={status.error} />
            <PrivacyNotice />
          </div>
        </FormShell>
      </div>
    </>
  );
}
