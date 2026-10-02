-- PDF attachments on project messages.
--
-- PDFs only, by decision: it covers what trades actually send (certificates,
-- existing invoices, plans, quotes from elsewhere) while keeping storage
-- predictable and removing the image-processing surface entirely.
--
-- The bucket is private. Files are reached through short-lived signed URLs
-- generated per request after an ownership check, so a leaked path is not a
-- leaked file.

create table attachments (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),

  project_id   uuid not null references projects (id) on delete cascade,
  -- Null when the owner attaches something outside a message.
  message_id   uuid references messages (id) on delete cascade,

  -- Path inside the storage bucket. Never rendered directly to a browser;
  -- always exchanged for a signed URL first.
  storage_path text not null unique,

  -- The name as uploaded, for display. Kept separate from storage_path so a
  -- hostile filename cannot influence where the file is written.
  file_name    text not null,
  byte_size    integer not null,
  uploaded_by  message_author not null,

  deleted_at   timestamptz
);

create index attachments_project_idx
  on attachments (project_id, created_at desc)
  where deleted_at is null;

create index attachments_message_idx
  on attachments (message_id)
  where deleted_at is null;

alter table attachments enable row level security;

-- Clients may list their own project's attachments, and nothing else. The
-- file itself still requires a signed URL.
create policy attachments_select_own on attachments
  for select using (
    project_id in (
      select id from projects where client_id = (select current_client_id())
    )
    and deleted_at is null
  );

grant select on attachments to authenticated;
revoke all on attachments from anon;

-- Uploads go through a server action using the service role, so clients get
-- no insert policy: a direct write would bypass the type and size checks.

comment on table attachments is
  'PDF uploads against project messages. Bucket is private; access is via short-lived signed URLs after an ownership check.';
