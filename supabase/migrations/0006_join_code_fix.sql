-- Qualify the pgcrypto calls.
--
-- 0005 declared these functions with `search_path = ''`, which is correct for
-- SECURITY DEFINER — it stops a caller shadowing a table name. But pgcrypto
-- is installed in the `extensions` schema on Supabase, not public, so bare
-- crypt() and gen_salt() could not be resolved.
--
-- The failure was silent rather than loud: set_join_code's UPDATE matched no
-- rows and returned void, so the code appeared to be issued while join_code_hash
-- stayed null and every sign-in attempt was rejected.

create or replace function set_join_code(p_client_id uuid, p_code text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.clients
     set join_code_hash = extensions.crypt(
           p_code,
           extensions.gen_salt('bf', 10)
         ),
         join_code_set_at = now(),
         join_code_last_used_at = null
   where id = p_client_id
     and deleted_at is null;

  -- Loud rather than silent: a code that was never stored must not look
  -- like a code that was sent.
  if not found then
    raise exception 'No active client with id %', p_client_id;
  end if;
end;
$$;

revoke execute on function set_join_code(uuid, text) from public, anon, authenticated;

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
     and c.join_code_hash = extensions.crypt(p_code, c.join_code_hash)
   limit 1;

  return v_id;
end;
$$;

revoke execute on function verify_join_code(text) from public, anon, authenticated;
