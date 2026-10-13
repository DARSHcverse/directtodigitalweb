-- Qualify enquiries and record where they came from.
--
-- Trade and town decide whether an enquiry can be quoted at all, and were
-- only ever captured in free text, if at all. The source columns let a
-- channel test — a trade-counter flyer, an accountant referral — be judged
-- by the enquiries it produced rather than by guesswork.
--
-- All nullable: rows from before this migration have none of it, and the
-- contact form does not ask for trade or town.

alter table leads
  add column trade           text,
  add column town            text,
  add column current_website text,
  add column ref             text,
  add column utm_source      text,
  add column utm_medium      text,
  add column utm_campaign    text,
  add column landing_page    text,
  add column referrer        text;

-- Weekly counts by channel and by trade: the numbers the review asked for.
--
-- security_invoker so the view applies the caller's permissions and RLS
-- rather than its owner's; a plain view would bypass RLS on leads.
create or replace view lead_sources_weekly
with (security_invoker = true) as
select
  date_trunc('week', created_at)::date as week,
  coalesce(ref, utm_source, 'direct')  as source,
  coalesce(trade, 'unknown')           as trade,
  count(*)                             as enquiries
from leads
where deleted_at is null
group by 1, 2, 3
order by 1 desc, 4 desc;

-- Supabase grants new objects in public to the API roles by default. Leads
-- are service-role only, so the view is too.
revoke all on lead_sources_weekly from anon, authenticated;
