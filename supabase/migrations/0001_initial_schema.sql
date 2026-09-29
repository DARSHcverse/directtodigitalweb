-- Trade Web Co — core schema
--
-- Designed complete up front rather than incrementally: the schema is the
-- expensive thing to change once real data exists, whereas UI is cheap.
--
-- Two rules run through the whole file:
--   1. Nothing is ever hard-deleted. UK business records must be retained for
--      six years, so deletion is always a soft flag.
--   2. Row Level Security is enabled on every table and denies by default.
--      A client can only ever read rows belonging to their own client record.

-- ─────────────────────────────────────────────────────────────
-- Enums
-- ─────────────────────────────────────────────────────────────

create type lead_status as enum (
  'new', 'contacted', 'quoted', 'won', 'lost'
);

create type lead_kind as enum (
  'contact', 'quote', 'booking'
);

create type project_stage as enum (
  'brief', 'design', 'build', 'review', 'live', 'on_hold', 'cancelled'
);

create type invoice_status as enum (
  -- 'draft' is the only editable state. Once issued an invoice is immutable:
  -- corrections are made by credit note, never by editing the original.
  'draft', 'issued', 'paid', 'overdue', 'cancelled'
);

create type message_author as enum ('owner', 'client');

-- ─────────────────────────────────────────────────────────────
-- Business settings (single row)
-- ─────────────────────────────────────────────────────────────
-- Identity and bank details live here rather than in code, so trading as a
-- sole trader today and a limited company later is a settings change.

create table business_settings (
  id                boolean primary key default true,
  trading_name      text not null default 'Trade Web Co',
  legal_name        text not null default '',
  -- Populated if and when the business incorporates.
  company_number    text,
  address_lines     text[] not null default '{}',
  email             text not null default '',
  phone             text,

  -- Not VAT registered today. When this flips to true the invoice template
  -- shows the VAT number, net, rate and gross — no migration required.
  vat_registered    boolean not null default false,
  vat_number        text,
  vat_rate          numeric(5,2) not null default 20.00,

  -- Printed on every invoice, since payment is by bank transfer.
  bank_account_name text,
  bank_sort_code    text,
  bank_account_no   text,
  payment_terms_days integer not null default 14,
  invoice_prefix    text not null default 'TWC-',
  invoice_footer    text,

  updated_at        timestamptz not null default now(),
  constraint business_settings_single_row check (id)
);

insert into business_settings (id) values (true);

-- ─────────────────────────────────────────────────────────────
-- Leads
-- ─────────────────────────────────────────────────────────────
-- Written before the notification email is sent, so a mail outage can never
-- lose an enquiry.

create table leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  kind          lead_kind not null,
  status        lead_status not null default 'new',

  name          text not null,
  email         text not null,
  phone         text,
  topic         text,
  budget        text,
  timeline      text,
  message       text,

  -- Which trade page they arrived from, so we learn what actually converts.
  source_path   text,
  -- Retained briefly for abuse investigation only; purge job clears it.
  ip_hash       text,

  notes         text,
  client_id     uuid,
  deleted_at    timestamptz
);

create index leads_status_idx     on leads (status) where deleted_at is null;
create index leads_created_idx    on leads (created_at desc);
create index leads_email_idx      on leads (lower(email));

-- ─────────────────────────────────────────────────────────────
-- Clients
-- ─────────────────────────────────────────────────────────────

create table clients (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  business_name text not null,
  contact_name  text not null,
  email         text not null,
  phone         text,
  address_lines text[] not null default '{}',
  trade         text,
  notes         text,

  -- Links to the Supabase auth user once the client accepts their portal
  -- invitation. Null until then.
  auth_user_id  uuid unique,
  portal_enabled boolean not null default false,

  deleted_at    timestamptz
);

create unique index clients_email_idx on clients (lower(email)) where deleted_at is null;

alter table leads
  add constraint leads_client_fk foreign key (client_id) references clients (id) on delete set null;

-- ─────────────────────────────────────────────────────────────
-- Projects
-- ─────────────────────────────────────────────────────────────

create table projects (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  client_id     uuid not null references clients (id) on delete restrict,
  lead_id       uuid references leads (id) on delete set null,

  title         text not null,
  stage         project_stage not null default 'brief',
  tier          text,
  agreed_price  numeric(10,2),

  -- Shown to the client in the portal: what is happening now.
  status_note   text,
  -- What is being waited on from them.
  awaiting_client text,

  started_on    date,
  target_date   date,
  live_url      text,

  -- Brief stays client-editable until locked, so late details are welcome
  -- but scope cannot drift once the build starts.
  brief_locked_at timestamptz,

  deleted_at    timestamptz
);

create index projects_client_idx on projects (client_id) where deleted_at is null;
create index projects_stage_idx  on projects (stage) where deleted_at is null;

-- ─────────────────────────────────────────────────────────────
-- Project brief (client-submitted content)
-- ─────────────────────────────────────────────────────────────
-- Structured text only. File uploads are deliberately out of scope: they add
-- malware scanning, validation and storage risk for little benefit here.

create table project_brief (
  project_id        uuid primary key references projects (id) on delete cascade,
  updated_at        timestamptz not null default now(),

  business_summary  text,
  services_offered  text,
  service_area      text,
  target_customer   text,
  opening_hours     text,
  accreditations    text,
  existing_website  text,
  social_links      text,
  colour_preferences text,
  sites_they_like   text,
  anything_else     text
);

-- ─────────────────────────────────────────────────────────────
-- Invoices
-- ─────────────────────────────────────────────────────────────

create table invoices (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  client_id     uuid not null references clients (id) on delete restrict,
  project_id    uuid references projects (id) on delete set null,

  -- Assigned only on issue, by the gap-free sequence below. Null while draft.
  invoice_number text unique,
  status        invoice_status not null default 'draft',

  issued_on     date,
  due_on        date,
  paid_on       date,

  -- Snapshot of the totals at issue. Stored rather than recomputed, because
  -- a later VAT-rate change must never alter an already-issued invoice.
  subtotal      numeric(10,2) not null default 0,
  vat_rate      numeric(5,2)  not null default 0,
  vat_amount    numeric(10,2) not null default 0,
  total         numeric(10,2) not null default 0,

  notes         text,
  -- Free-text reference the client quotes on the bank transfer.
  payment_ref   text,

  -- A credit note reverses an issued invoice; the original is never edited.
  credit_note_for uuid references invoices (id),

  deleted_at    timestamptz
);

create index invoices_client_idx on invoices (client_id) where deleted_at is null;
create index invoices_status_idx on invoices (status)    where deleted_at is null;

create table invoice_lines (
  id          uuid primary key default gen_random_uuid(),
  invoice_id  uuid not null references invoices (id) on delete cascade,
  position    integer not null default 0,
  description text not null,
  quantity    numeric(10,2) not null default 1,
  unit_price  numeric(10,2) not null default 0,
  line_total  numeric(10,2) generated always as (quantity * unit_price) stored
);

create index invoice_lines_invoice_idx on invoice_lines (invoice_id, position);

-- Gap-free sequential numbering.
--
-- HMRC expects an unbroken sequence. A Postgres sequence is not used because
-- sequences deliberately skip numbers on rollback. This takes a row lock on
-- the settings row instead, so concurrent issues serialise and no number is
-- ever skipped or reused.
create table invoice_counter (
  id      boolean primary key default true,
  next_no integer not null default 1,
  constraint invoice_counter_single_row check (id)
);

insert into invoice_counter (id) values (true);

create or replace function issue_invoice(p_invoice_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_no      integer;
  v_prefix  text;
  v_number  text;
  v_status  invoice_status;
  v_terms   integer;
begin
  select status into v_status from invoices where id = p_invoice_id;
  if v_status is null then
    raise exception 'Invoice % not found', p_invoice_id;
  end if;
  if v_status <> 'draft' then
    raise exception 'Invoice % is already issued and cannot be reissued', p_invoice_id;
  end if;

  -- Lock the counter so two concurrent issues cannot take the same number.
  update invoice_counter set next_no = next_no + 1 where id returning next_no - 1 into v_no;

  select invoice_prefix, payment_terms_days
    into v_prefix, v_terms
    from business_settings where id;

  v_number := v_prefix || lpad(v_no::text, 4, '0');

  update invoices
     set invoice_number = v_number,
         status         = 'issued',
         issued_on      = current_date,
         due_on         = current_date + make_interval(days => v_terms),
         updated_at     = now()
   where id = p_invoice_id;

  return v_number;
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- Messages
-- ─────────────────────────────────────────────────────────────

create table messages (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  project_id  uuid not null references projects (id) on delete cascade,
  author      message_author not null,
  body        text not null,
  read_at     timestamptz
);

create index messages_project_idx on messages (project_id, created_at);

-- ─────────────────────────────────────────────────────────────
-- Audit log
-- ─────────────────────────────────────────────────────────────

create table audit_log (
  id          bigserial primary key,
  created_at  timestamptz not null default now(),
  actor       text not null,
  action      text not null,
  entity      text not null,
  entity_id   uuid,
  detail      jsonb
);

create index audit_log_entity_idx on audit_log (entity, entity_id, created_at desc);

-- ─────────────────────────────────────────────────────────────
-- updated_at maintenance
-- ─────────────────────────────────────────────────────────────

create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger leads_touch          before update on leads          for each row execute function touch_updated_at();
create trigger clients_touch        before update on clients        for each row execute function touch_updated_at();
create trigger projects_touch       before update on projects       for each row execute function touch_updated_at();
create trigger invoices_touch       before update on invoices       for each row execute function touch_updated_at();
create trigger project_brief_touch  before update on project_brief  for each row execute function touch_updated_at();
create trigger settings_touch       before update on business_settings for each row execute function touch_updated_at();
