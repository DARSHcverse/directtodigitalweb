# Database

Supabase (Postgres). Migrations in `migrations/`, applied in filename order.

## Setup

1. Create a project at supabase.com, then copy Project Settings → API into
   `.env.local`: the URL, the anon key, and the service-role key.
2. Run each file in `migrations/` in the SQL editor, in order:
   `0001_initial_schema.sql`, `0002_rls_policies.sql`, `0003_grants.sql`.
3. Restart `npm run dev`.

Until these are set the site runs normally and leads fall back to email only.

## Rules worth keeping

- **Nothing is hard-deleted.** UK business records must be kept for six years,
  so every table uses a `deleted_at` flag instead.
- **Issued invoices are immutable.** `issue_invoice()` assigns the number and
  freezes the totals; corrections are made with a credit note, never by
  editing the original. Totals are stored rather than recomputed so a later
  VAT change cannot alter an invoice already sent.
- **Invoice numbers must not have gaps.** A Postgres sequence is not used
  because sequences skip numbers on rollback; the counter row is locked
  instead so concurrent issues serialise.
- **Grants and RLS are different things.** RLS decides which *rows* a role
  sees; a Postgres `grant` decides whether it can reach the table at all.
  Without `0003_grants.sql` a correct policy still fails with a permissions
  error, so both are required.
- **RLS helper calls are wrapped in `(select ...)`.** Calling
  `current_client_id()` bare makes Postgres re-evaluate it once per row;
  wrapping evaluates it once per statement.
- **RLS denies by default.** Client access is scoped through
  `clients.auth_user_id`, so isolation holds even if application code forgets
  a `where` clause. The service-role key bypasses RLS and must stay server-side.
