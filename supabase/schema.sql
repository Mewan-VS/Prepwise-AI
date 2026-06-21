-- PrepWise AI — database schema
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query).

create table if not exists public.study_plans (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  topics text not null,
  exam_date date not null,
  plan jsonb not null,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security.
alter table public.study_plans enable row level security;

-- Demo policies: allow anyone (anon key) to read and insert plans.
-- For a real app with user accounts, scope these to auth.uid() instead.
create policy "Anyone can read plans"
  on public.study_plans
  for select
  using (true);

create policy "Anyone can insert plans"
  on public.study_plans
  for insert
  with check (true);
