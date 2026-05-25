-- ============================================================
-- Sanctuary Health — Schema inicial
-- ============================================================

-- Enums
create type user_role as enum ('patient', 'doctor', 'admin');
create type consultation_status as enum ('completed', 'in_progress', 'pending');
create type consultation_severity as enum ('low', 'medium', 'high');
create type approval_status as enum ('pending', 'verified');
create type token_type as enum ('credit', 'debit');
create type agenda_type as enum ('appointment', 'free', 'break');
create type agenda_status as enum ('en_curso', 'pendiente', 'completada', 'cancelada');

-- Profiles (extends auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role user_role not null default 'patient',
  avatar text,
  -- Doctor-specific
  specialty text,
  rating numeric(3,1),
  available boolean default false,
  created_at timestamptz default now()
);

-- Patients medical info
create table patients (
  id uuid primary key references profiles(id) on delete cascade,
  age int,
  gender text,
  allergies jsonb default '[]',
  medications jsonb default '[]',
  blood_pressure text,
  heart_rate int,
  blood_type text,
  height text,
  weight text,
  vaccines jsonb default '[]',
  chronic_conditions jsonb default '[]',
  surgeries jsonb default '[]',
  family_history jsonb default '[]',
  emergency_contact jsonb default '{}',
  created_at timestamptz default now()
);

-- Consultations
create table consultations (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references profiles(id) on delete cascade,
  doctor_id uuid not null references profiles(id) on delete cascade,
  type text not null,
  status consultation_status not null default 'pending',
  date text,
  time text,
  reason text default '',
  severity consultation_severity default 'low',
  created_at timestamptz default now()
);

-- Doctor approvals
create table doctor_approvals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  specialty text not null,
  email text not null,
  avatar text,
  status approval_status not null default 'pending',
  created_at timestamptz default now()
);

-- Token transactions
create table token_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  type token_type not null,
  amount int not null,
  description text not null,
  detail text default '',
  date text,
  status text default 'Completado',
  created_at timestamptz default now()
);

-- Messages
create table messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  "from" text not null,
  from_name text not null,
  from_initials text not null,
  preview text not null,
  time text,
  unread boolean default false,
  thread_id text,
  created_at timestamptz default now()
);

-- Agenda slots
create table agenda_slots (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references profiles(id) on delete cascade,
  time text not null,
  type agenda_type not null default 'free',
  patient_name text,
  initials text,
  reason text,
  duration text,
  status agenda_status,
  created_at timestamptz default now()
);

-- Indexes
create index idx_consultations_patient on consultations(patient_id);
create index idx_consultations_doctor on consultations(doctor_id);
create index idx_token_transactions_user on token_transactions(user_id);
create index idx_messages_user on messages(user_id);
create index idx_agenda_slots_doctor on agenda_slots(doctor_id);
create index idx_profiles_role on profiles(role);
