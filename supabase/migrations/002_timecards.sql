-- Timecards table: one row per clock-in/out entry
create table if not exists public.timecards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  check_in timestamptz not null,
  check_out timestamptz not null,
  total_hours numeric not null,
  status text not null default 'pending'
);

create unique index if not exists timecards_user_check_in_idx on public.timecards (user_id, check_in);
create index if not exists timecards_user_id_idx on public.timecards (user_id);
create index if not exists timecards_check_in_idx on public.timecards (check_in desc);

alter table public.timecards enable row level security;

create policy "Users can insert own timecards"
  on public.timecards for insert
  with check (auth.uid() = user_id);

create policy "Users can read own timecards"
  on public.timecards for select
  using (auth.uid() = user_id);

-- Admin read-all: use service role key in API for employer view, or add a separate policy for an admin role
