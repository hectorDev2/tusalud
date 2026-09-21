-- TuSalud — user bug reports with private image attachments.

create type public.bug_report_status as enum ('open', 'in_progress', 'resolved', 'closed');
create type public.bug_report_priority as enum ('low', 'normal', 'high', 'critical');

create table public.bug_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  priority public.bug_report_priority not null default 'normal',
  status public.bug_report_status not null default 'open',
  page_url text,
  user_agent text,
  error_context jsonb,
  attachment_path text,
  attachment_name text,
  attachment_mime_type text,
  attachment_size integer,
  admin_notes text,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bug_reports_title_length check (char_length(title) between 3 and 160),
  constraint bug_reports_description_length check (char_length(description) between 10 and 10000),
  constraint bug_reports_attachment_size check (attachment_size is null or attachment_size <= 5242880)
);

create index idx_bug_reports_status_created
  on public.bug_reports(status, created_at desc);

create index idx_bug_reports_reporter
  on public.bug_reports(reporter_id, created_at desc);

alter table public.bug_reports enable row level security;

create policy "Users can create own bug reports"
  on public.bug_reports for insert
  to authenticated
  with check (reporter_id = auth.uid());

create policy "Users can read own bug reports"
  on public.bug_reports for select
  to authenticated
  using (reporter_id = auth.uid());

create policy "Admins can manage bug reports"
  on public.bug_reports for all
  to authenticated
  using (public.current_profile_role() = 'admin'::public.user_role)
  with check (public.current_profile_role() = 'admin'::public.user_role);

create or replace function public.touch_bug_report_updated_at()
returns trigger
language plpgsql
set search_path = 'public'
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger bug_reports_touch_updated_at
  before update on public.bug_reports
  for each row
  execute function public.touch_bug_report_updated_at();

-- The API uploads through service_role so clients cannot enumerate or write
-- files directly. The bucket remains private and attachments are exposed only
-- through short-lived signed URLs generated for administrators.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'bug-report-attachments',
  'bug-report-attachments',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

revoke all on table public.bug_reports from anon;
grant select, insert on table public.bug_reports to authenticated;
grant select, insert, update, delete on table public.bug_reports to service_role;
