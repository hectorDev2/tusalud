-- ============================================================
-- Chat messages + Realtime + Dark mode seed
-- ============================================================

-- Chat messages for consultations (separate from inbox messages)
create table chat_messages (
  id uuid primary key default gen_random_uuid(),
  consultation_id uuid not null references consultations(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

create index idx_chat_messages_consultation on chat_messages(consultation_id);
create index idx_chat_messages_created on chat_messages(created_at);

-- Enable Realtime on chat_messages (for live updates)
-- Note: this is superseded by the alter publication below in newer Supabase versions
-- but kept for compatibility

-- RLS: chat_messages
alter table chat_messages enable row level security;

create policy "Users can view messages in their consultations"
  on chat_messages for select
  using (
    exists (
      select 1 from consultations c
      where c.id = chat_messages.consultation_id
      and (c.patient_id = auth.uid() or c.doctor_id = auth.uid())
    )
  );

create policy "Users can insert messages in their consultations"
  on chat_messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from consultations c
      where c.id = consultation_id
      and (c.patient_id = auth.uid() or c.doctor_id = auth.uid())
    )
  );

-- Add realtime publication for chat_messages
-- This is the Supabase way to enable Realtime for a table
alter publication supabase_realtime add table chat_messages;
