create table if not exists public.reading_notes_state (
  key text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create or replace function public.set_reading_notes_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_reading_notes_updated_at on public.reading_notes_state;

create trigger set_reading_notes_updated_at
before update on public.reading_notes_state
for each row
execute function public.set_reading_notes_updated_at();
