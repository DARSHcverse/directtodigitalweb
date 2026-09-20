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
import { services } from "@/lib/site";

export function BookingForm() {
  const formRef = useRef<HTMLDivElement>(null);
  const { form, status, handleChange, submit } = useLeadForm({
    fullName: "",
    email: "",
    phone: "",
    service: services[0],
    message: "",
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const honeypot =
      formRef.current?.querySelector<HTMLInputElement>("#company-website")
        ?.value ?? "";

    await submit(
      {
        kind: "booking",
        name: form.fullName,
        email: form.email,
        phone: form.phone,
        topic: form.service,
        message: form.message,
      },
      honeypot,
      "Thanks — I'll confirm by email shortly.",
    );
  }

  return (
    <div ref={formRef}>
      <FormShell onSubmit={handleSubmit}>
        <Honeypot />
        <Field label="Full name" htmlFor="fullName">
          <Input id="fullName" name="fullName" autoComplete="name" value={form.fullName} onChange={handleChange} required />
        </Field>
        <Field label="Email" htmlFor="email">
          <Input id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} required />
        </Field>
        <Field label="Phone number" htmlFor="phone">
          <Input id="phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={handleChange} />
        </Field>
        <Field label="Service" htmlFor="service">
          <Select id="service" name="service" value={form.service} onChange={handleChange}>
            {services.map((service) => (
              <option key={service}>{service}</option>
            ))}
          </Select>
        </Field>
        <Field label="Notes" htmlFor="message">
          <Textarea id="message" name="message" rows={4} value={form.message} onChange={handleChange} />
        </Field>
        <Button type="submit" variant="primary" disabled={status.loading}>
          {status.loading ? "Sending…" : "Request Booking"}
        </Button>
        <FormStatus success={status.success} error={status.error} />
      </FormShell>
    </div>
  );
}
