"use client";

import { useRef } from "react";
import { Button } from "@/components/Button";
import {
  Field,
  FormShell,
  FormStatus,
  Honeypot,
  Input,
  Textarea,
} from "@/components/Form";
import { useLeadForm } from "@/lib/useLeadForm";

export function ContactForm() {
  const formRef = useRef<HTMLDivElement>(null);
  const { form, status, handleChange, submit } = useLeadForm({
    name: "",
    email: "",
    message: "",
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const honeypot =
      formRef.current?.querySelector<HTMLInputElement>("#company-website")
        ?.value ?? "";

    await submit(
      {
        kind: "contact",
        name: form.name,
        email: form.email,
        message: form.message,
      },
      honeypot,
      "Thanks — I'll get back to you shortly.",
    );
  }

  return (
    <div ref={formRef}>
      <FormShell onSubmit={handleSubmit}>
        <Honeypot />
        <Field label="Name" htmlFor="name">
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
            value={form.email}
            onChange={handleChange}
            required
          />
        </Field>
        <Field label="Message" htmlFor="message">
          <Textarea
            id="message"
            name="message"
            rows={5}
            value={form.message}
            onChange={handleChange}
            required
          />
        </Field>
        <Button type="submit" variant="primary" disabled={status.loading}>
          {status.loading ? "Sending…" : "Send Message"}
        </Button>
        <FormStatus success={status.success} error={status.error} />
      </FormShell>
    </div>
  );
}
