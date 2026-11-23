-- Founder profile table (single record: key = 'main')
-- Run this in Supabase SQL editor, then run security_hardening.sql for its RLS policies.

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

alter table public.founder_profile enable row level security;
