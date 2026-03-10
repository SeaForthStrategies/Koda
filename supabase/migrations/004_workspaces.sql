-- Workspaces: each employer owns one; employees join via join_code.
create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  join_code text not null,
  name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint workspaces_join_code_key unique (join_code)
);

create index if not exists workspaces_owner_id_idx on public.workspaces (owner_id);
create index if not exists workspaces_join_code_idx on public.workspaces (upper(join_code));

alter table public.workspaces enable row level security;

-- Only the owner can read/update their workspace
create policy "Owner can read own workspace"
  on public.workspaces for select
  using (auth.uid() = owner_id);

create policy "Owner can update own workspace"
  on public.workspaces for update
  using (auth.uid() = owner_id);

create policy "Owner can insert own workspace"
  on public.workspaces for insert
  with check (auth.uid() = owner_id);

-- Profiles: link employees to a workspace
alter table public.profiles
  add column if not exists workspace_id uuid references public.workspaces (id) on delete set null;

create index if not exists profiles_workspace_id_idx on public.profiles (workspace_id);

comment on column public.workspaces.join_code is 'Unique code (case-insensitive) that employees enter to join this team.';
comment on column public.profiles.workspace_id is 'Team/workspace the user joined (employees only; set via join code).';
