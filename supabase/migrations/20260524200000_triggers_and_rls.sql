-- ============================================================
-- Triggers, RLS, and helper functions
-- ============================================================

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = 'public'
as $$
begin
  insert into profiles (id, name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', new.email),
    coalesce(
      (new.raw_user_meta_data ->> 'role')::user_role,
      'patient'::user_role
    )
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Auto-create patient medical record when profile with patient role is created
create or replace function public.handle_new_patient()
returns trigger
language plpgsql
security definer
set search_path = 'public'
as $$
begin
  if new.role = 'patient' then
    insert into patients (id)
    values (new.id)
    on conflict (id) do nothing;
  end if;
  return new;
end;
$$;

create or replace trigger on_profile_created_for_patient
  after insert on public.profiles
  for each row
  execute function public.handle_new_patient();

-- RLS: Enable row-level security on all tables
alter table profiles enable row level security;
alter table patients enable row level security;
alter table consultations enable row level security;
alter table doctor_approvals enable row level security;
alter table token_transactions enable row level security;
alter table messages enable row level security;
alter table agenda_slots enable row level security;

-- RLS Policies

-- Profiles: users can read their own, doctors/admins can read all
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Doctors and admins can view all profiles"
  on profiles for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('doctor', 'admin')
    )
  );

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Patients: users can read own, doctors/admins can read all
create policy "Patients can view own record"
  on patients for select
  using (auth.uid() = id);

create policy "Doctors and admins can view all patients"
  on patients for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('doctor', 'admin')
    )
  );

-- Consultations
create policy "Patients can view own consultations"
  on consultations for select
  using (auth.uid() = patient_id);

create policy "Doctors can view their consultations"
  on consultations for select
  using (auth.uid() = doctor_id);

create policy "Admins can view all consultations"
  on consultations for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Patients can create consultations"
  on consultations for insert
  with check (auth.uid() = patient_id);

create policy "Doctors can update their consultations"
  on consultations for update
  using (auth.uid() = doctor_id);

-- Token transactions
create policy "Users can view own transactions"
  on token_transactions for select
  using (auth.uid() = user_id);

create policy "Admins can view all transactions"
  on token_transactions for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Messages
create policy "Users can view own messages"
  on messages for select
  using (auth.uid() = user_id);

-- Agenda slots
create policy "Doctors can view own agenda"
  on agenda_slots for select
  using (auth.uid() = doctor_id);

create policy "Admins can view all agenda slots"
  on agenda_slots for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Doctor approvals: admins only
create policy "Admins can manage approvals"
  on doctor_approvals for all
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- View: patient records (for admin panel)
create view patient_records as
select
  p.id,
  pr.name,
  p.email,
  pt.age,
  max(c.date) as last_consultation,
  case when pr.role = 'patient' then 'activo' else 'inactivo' end as status
from auth.users p
join profiles pr on pr.id = p.id
left join patients pt on pt.id = p.id
left join consultations c on c.patient_id = p.id
where pr.role = 'patient'
group by p.id, pr.name, p.email, pt.age, pr.role;

-- View: users admin view
create view users_view as
select
  p.id,
  p.name,
  u.email,
  case
    when p.role = 'patient' then 'paciente'
    when p.role = 'doctor' then 'doctor'
    when p.role = 'admin' then 'administrador'
  end as role,
  case
    when p.role = 'patient' then 'activo'
    else 'activo'
  end as status
from profiles p
join auth.users u on u.id = p.id;

-- Function: admin stats
create or replace function get_admin_stats()
returns json
language sql
security definer
set search_path = ''
as $$
  select json_build_object(
    'activeUsers', (select count(*) from public.profiles where role = 'patient'),
    'totalConsultations', (select count(*) from public.consultations),
    'pendingApprovals', (select count(*) from public.doctor_approvals where status = 'pending'),
    'tokensInCirculation', 24580,
    'tokensUsedThisWeek', 8420,
    'tokensNewThisWeek', 9600,
    'usageRate', 87.2
  );
$$;
