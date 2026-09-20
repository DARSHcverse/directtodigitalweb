import { z } from "zod";

/**
 * One schema for all three lead forms (contact, quote, booking).
 * Shared by the client and the /api/lead route so validation cannot drift.
 */
export const leadSchema = z.object({
  kind: z.enum(["contact", "quote", "booking"]),
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.email("Please enter a valid email address").max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  /** Quote: project type. Booking: service. Unused for contact. */
  topic: z.string().trim().max(80).optional().or(z.literal("")),
  /** Quote only, in GBP. */
  budget: z.string().trim().max(80).optional().or(z.literal("")),
  /** Quote only. */
  timeline: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().max(5000).optional().or(z.literal("")),
  /** Honeypot. Accepted by the schema so the route can absorb bot traffic
   *  silently with a 200 — rejecting here would tell a bot which field tripped. */
  companyWebsite: z.string().max(200).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const leadKindLabel: Record<LeadInput["kind"], string> = {
  contact: "Contact enquiry",
  quote: "Quote request",
  booking: "Booking request",
};
