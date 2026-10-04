-- Track when an invoice was last emailed to the client.
--
-- Issuing already sent the email, but silently: nothing recorded whether it
-- went, so there was no way to tell a delivered invoice from one that failed
-- while Resend was misconfigured — and no way to resend without re-issuing,
-- which is impossible once a number is assigned.
--
-- Nullable: invoices issued before this migration have no send recorded, and
-- a null reads correctly as "not known to have been sent".

alter table invoices
  add column sent_at timestamptz,
  add column sent_to text;

comment on column invoices.sent_at is
  'When the invoice was last emailed. Null means never sent, or sent before this was tracked.';

comment on column invoices.sent_to is
  'Address the invoice was last sent to. Stored because the client''s email may change afterwards, and the audit trail should show where it actually went.';
