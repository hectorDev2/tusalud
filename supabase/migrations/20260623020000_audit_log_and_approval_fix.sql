-- ============================================================
-- Audit log + fix doctor_approvals to link user accounts
-- ============================================================

-- 1. Add user_id to doctor_approvals so approval can update profiles.role
alter table doctor_approvals
  add column if not exists user_id uuid references profiles(id) on delete set null;

-- 2. Audit log table
create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id) on delete set null,
  action text not null,           -- e.g. 'consultation.created', 'doctor.approved'
  resource_type text,             -- e.g. 'consultation', 'profile'
  resource_id uuid,               -- id of the affected resource
  metadata jsonb default '{}',    -- extra context (status changes, summaries, etc.)
  created_at timestamptz default now()
);

create index idx_audit_log_actor on audit_log(actor_id);
create index idx_audit_log_action on audit_log(action);
create index idx_audit_log_resource on audit_log(resource_type, resource_id);
create index idx_audit_log_created on audit_log(created_at desc);

-- RLS: audit_log is insert-only for authenticated users; only admins can SELECT
alter table audit_log enable row level security;

create policy "Authenticated users can insert audit events"
  on audit_log for insert
  to authenticated
  with check (true);

create policy "Admins can read audit log"
  on audit_log for select
  using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- 3. log_audit helper (callable from API routes via supabase.rpc)
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
  insert into audit_log (actor_id, action, resource_type, resource_id, metadata)
  values (p_actor_id, p_action, p_resource_type, p_resource_id, p_metadata)
  returning id into v_id;
  return v_id;
end;
$$;

grant execute on function public.log_audit(uuid, text, text, uuid, jsonb) to authenticated;
grant execute on function public.log_audit(uuid, text, text, uuid, jsonb) to service_role;

-- 4. Update start_consultation to also log audit
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
begin
  select coalesce(
    sum(case when type = 'credit' then amount else -amount end),
    0
  )::int
  into v_balance
  from token_transactions
  where user_id = p_patient_id
  for update;

  if v_balance < 1 then
    raise exception 'SIN_TOKENS' using errcode = 'P0001';
  end if;

  select id into v_doctor_id
  from profiles
  where role = 'doctor' and available = true
  limit 1;

  insert into consultations (
    patient_id, doctor_id, assigned_doctor_id, type, status,
    reason, severity, intake, assigned_at
  ) values (
    p_patient_id,
    coalesce(v_doctor_id, null),
    v_doctor_id,
    'Consulta General',
    case when v_doctor_id is not null then 'assigned' else 'pending' end,
    p_reason,
    p_severity::consultation_severity,
    p_intake,
    case when v_doctor_id is not null then now() else null end
  )
  returning id into v_consultation_id;

  insert into token_transactions (user_id, type, amount, description, detail, reference_id)
  values (p_patient_id, 'debit', 1, 'Consulta iniciada', p_reason, v_consultation_id);

  -- Audit
  perform log_audit(
    p_patient_id,
    'consultation.created',
    'consultation',
    v_consultation_id,
    jsonb_build_object(
      'assigned_doctor_id', v_doctor_id,
      'severity', p_severity
    )
  );

  return v_consultation_id;
end;
$$;
