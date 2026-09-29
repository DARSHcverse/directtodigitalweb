-- Distinguishes the owner from portal clients.
--
-- Both sign in through the same Supabase Auth instance, so "is this the
-- owner?" has to be a fact in the database rather than an assumption about
-- which login form was used. Without this, anyone who registers could reach
-- owner-only data by pointing a session at the admin routes.

create table owner_accounts (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  created_at  timestamptz not null default now()
);

alter table owner_accounts enable row level security;

-- No policies: the table is unreadable through the Data API, and only the
-- service role touches it.
revoke all on owner_accounts from anon, authenticated;

create or replace function is_owner()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.owner_accounts
     where user_id = (select auth.uid())
       and (select auth.uid()) is not null
  );
$$;

revoke execute on function is_owner() from public, anon;
grant execute on function is_owner() to authenticated;
