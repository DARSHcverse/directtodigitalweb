-- Join codes replace magic links for client sign-in.
--
-- A client gets one short code when they become a client, and uses it to sign
-- in. No inbox round trip, nothing to expire mid-session, and nothing for a
-- tradesperson to lose track of.
--
-- The code is stored hashed, not in plain text. A readable column would mean
-- anyone with a database view — a leaked backup, a support session, a future
-- RLS mistake — could sign in as any client.

create extension if not exists pgcrypto;

alter table clients
  add column join_code_hash  text,
  add column join_code_set_at timestamptz,
  add column join_code_last_used_at timestamptz;

-- Hashed lookup needs an index: sign-in searches by hash, not by client id.
create index clients_join_code_idx
  on clients (join_code_hash)
  where join_code_hash is not null and deleted_at is null;

-- ─────────────────────────────────────────────────────────────
-- Brute-force protection
-- ─────────────────────────────────────────────────────────────
-- A short code is guessable given enough attempts, so attempts are recorded
-- and throttled. Without this, an eight-character code is a weekend's work
-- for a script.

create table join_code_attempts (
  id          bigserial primary key,
  created_at  timestamptz not null default now(),
  ip_hash     text not null,
  succeeded   boolean not null default false
);

create index join_code_attempts_idx
  on join_code_attempts (ip_hash, created_at desc);

alter table join_code_attempts enable row level security;
revoke all on join_code_attempts from anon, authenticated;

-- Counts failures from one source in the last 15 minutes. The sign-in route
-- refuses once this passes its threshold.
create or replace function recent_join_failures(p_ip_hash text)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)::integer
    from public.join_code_attempts
   where ip_hash = p_ip_hash
     and succeeded = false
     and created_at > now() - interval '15 minutes';
$$;

revoke execute on function recent_join_failures(text) from public, anon, authenticated;

-- ─────────────────────────────────────────────────────────────
-- Issue and verify
-- ─────────────────────────────────────────────────────────────

-- Stores the hash of a code the application generated. The plain code is
-- returned to the owner once, to send on, and never persisted.
create or replace function set_join_code(p_client_id uuid, p_code text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.clients
     set join_code_hash = crypt(p_code, gen_salt('bf', 10)),
         join_code_set_at = now(),
         join_code_last_used_at = null
   where id = p_client_id
     and deleted_at is null;
end;
$$;

revoke execute on function set_join_code(uuid, text) from public, anon, authenticated;

-- Returns the matching client id, or null.
--
-- Every candidate row is compared rather than looked up directly, because
-- bcrypt salts each hash: the same code hashes differently per client, so
-- there is nothing to index-seek on. Fine at this scale, and the index above
-- keeps the candidate set to clients who actually have a code.
create or replace function verify_join_code(p_code text)
returns uuid
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_id uuid;
begin
  select c.id into v_id
    from public.clients c
   where c.join_code_hash is not null
     and c.deleted_at is null
     and c.portal_enabled
     and c.join_code_hash = crypt(p_code, c.join_code_hash)
   limit 1;

  return v_id;
end;
$$;

revoke execute on function verify_join_code(text) from public, anon, authenticated;

comment on column clients.join_code_hash is
  'bcrypt hash of the client join code. Never store the plain code.';
