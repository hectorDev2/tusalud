-- ============================================================
-- Doctor availability heartbeat field
-- ============================================================

-- Add last_ui_activity_at to profiles for the auto-off failsafe
alter table profiles
  add column if not exists last_ui_activity_at timestamptz;

-- Function: beat (doctor updates their own activity timestamp)
create or replace function public.doctor_heartbeat(p_doctor_id uuid)
returns void
language plpgsql
security definer
set search_path = 'public'
as $$
begin
  update profiles
  set last_ui_activity_at = now()
  where id = p_doctor_id and role = 'doctor';
end;
$$;

-- Function: auto-off doctors inactive >15 min (called by scheduled job)
create or replace function public.auto_off_inactive_doctors()
returns int
language plpgsql
security definer
set search_path = 'public'
as $$
declare
  affected int;
begin
  update profiles
  set available = false
  where role = 'doctor'
    and available = true
    and (
      last_ui_activity_at is null
      or now() - last_ui_activity_at > interval '15 minutes'
    );

  get diagnostics affected = row_count;
  return affected;
end;
$$;

-- Function: weekly token grant (called by scheduled job)
-- Idempotent: skips patients who already received a grant this week
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
begin
  -- Week starts on Monday (Lima time)
  v_week_start := date_trunc('week', now() at time zone 'America/Lima')::date;

  for v_patient in
    select id from profiles where role = 'patient'
  loop
    -- Skip if already granted this week
    if exists (
      select 1 from token_transactions
      where user_id = v_patient.id
        and type = 'credit'
        and description = 'Asignación semanal'
        and week_start = v_week_start
    ) then
      continue;
    end if;

    insert into token_transactions (user_id, type, amount, description, detail, week_start)
    values (v_patient.id, 'credit', 3, 'Asignación semanal', 'Tokens semanales gratuitos', v_week_start);

    v_affected := v_affected + 1;
  end loop;

  return v_affected;
end;
$$;

-- Grant execute to service role only (these are called from edge functions)
grant execute on function public.auto_off_inactive_doctors() to service_role;
grant execute on function public.weekly_token_grant() to service_role;
grant execute on function public.doctor_heartbeat(uuid) to authenticated;
