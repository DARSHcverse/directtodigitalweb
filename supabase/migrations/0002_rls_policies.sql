-- Row Level Security.
--
-- Every table denies by default. Client access is granted narrowly and is
-- always scoped through clients.auth_user_id, so isolation is enforced by the
-- database rather than by remembering to filter in application code — a
-- forgotten `where client_id = ...` then leaks nothing.
--
-- The owner's admin uses the service-role key, which bypasses RLS entirely.
-- That key must never reach the browser.

alter table business_settings enable row level security;
alter table leads             enable row level security;
alter table clients           enable row level security;
alter table projects          enable row level security;
alter table project_brief     enable row level security;
alter table invoices          enable row level security;
alter table invoice_lines     enable row level security;
alter table messages          enable row level security;
alter table audit_log         enable row level security;

-- Resolves the signed-in user to their client row. Stable so the planner can
-- cache it per statement.
-- SECURITY DEFINER bypasses RLS on the tables it reads, which is the point —
-- it resolves the caller's client row without recursing into the policies
-- that depend on it. The auth.uid() check inside the body is what keeps that
-- safe: an unauthenticated caller resolves to null and every policy fails.
create or replace function current_client_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select c.id
    from public.clients c
   where c.auth_user_id = (select auth.uid())
     and (select auth.uid()) is not null
     and c.deleted_at is null
     and c.portal_enabled
   limit 1;
$$;

-- Only signed-in users ever need this; nothing else should call it directly.
revoke execute on function current_client_id() from public, anon;
grant execute on function current_client_id() to authenticated;

-- ── Clients ──────────────────────────────────────────────────
-- A client may read only their own record, and may never create or delete one.

create policy clients_select_own on clients
  for select using (id = (select current_client_id()));

create policy clients_update_own on clients
  for update using (id = (select current_client_id()))
  with check (id = (select current_client_id()));

-- ── Projects ─────────────────────────────────────────────────
-- Read-only to clients: stage and status are set by the owner.

create policy projects_select_own on projects
  for select using (client_id = (select current_client_id()) and deleted_at is null);

-- ── Project brief ────────────────────────────────────────────
-- Writable by the client until the owner locks it.

create policy brief_select_own on project_brief
  for select using (
    project_id in (select id from projects where client_id = (select current_client_id()))
  );

create policy brief_insert_own on project_brief
  for insert with check (
    project_id in (
      select id from projects
       where client_id = (select current_client_id())
         and brief_locked_at is null
         and deleted_at is null
    )
  );

create policy brief_update_own on project_brief
  for update using (
    project_id in (
      select id from projects
       where client_id = (select current_client_id())
         and brief_locked_at is null
         and deleted_at is null
    )
  );

-- ── Invoices ─────────────────────────────────────────────────
-- Read-only, and drafts stay hidden until issued.

create policy invoices_select_own on invoices
  for select using (
    client_id = (select current_client_id())
    and deleted_at is null
    and status <> 'draft'
  );

create policy invoice_lines_select_own on invoice_lines
  for select using (
    invoice_id in (
      select id from invoices
       where client_id = (select current_client_id())
         and deleted_at is null
         and status <> 'draft'
    )
  );

-- ── Messages ─────────────────────────────────────────────────
-- A client may read the thread on their project and post as 'client' only —
-- the author check stops anyone forging a message attributed to the owner.

create policy messages_select_own on messages
  for select using (
    project_id in (select id from projects where client_id = (select current_client_id()))
  );

create policy messages_insert_own on messages
  for insert with check (
    author = 'client'
    and project_id in (
      select id from projects
       where client_id = (select current_client_id())
         and deleted_at is null
    )
  );

-- ── Deny-by-default elsewhere ────────────────────────────────
-- leads, business_settings and audit_log carry no client policies at all, so
-- RLS denies every client request against them. Only the service role reads
-- these.
