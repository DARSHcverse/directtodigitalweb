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
  /** Quote: the visitor's trade, from a fixed list. Required for quotes. */
  trade: z.string().trim().max(60).optional().or(z.literal("")),
  /** Quote: town or postcode area. Required for quotes. */
  town: z.string().trim().max(80).optional().or(z.literal("")),
  /** Quote: their current website, if they have one. */
  website: z.string().trim().max(300).optional().or(z.literal("")),
  /**
   * Where the visit came from, captured on the first page of the session and
   * carried to the form. Lets a channel test (a flyer, a referral partner) be
   * judged by enquiries rather than guesswork. No cookies are involved.
   */
  ref: z.string().trim().max(80).optional().or(z.literal("")),
  utmSource: z.string().trim().max(80).optional().or(z.literal("")),
  utmMedium: z.string().trim().max(80).optional().or(z.literal("")),
  utmCampaign: z.string().trim().max(80).optional().or(z.literal("")),
  landingPage: z.string().trim().max(200).optional().or(z.literal("")),
  referrer: z.string().trim().max(300).optional().or(z.literal("")),
  /** Honeypot. Accepted by the schema so the route can absorb bot traffic
   *  silently with a 200 — rejecting here would tell a bot which field tripped. */
  companyWebsite: z.string().max(200).optional(),
});

/**
 * Trade and town are what make an enquiry quotable, and the form itself said
 * so while leaving them in an optional free-text box. Required for quotes,
 * enforced here as well as in the browser so the rule cannot drift.
 */
export const leadSchemaChecked = leadSchema.superRefine((lead, ctx) => {
  if (lead.kind !== "quote") return;
  if (!lead.trade) {
    ctx.addIssue({ code: "custom", path: ["trade"], message: "Please choose your trade" });
  }
  if (!lead.town || lead.town.length < 2) {
    ctx.addIssue({ code: "custom", path: ["town"], message: "Please enter your town or area" });
  }
});

export type LeadInput = z.infer<typeof leadSchema>;

/** Choices for the quote form's trade question. */
export const TRADES = [
  "Plumber / heating",
  "Electrician",
  "Builder",
  "Roofer",
  "Other trade",
  "Not a trade business",
] as const;

export const leadKindLabel: Record<LeadInput["kind"], string> = {
  contact: "Contact enquiry",
  quote: "Quote request",
  booking: "Booking request",
};
