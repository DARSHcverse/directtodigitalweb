/**
 * Hand-written row types mirroring supabase/migrations.
 *
 * Kept in step with the SQL by hand rather than generated, so the schema stays
 * readable in one place. If you change a migration, change this too.
 */

export type LeadStatus = "new" | "contacted" | "quoted" | "won" | "lost";
export type LeadKind = "contact" | "quote" | "booking";
export type ProjectStage =
  | "brief" | "design" | "build" | "review" | "live" | "on_hold" | "cancelled";
export type InvoiceStatus =
  | "draft" | "issued" | "paid" | "overdue" | "cancelled";
export type MessageAuthor = "owner" | "client";

export type Lead = {
  id: string;
  created_at: string;
  updated_at: string;
  kind: LeadKind;
  status: LeadStatus;
  name: string;
  email: string;
  phone: string | null;
  topic: string | null;
  budget: string | null;
  timeline: string | null;
  message: string | null;
  source_path: string | null;
  ip_hash: string | null;
  notes: string | null;
  client_id: string | null;
  deleted_at: string | null;
};

export type Client = {
  id: string;
  created_at: string;
  updated_at: string;
  business_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  address_lines: string[];
  trade: string | null;
  notes: string | null;
  auth_user_id: string | null;
  portal_enabled: boolean;
  deleted_at: string | null;
};

export type Project = {
  id: string;
  created_at: string;
  updated_at: string;
  client_id: string;
  lead_id: string | null;
  title: string;
  stage: ProjectStage;
  tier: string | null;
  agreed_price: number | null;
  status_note: string | null;
  awaiting_client: string | null;
  started_on: string | null;
  target_date: string | null;
  live_url: string | null;
  brief_locked_at: string | null;
  deleted_at: string | null;
};

export type ProjectBrief = {
  project_id: string;
  updated_at: string;
  business_summary: string | null;
  services_offered: string | null;
  service_area: string | null;
  target_customer: string | null;
  opening_hours: string | null;
  accreditations: string | null;
  existing_website: string | null;
  social_links: string | null;
  colour_preferences: string | null;
  sites_they_like: string | null;
  anything_else: string | null;
};

export type Invoice = {
  id: string;
  created_at: string;
  updated_at: string;
  client_id: string;
  project_id: string | null;
  invoice_number: string | null;
  status: InvoiceStatus;
  issued_on: string | null;
  due_on: string | null;
  paid_on: string | null;
  subtotal: number;
  vat_rate: number;
  vat_amount: number;
  total: number;
  notes: string | null;
  payment_ref: string | null;
  credit_note_for: string | null;
  deleted_at: string | null;
};

export type InvoiceLine = {
  id: string;
  invoice_id: string;
  position: number;
  description: string;
  quantity: number;
  unit_price: number;
  line_total: number;
};

export type Message = {
  id: string;
  created_at: string;
  project_id: string;
  author: MessageAuthor;
  body: string;
  read_at: string | null;
};

export type BusinessSettings = {
  id: boolean;
  trading_name: string;
  legal_name: string;
  company_number: string | null;
  address_lines: string[];
  email: string;
  phone: string | null;
  vat_registered: boolean;
  vat_number: string | null;
  vat_rate: number;
  bank_account_name: string | null;
  bank_sort_code: string | null;
  bank_account_no: string | null;
  payment_terms_days: number;
  invoice_prefix: string;
  invoice_footer: string | null;
  updated_at: string;
};
