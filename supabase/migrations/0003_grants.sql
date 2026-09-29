-- Data API grants.
--
-- RLS decides which ROWS a role can see. It does not decide whether the role
-- can reach the table at all — that is a plain Postgres grant, and without it
-- a correctly-written RLS policy still fails with a permissions error.
--
-- Only the tables the client portal genuinely needs are exposed. leads,
-- business_settings, invoice_counter and audit_log are deliberately omitted:
-- they are reached solely through the service role, which bypasses both
-- grants and RLS.

grant usage on schema public to anon, authenticated;

-- Read-only for the signed-in client. RLS narrows these to their own rows.
grant select on clients        to authenticated;
grant select on projects       to authenticated;
grant select on invoices       to authenticated;
grant select on invoice_lines  to authenticated;

-- The brief is client-editable until the owner locks it.
grant select, insert, update on project_brief to authenticated;

-- Clients may read the thread and add to it, but never edit or delete what
-- has already been said — by either party.
grant select, insert on messages to authenticated;

-- Signed-out visitors get nothing. Public form submissions go through the
-- service role in /api/lead, not through the Data API.
revoke all on clients        from anon;
revoke all on projects       from anon;
revoke all on invoices       from anon;
revoke all on invoice_lines  from anon;
revoke all on project_brief  from anon;
revoke all on messages       from anon;
revoke all on leads          from anon, authenticated;
revoke all on business_settings from anon, authenticated;
revoke all on invoice_counter   from anon, authenticated;
revoke all on audit_log         from anon, authenticated;

-- Future tables default to no access rather than inheriting a grant by
-- accident, so adding a table cannot silently expose it.
alter default privileges in schema public revoke all on tables from anon, authenticated;
