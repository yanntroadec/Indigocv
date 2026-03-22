create table public.cvs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  name       text not null default 'Mon CV',
  data       jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger cvs_updated_at
  before update on public.cvs
  for each row execute procedure public.touch_updated_at();

alter table public.cvs enable row level security;
create policy "select own" on public.cvs for select using (auth.uid() = user_id);
create policy "insert own" on public.cvs for insert with check (auth.uid() = user_id);
create policy "update own" on public.cvs for update using (auth.uid() = user_id);
create policy "delete own" on public.cvs for delete using (auth.uid() = user_id);

create index cvs_user_id_idx on public.cvs(user_id, updated_at desc);
