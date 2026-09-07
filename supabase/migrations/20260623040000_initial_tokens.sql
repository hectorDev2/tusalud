-- Initial token grant when a new patient profile is created (30 tokens)
create or replace function public.handle_new_patient()
returns trigger
language plpgsql
security definer
set search_path = 'public'
as $$
begin
  if new.role = 'patient' then
    -- Auto-create medical record
    insert into patients (id)
    values (new.id)
    on conflict (id) do nothing;

    -- Grant 30 welcome tokens
    insert into token_transactions (user_id, type, amount, description, detail)
    values (new.id, 'credit', 30, 'Tokens de bienvenida', 'Asignación inicial al crear cuenta');
  end if;
  return new;
end;
$$;
