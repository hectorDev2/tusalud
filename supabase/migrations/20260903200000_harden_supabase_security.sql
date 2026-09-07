-- ============================================================
-- TuSalud — Supabase security hardening
--
-- This migration deliberately supersedes policies/functions from
-- previous migrations without changing their historical files.
-- ============================================================

-- Never derive an application role from user-controlled Auth metadata.
-- Public signups always start as patients; doctor/admin promotion is an
-- explicit server-side workflow.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = 'public'
as $$
begin
  insert into public.profiles (id, name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', new.email),
    'patient'::public.user_role
  );
  return new;
end;
$$;

-- 1. Protect profiles.role from changes by non-admin users.
-- Use a SECURITY DEFINER helper to avoid recursive profiles RLS checks.
create or replace function public.current_profile_role()
returns public.user_role
language sql
stable
security definer
set search_path = 'public'
as $$
  select p.role
  from public.profiles as p
  where p.id = auth.uid();
$$;

revoke all on function public.current_profile_role() from public, anon, authenticated, service_role;
grant execute on function public.current_profile_role() to authenticated, service_role;

-- Defense in depth: RLS below is the normal enforcement boundary, while
-- this trigger also protects service-role-backed updates made accidentally
-- through a user client. The service_role and migration owner remain able
-- to perform administrative role changes.
create or replace function public.prevent_profile_role_change()
returns trigger
language plpgsql
set search_path = 'public'
as $$
begin
  if new.role is distinct from old.role
     and current_user not in ('postgres', 'service_role')
     and (
       auth.uid() is distinct from old.id
       or public.current_profile_role() is distinct from 'admin'::public.user_role
     ) then
    raise exception 'PROFILE_ROLE_CHANGE_FORBIDDEN' using errcode = '42501';
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_profile_role_change on public.profiles;
create trigger prevent_profile_role_change
  before update of role on public.profiles
  for each row
  execute function public.prevent_profile_role_change();

drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Admins can update profiles" on public.profiles;

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = public.current_profile_role()
  );

create policy "Admins can update profiles"
  on public.profiles for update
  to authenticated
  using (public.current_profile_role() = 'admin'::public.user_role)
  with check (public.current_profile_role() = 'admin'::public.user_role);

-- 2. Consultations can only be created by the atomic RPC. Service-role
-- seed/maintenance scripts are intentionally not restricted by RLS.
revoke insert on table public.consultations from public, anon, authenticated;
drop policy if exists "Patients can create consultations" on public.consultations;

-- assigned_doctor_id is the canonical assignment column. Backfill both
-- directions once so old rows remain visible to old integrations while all
-- new authorization decisions use assigned_doctor_id.
update public.consultations
set assigned_doctor_id = doctor_id
where assigned_doctor_id is null
  and doctor_id is not null;

update public.consultations
set doctor_id = assigned_doctor_id
where doctor_id is null
  and assigned_doctor_id is not null;

-- The legacy view aggregated consultations.date, while new consultations use
-- created_at. Recreate it so the admin patient registry reflects real activity.
drop view if exists public.patient_records;
create view public.patient_records as
select
  u.id,
  pr.name,
  u.email,
  pt.age,
  max(c.created_at) as last_consultation,
  case when pr.role = 'patient' then 'activo' else 'inactivo' end as status
from auth.users as u
join public.profiles as pr on pr.id = u.id
left join public.patients as pt on pt.id = u.id
left join public.consultations as c on c.patient_id = u.id
where pr.role = 'patient'
group by u.id, pr.name, u.email, pt.age, pr.role;

-- This view is consumed through the admin service-role client only. Do not
-- expose it through the public PostgREST roles because it contains PHI.
revoke all on table public.patient_records from anon, authenticated;
revoke all on table public.patient_records from PUBLIC;
grant select on table public.patient_records to service_role;

create index if not exists idx_consultations_assigned_doctor
  on public.consultations(assigned_doctor_id);

drop policy if exists "Doctors can view their consultations" on public.consultations;
drop policy if exists "Assigned doctors can view consultations" on public.consultations;
create policy "Assigned doctors can view consultations"
  on public.consultations for select
  to authenticated
  using (auth.uid() = assigned_doctor_id);

drop policy if exists "Doctors can update their consultations" on public.consultations;
drop policy if exists "Assigned doctors can update consultations" on public.consultations;
create policy "Assigned doctors can update consultations"
  on public.consultations for update
  to authenticated
  using (auth.uid() = assigned_doctor_id)
  with check (auth.uid() = assigned_doctor_id);

-- Keep chat authorization aligned with the canonical assignment column.
drop policy if exists "Users can view messages in their consultations" on public.chat_messages;
create policy "Users can view messages in their consultations"
  on public.chat_messages for select
  to authenticated
  using (
    exists (
      select 1
      from public.consultations as c
      where c.id = chat_messages.consultation_id
        and (c.patient_id = auth.uid() or c.assigned_doctor_id = auth.uid())
    )
  );

drop policy if exists "Users can insert messages in their consultations" on public.chat_messages;
create policy "Users can insert messages in their consultations"
  on public.chat_messages for insert
  to authenticated
  with check (
    auth.uid() = sender_id
    and exists (
      select 1
      from public.consultations as c
      where c.id = consultation_id
        and (c.patient_id = auth.uid() or c.assigned_doctor_id = auth.uid())
    )
  );

-- 3. RPCs derive the effective identity from auth.uid() after checking that
-- the supplied parameter matches it. This prevents arbitrary-ID access even
-- when a caller can invoke the function directly.
create or replace function public.get_token_balance(p_user_id uuid)
returns int
language plpgsql
stable
security definer
set search_path = 'public'
as $$
declare
  v_balance int;
begin
  if auth.uid() is null or auth.uid() is distinct from p_user_id then
    raise exception 'TOKEN_BALANCE_FORBIDDEN' using errcode = '42501';
  end if;

  select coalesce(
    sum(case when t.type = 'credit' then t.amount else -t.amount end),
    0
  )::int
  into v_balance
  from public.token_transactions as t
  where t.user_id = auth.uid();

  return v_balance;
end;
$$;

create or replace function public.start_consultation(
  p_patient_id uuid,
  p_reason text,
  p_severity text default 'low',
  p_intake jsonb default '{}'
)
returns uuid
language plpgsql
security definer
set search_path = 'public'
as $$
declare
  v_balance int;
  v_doctor_id uuid;
  v_consultation_id uuid;
  v_patient_id uuid;
begin
  if auth.uid() is null or auth.uid() is distinct from p_patient_id then
    raise exception 'START_CONSULTATION_FORBIDDEN' using errcode = '42501';
  end if;

  if not exists (
    select 1
    from public.profiles as p
    where p.id = auth.uid()
      and p.role = 'patient'
  ) then
    raise exception 'START_CONSULTATION_FORBIDDEN' using errcode = '42501';
  end if;

  v_patient_id := auth.uid();

  -- Lock the patient's token rows first, then aggregate. This keeps the
  -- existing atomic debit behavior and avoids FOR UPDATE on an aggregate.
  with locked as (
    select t.type, t.amount
    from public.token_transactions as t
    where t.user_id = v_patient_id
    for update
  )
  select coalesce(
    sum(case when type = 'credit' then amount else -amount end),
    0
  )::int
  into v_balance
  from locked;

  if v_balance < 1 then
    raise exception 'SIN_TOKENS' using errcode = 'P0001';
  end if;

  select p.id
  into v_doctor_id
  from public.profiles as p
  where p.role = 'doctor'
    and p.available = true
  limit 1;

  insert into public.consultations (
    patient_id,
    doctor_id,
    assigned_doctor_id,
    type,
    status,
    reason,
    severity,
    intake,
    assigned_at
  ) values (
    v_patient_id,
    v_doctor_id,
    v_doctor_id,
    'Consulta General',
    case when v_doctor_id is not null then 'assigned' else 'pending' end,
    p_reason,
    p_severity::public.consultation_severity,
    p_intake,
    case when v_doctor_id is not null then now() else null end
  )
  returning id into v_consultation_id;

  insert into public.token_transactions (
    user_id, type, amount, description, detail, reference_id
  ) values (
    v_patient_id, 'debit', 1, 'Consulta iniciada', p_reason, v_consultation_id
  );

  return v_consultation_id;
end;
$$;

-- Atomically claim one pending consultation. The row lock prevents two
-- doctors from claiming the same consultation; SKIP LOCKED makes a busy row
-- immediately unavailable to competing claim attempts.
create or replace function public.claim_pending_consultation(p_consultation_id uuid)
returns uuid
language plpgsql
security definer
set search_path = 'public'
as $$
declare
  v_consultation_id uuid;
begin
  if auth.uid() is null
     or not exists (
       select 1
       from public.profiles as p
       where p.id = auth.uid()
         and p.role = 'doctor'
     ) then
    raise exception 'CLAIM_CONSULTATION_FORBIDDEN' using errcode = '42501';
  end if;

  select c.id
  into v_consultation_id
  from public.consultations as c
  where c.id = p_consultation_id
    and c.status = 'pending'
    and c.assigned_doctor_id is null
  for update skip locked;

  if not found then
    raise exception 'CONSULTATION_NOT_AVAILABLE' using errcode = 'P0001';
  end if;

  update public.consultations
  set doctor_id = auth.uid(),
      assigned_doctor_id = auth.uid(),
      status = 'assigned',
      assigned_at = now()
  where id = v_consultation_id;

  return v_consultation_id;
end;
$$;

-- Expose only the queue metadata needed to choose a pending consultation.
-- This avoids granting every doctor a broad SELECT policy over consultation
-- rows while still allowing the claim flow to work.
create or replace function public.list_pending_consultations()
returns table (
  id uuid,
  status public.consultation_status,
  reason text,
  severity public.consultation_severity,
  intake jsonb,
  created_at timestamptz,
  assigned_at timestamptz,
  closed_at timestamptz,
  patient_id uuid,
  patient_name text,
  patient_avatar text
)
language plpgsql
security definer
set search_path = 'public'
as $$
begin
  if auth.uid() is null
     or not exists (
       select 1
       from public.profiles as p
       where p.id = auth.uid()
         and p.role = 'doctor'
     ) then
    raise exception 'PENDING_CONSULTATIONS_FORBIDDEN' using errcode = '42501';
  end if;

  return query
  select
    c.id,
    c.status,
    c.reason,
    c.severity,
    c.intake,
    c.created_at,
    c.assigned_at,
    c.closed_at,
    p.id,
    p.name,
    p.avatar
  from public.consultations as c
  join public.profiles as p on p.id = c.patient_id
  where c.status = 'pending'
    and c.assigned_doctor_id is null
  order by c.created_at asc;
end;
$$;

-- Audit events must not be able to impersonate another authenticated actor.
-- Service-role jobs/admin routes retain their existing ability to write audit
-- records through the explicit service_role grant below.
create or replace function public.log_audit(
  p_actor_id uuid,
  p_action text,
  p_resource_type text default null,
  p_resource_id uuid default null,
  p_metadata jsonb default '{}'
)
returns uuid
language plpgsql
security definer
set search_path = 'public'
as $$
declare
  v_id uuid;
begin
  if not (
    auth.role() = 'service_role'
    or (
      auth.role() = 'authenticated'
      and p_actor_id is not distinct from auth.uid()
    )
  ) then
    raise exception 'AUDIT_ACTOR_FORBIDDEN' using errcode = '42501';
  end if;

  insert into public.audit_log (actor_id, action, resource_type, resource_id, metadata)
  values (p_actor_id, p_action, p_resource_type, p_resource_id, p_metadata)
  returning id into v_id;

  return v_id;
end;
$$;

drop policy if exists "Authenticated users can insert audit events" on public.audit_log;
create policy "Authenticated users can insert audit events"
  on public.audit_log for insert
  to authenticated
  with check (actor_id = auth.uid());

create or replace function public.doctor_heartbeat(p_doctor_id uuid)
returns void
language plpgsql
security definer
set search_path = 'public'
as $$
begin
  if auth.uid() is null or auth.uid() is distinct from p_doctor_id then
    raise exception 'DOCTOR_HEARTBEAT_FORBIDDEN' using errcode = '42501';
  end if;

  update public.profiles
  set last_ui_activity_at = now()
  where id = auth.uid()
    and role = 'doctor';

  if not found then
    raise exception 'DOCTOR_HEARTBEAT_FORBIDDEN' using errcode = '42501';
  end if;
end;
$$;

-- Replace the historical hardcoded admin metrics with values derived from the
-- current database. The API still enforces the admin role before calling this
-- service-role-only function.
create or replace function public.get_admin_stats()
returns json
language sql
security definer
set search_path = 'public'
as $$
  with period as (
    select date_trunc('week', now() at time zone 'America/Lima')
      at time zone 'America/Lima' as week_start
  ),
  token_totals as (
    select
      coalesce(sum(case when type = 'credit' then amount else -amount end), 0)::int as circulation,
      coalesce(sum(case when type = 'debit' and created_at >= period.week_start then amount else 0 end), 0)::int as used_this_week,
      coalesce(sum(case when type = 'credit' and created_at >= period.week_start then amount else 0 end), 0)::int as new_this_week
    from public.token_transactions, period
  )
  select json_build_object(
    'activeUsers', (select count(*) from public.profiles where role = 'patient'),
    'totalConsultations', (select count(*) from public.consultations),
    'pendingApprovals', (select count(*) from public.doctor_approvals where status = 'pending'),
    'tokensInCirculation', token_totals.circulation,
    'tokensUsedThisWeek', token_totals.used_this_week,
    'tokensNewThisWeek', token_totals.new_this_week,
    'usageRate', case
      when token_totals.new_this_week > 0
        then round(token_totals.used_this_week::numeric / token_totals.new_this_week * 100, 1)
      else 0
    end
  )
  from token_totals;
$$;

-- 4. Remove implicit/public execution from every SECURITY DEFINER function
-- currently defined by the migrations, then grant only the callers needed by
-- the application and scheduled edge functions.
revoke all on function public.handle_new_user() from public, anon, authenticated, service_role;
revoke all on function public.handle_new_patient() from public, anon, authenticated, service_role;
revoke all on function public.get_admin_stats() from public, anon, authenticated, service_role;
revoke all on function public.get_token_balance(uuid) from public, anon, authenticated, service_role;
revoke all on function public.start_consultation(uuid, text, text, jsonb) from public, anon, authenticated, service_role;
revoke all on function public.claim_pending_consultation(uuid) from public, anon, authenticated, service_role;
revoke all on function public.list_pending_consultations() from public, anon, authenticated, service_role;
revoke all on function public.doctor_heartbeat(uuid) from public, anon, authenticated, service_role;
revoke all on function public.auto_off_inactive_doctors() from public, anon, authenticated, service_role;
revoke all on function public.weekly_token_grant() from public, anon, authenticated, service_role;
revoke all on function public.log_audit(uuid, text, text, uuid, jsonb) from public, anon, authenticated, service_role;

grant execute on function public.get_token_balance(uuid) to authenticated;
grant execute on function public.start_consultation(uuid, text, text, jsonb) to authenticated;
grant execute on function public.claim_pending_consultation(uuid) to authenticated;
grant execute on function public.list_pending_consultations() to authenticated;
grant execute on function public.doctor_heartbeat(uuid) to authenticated;
grant execute on function public.get_admin_stats() to service_role;
grant execute on function public.auto_off_inactive_doctors() to service_role;
grant execute on function public.weekly_token_grant() to service_role;
grant execute on function public.log_audit(uuid, text, text, uuid, jsonb) to authenticated, service_role;

-- 5. Make weekly grants safe under concurrent job invocations. Existing
-- nullable week_start values are backfilled before the unique index is made.
update public.token_transactions
set week_start = date_trunc('week', created_at at time zone 'America/Lima')::date
where type = 'credit'
  and description = 'Asignación semanal'
  and week_start is null;

with duplicate_grants as (
  select
    id,
    row_number() over (
      partition by user_id, week_start, description
      order by created_at, id
    ) as row_number
  from public.token_transactions
  where type = 'credit'
    and description = 'Asignación semanal'
    and week_start is not null
)
delete from public.token_transactions as t
using duplicate_grants as d
where t.id = d.id
  and d.row_number > 1;

create unique index if not exists idx_token_transactions_weekly_grant_unique
  on public.token_transactions(user_id, week_start, description)
  where type = 'credit'
    and description = 'Asignación semanal'
    and week_start is not null;

create or replace function public.weekly_token_grant()
returns int
language plpgsql
security definer
set search_path = 'public'
as $$
declare
  v_week_start date;
  v_affected int := 0;
  v_patient record;
  v_inserted int;
begin
  -- Week starts on Monday (Lima time).
  v_week_start := date_trunc('week', now() at time zone 'America/Lima')::date;

  for v_patient in
    select p.id
    from public.profiles as p
    where p.role = 'patient'
  loop
    insert into public.token_transactions (
      user_id, type, amount, description, detail, week_start
    ) values (
      v_patient.id,
      'credit',
      3,
      'Asignación semanal',
      'Tokens semanales gratuitos',
      v_week_start
    )
    on conflict (user_id, week_start, description)
      where type = 'credit'
        and description = 'Asignación semanal'
        and week_start is not null
    do nothing;

    get diagnostics v_inserted = row_count;
    if v_inserted = 1 then
      v_affected := v_affected + 1;
    end if;
  end loop;

  return v_affected;
end;
$$;

-- Re-apply the grant after CREATE OR REPLACE so it remains explicit and
-- independent of defaults on future database upgrades.
revoke all on function public.weekly_token_grant() from public, anon, authenticated, service_role;
grant execute on function public.weekly_token_grant() to service_role;
