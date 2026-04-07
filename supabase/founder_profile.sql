-- Founder profile table (single record: key = 'main')
-- Run this in Supabase SQL editor.

create table if not exists public.founder_profile (
  key text primary key,
  name text not null,
  title text not null,
  brief_intro text,
  about text,
  highlights text[] default '{}'::text[],
  phone text,
  email text,
  location text,
  image_url text,
  socials jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- Optional: allow public read access (adjust based on your RLS policy)
-- alter table public.founder_profile enable row level security;
-- create policy "public read founder profile"
-- on public.founder_profile
-- for select
-- using (true);

