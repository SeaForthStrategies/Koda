-- Companies: each employer owns one; employees join via team_code.
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text,
  owner_id uuid not null references auth.users (id) on delete cascade,
  team_code text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint companies_team_code_key unique (team_code)
);

create index if not exists companies_owner_id_idx on public.companies (owner_id);
create index if not exists companies_team_code_idx on public.companies (upper(team_code));

alter table public.companies enable row level security;

create policy "Owner can read own company"
  on public.companies for select
  using (auth.uid() = owner_id);

create policy "Owner can update own company"
  on public.companies for update
  using (auth.uid() = owner_id);

create policy "Owner can insert own company"
  on public.companies for insert
  with check (auth.uid() = owner_id);

-- Allow authenticated users to read companies by team_code (for employees joining)
create policy "Authenticated can read companies"
  on public.companies for select
  using (auth.role() = 'authenticated');

-- Profiles: link employers to their company
alter table public.profiles
  add column if not exists company_id uuid references public.companies (id) on delete set null;

create index if not exists profiles_company_id_idx on public.profiles (company_id);

comment on column public.companies.team_code is 'Unique code (e.g. 6 chars) that employees enter to join this company.';
