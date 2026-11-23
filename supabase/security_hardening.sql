-- Security hardening. Run once in the Supabase SQL editor (safe to re-run).
--
-- 1. New sign-ups get the 'user' role, which has no write access.
--    Only 'admin' and 'editor' can manage content.
-- 2. Policies check roles through is_staff(), a SECURITY DEFINER function,
--    which avoids the "infinite recursion detected in policy for relation profiles" error.
-- 3. founder_profile gets RLS: public read, staff write.
-- 4. Storage uploads/edits for public buckets are limited to staff.
--
-- After running, check that only real admins have staff roles:
--   select p.id, u.email, p.role from profiles p join auth.users u on u.id = p.id;
-- Demote anyone who shouldn't have access:
--   update profiles set role = 'user' where id = '<uuid>';

-- ---------- Roles ----------
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check check (role in ('admin', 'editor', 'user'));
alter table public.profiles alter column role set default 'user';

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'user')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

grant execute on function public.is_staff() to anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------- profiles ----------
drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles" on public.profiles
  for select using (public.is_admin());

-- ---------- content tables ----------
drop policy if exists "Admins can manage events" on public.events;
create policy "Admins can manage events" on public.events
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "Admins can manage clients" on public.clients;
create policy "Admins can manage clients" on public.clients
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "Admins can manage jobs" on public.jobs;
create policy "Admins can manage jobs" on public.jobs
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "Admins can manage news" on public.news;
create policy "Admins can manage news" on public.news
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "Admins can manage state_works" on public.state_works;
create policy "Admins can manage state_works" on public.state_works
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "Admins can view applications" on public.applications;
drop policy if exists "Admins can manage applications" on public.applications;
create policy "Admins can manage applications" on public.applications
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists "Admins can view messages" on public.messages;
drop policy if exists "Admins can manage messages" on public.messages;
create policy "Admins can manage messages" on public.messages
  for all using (public.is_staff()) with check (public.is_staff());

-- ---------- founder_profile ----------
alter table public.founder_profile enable row level security;

drop policy if exists "public read founder profile" on public.founder_profile;
drop policy if exists "Public can view founder_profile" on public.founder_profile;
create policy "Public can view founder_profile" on public.founder_profile
  for select using (true);

drop policy if exists "Staff can manage founder_profile" on public.founder_profile;
create policy "Staff can manage founder_profile" on public.founder_profile
  for all using (public.is_staff()) with check (public.is_staff());

-- ---------- storage ----------
drop policy if exists "Authenticated users can upload event images" on storage.objects;
drop policy if exists "Authenticated users can update event images" on storage.objects;
drop policy if exists "Authenticated users can delete event images" on storage.objects;
drop policy if exists "Authenticated users can upload client logos" on storage.objects;
drop policy if exists "Authenticated users can update client logos" on storage.objects;
drop policy if exists "Authenticated users can delete client logos" on storage.objects;
drop policy if exists "Authenticated users can upload news images" on storage.objects;
drop policy if exists "Authenticated users can update news images" on storage.objects;
drop policy if exists "Authenticated users can delete news images" on storage.objects;
drop policy if exists "Authenticated admins can view resumes" on storage.objects;

drop policy if exists "Staff can upload public images" on storage.objects;
create policy "Staff can upload public images" on storage.objects
  for insert with check (
    bucket_id in ('events-images', 'client-logos', 'news-images') and public.is_staff()
  );

drop policy if exists "Staff can update public images" on storage.objects;
create policy "Staff can update public images" on storage.objects
  for update using (
    bucket_id in ('events-images', 'client-logos', 'news-images') and public.is_staff()
  );

drop policy if exists "Staff can delete public images" on storage.objects;
create policy "Staff can delete public images" on storage.objects
  for delete using (
    bucket_id in ('events-images', 'client-logos', 'news-images') and public.is_staff()
  );

-- Applicants (anonymous) can still upload resumes; only staff can read them.
drop policy if exists "Staff can view resumes" on storage.objects;
create policy "Staff can view resumes" on storage.objects
  for select using (bucket_id = 'resumes' and public.is_staff());
