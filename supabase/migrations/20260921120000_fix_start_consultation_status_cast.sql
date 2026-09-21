-- Fix: explicitly cast the CASE result to consultation_status.
-- PostgreSQL does not implicitly cast a text CASE expression to an enum
-- when inserting through the RPC function.

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

  select id into v_doctor_id
  from profiles
  where role = 'doctor' and available = true
  limit 1;

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
    v_doctor_id,
    v_doctor_id,
    'Consulta General',
    case
      when v_doctor_id is not null then 'assigned'::consultation_status
      else 'pending'::consultation_status
    end,
    p_reason,
    p_severity::consultation_severity,
    p_intake,
    case when v_doctor_id is not null then now() else null end
  )
  returning id into v_consultation_id;

  insert into token_transactions (user_id, type, amount, description, detail, reference_id)
  values (p_patient_id, 'debit', 1, 'Consulta iniciada', p_reason, v_consultation_id);

  return v_consultation_id;
end;
$$;

grant execute on function public.start_consultation(uuid, text, text, jsonb) to authenticated;
