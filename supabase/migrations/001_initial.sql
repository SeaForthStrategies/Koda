-- Koda SaaS: profiles (synced from auth.users) and time_cards
-- Run in Supabase SQL Editor or via Supabase CLI.

-- Profiles: one row per user (optional; can rely on auth.users only)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Time card submissions (per user)
create table if not exists public.time_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  payload jsonb not null,
  weekly_total_hours numeric not null,
  additional_recipients text[] default '{}',
  created_at timestamptz not null default now()
);

create index if not exists time_cards_user_id_idx on public.time_cards (user_id);
create index if not exists time_cards_created_at_idx on public.time_cards (created_at desc);

-- RLS: users can only read/write their own data
alter table public.profiles enable row level security;
alter table public.time_cards enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can read own time_cards"
  on public.time_cards for select
  using (auth.uid() = user_id);

create policy "Users can insert own time_cards"
  on public.time_cards for insert
  with check (auth.uid() = user_id);

-- Optional: trigger to create profile on signup (Supabase Auth hook or DB trigger)
-- Here we use a simple trigger on auth.users (requires service role or trigger function)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'email', new.email),
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, profiles.avatar_url),
    updated_at = now();
  return new;
end;
$$;

-- Only create trigger if we have access to auth.users (run as superuser / in Supabase dashboard)
-- drop trigger if exists on_auth_user_created on auth.users;
-- create trigger on_auth_user_created
--   after insert on auth.users
--   for each row execute function public.handle_new_user();
