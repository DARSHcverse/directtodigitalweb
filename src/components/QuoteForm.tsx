"use client";

import { useRef } from "react";
import { Button } from "@/components/Button";
import {
  Field,
  FormShell,
  FormStatus,
  Honeypot,
  Input,
  Select,
  Textarea,
} from "@/components/Form";
import { useLeadForm } from "@/lib/useLeadForm";
import { projectTypes } from "@/lib/site";

export function QuoteForm() {
  const formRef = useRef<HTMLDivElement>(null);
  const { form, status, handleChange, submit } = useLeadForm({
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

    await submit(
      {
        kind: "quote",
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
  }

  return (
    <div ref={formRef}>
      <FormShell onSubmit={handleSubmit}>
        <Honeypot />
        <Field label="Name" htmlFor="name">
          <Input id="name" name="name" autoComplete="name" value={form.name} onChange={handleChange} required />
        </Field>
        <Field label="Email" htmlFor="email">
          <Input id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} required />
        </Field>
        <Field label="Phone number" htmlFor="phone">
          <Input id="phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={handleChange} />
        </Field>
        <Field label="Project type" htmlFor="projectType">
          <Select id="projectType" name="projectType" value={form.projectType} onChange={handleChange}>
            {projectTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </Select>
        </Field>
        <Field label="Budget (GBP)" htmlFor="budget" hint="A rough range is fine.">
          <Input id="budget" name="budget" value={form.budget} onChange={handleChange} placeholder="e.g. £1,000–£3,000" />
        </Field>
        <Field label="Timeline" htmlFor="timeline">
          <Input id="timeline" name="timeline" value={form.timeline} onChange={handleChange} placeholder="e.g. 4–6 weeks" />
        </Field>
        <Field label="Project details" htmlFor="details">
          <Textarea id="details" name="details" rows={5} value={form.details} onChange={handleChange} />
        </Field>
        <Button type="submit" variant="primary" disabled={status.loading}>
          {status.loading ? "Sending…" : "Get Estimate"}
        </Button>
        <FormStatus success={status.success} error={status.error} />
      </FormShell>
    </div>
  );
}
