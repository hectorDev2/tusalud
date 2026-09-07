-- ============================================================
-- MVP Core Flow: intake, assignment, status expansion
-- ============================================================

-- 1. Expand consultation_status to include 'assigned' and 'closed'
--    (Postgres doesn't support removing values from enums, so we add)
alter type consultation_status add value if not exists 'assigned';
alter type consultation_status add value if not exists 'closed';

-- 2. Add missing fields to consultations
alter table consultations
  add column if not exists intake jsonb default '{}',
  add column if not exists assigned_doctor_id uuid references profiles(id),
  add column if not exists closure_summary text,
  add column if not exists closed_at timestamptz,
  add column if not exists assigned_at timestamptz,
  add column if not exists requires_formal_consultation boolean default false;

-- 3. Add week_start + reference_id to token_transactions (to match ledger pattern)
alter table token_transactions
  add column if not exists week_start date,
  add column if not exists reference_id uuid;

-- 4. Make doctor_id nullable in consultations (so it can be unassigned initially)
alter table consultations alter column doctor_id drop not null;

-- 5. Function: get patient token balance (sum of credits minus debits)
create or replace function public.get_token_balance(p_user_id uuid)
returns int
language sql
stable
security definer
set search_path = 'public'
as $$
  select coalesce(
    sum(case when type = 'credit' then amount else -amount end),
    0
  )::int
  from token_transactions
  where user_id = p_user_id;
$$;

-- 6. Function: atomic token debit + consultation creation
--    Returns the new consultation id or raises exception
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
  -- Lock the patient's token rows to prevent double spend, then aggregate
  with locked as (
    select type, amount
    from token_transactions
    where user_id = p_patient_id
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

  -- Find an available doctor
  select id into v_doctor_id
  from profiles
  where role = 'doctor' and available = true
  limit 1;

  -- Create the consultation
  insert into consultations (
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

  -- Debit 1 token
  insert into token_transactions (user_id, type, amount, description, detail, reference_id)
  values (p_patient_id, 'debit', 1, 'Consulta iniciada', p_reason, v_consultation_id);

  return v_consultation_id;
end;
$$;

-- 7. Grant execute to authenticated users
grant execute on function public.start_consultation(uuid, text, text, jsonb) to authenticated;
grant execute on function public.get_token_balance(uuid) to authenticated;
