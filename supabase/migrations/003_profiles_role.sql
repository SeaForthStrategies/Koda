-- Add role to profiles: 'employee' (default) or 'employer'
alter table public.profiles
  add column if not exists role text not null default 'employee';

alter table public.profiles
  add constraint profiles_role_check check (role in ('employee', 'employer'));

comment on column public.profiles.role is 'User role: employee (timecard submission) or employer (admin view).';
