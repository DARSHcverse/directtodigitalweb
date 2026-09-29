/**
 * The questions a client answers about their business.
 *
 * Kept out of data.ts, which is server-only: the brief form is a client
 * component and needs these to render the fields.
 */
export const BRIEF_FIELDS = [
  {
    name: "business_summary",
    label: "What does your business do?",
    hint: "A few sentences in your own words.",
    rows: 3,
  },
  {
    name: "services_offered",
    label: "What services do you offer?",
    hint: "List them — these usually become pages.",
    rows: 3,
  },
  {
    name: "service_area",
    label: "Where do you work?",
    hint: "Towns or radius you cover.",
    rows: 2,
  },
  {
    name: "target_customer",
    label: "Who are your customers?",
    hint: "Homeowners, landlords, businesses?",
    rows: 2,
  },
  {
    name: "opening_hours",
    label: "Opening hours",
    hint: "Including whether you take emergency callouts.",
    rows: 2,
  },
  {
    name: "accreditations",
    label: "Accreditations and insurance",
    hint: "Gas Safe, NICEIC, Part P, public liability — with numbers.",
    rows: 2,
  },
  {
    name: "existing_website",
    label: "Existing website or listings",
    hint: "Anything already online, including Checkatrade or Facebook.",
    rows: 2,
  },
  { name: "social_links", label: "Social media", hint: "", rows: 2 },
  {
    name: "colour_preferences",
    label: "Colours and style",
    hint: "Anything you like or want avoided.",
    rows: 2,
  },
  {
    name: "sites_they_like",
    label: "Websites you like",
    hint: "Competitors or any site at all — tell me what you like about them.",
    rows: 2,
  },
  { name: "anything_else", label: "Anything else", hint: "", rows: 3 },
] as const;
