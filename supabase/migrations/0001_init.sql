create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create table if not exists public.onboarding_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists onboarding_responses_user_id_idx
  on public.onboarding_responses (user_id);

alter table public.profiles enable row level security;
alter table public.onboarding_responses enable row level security;

create policy "profiles_select_own" on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id);

create policy "profiles_insert_own" on public.profiles
  for insert to authenticated
  with check ((select auth.uid()) = id);

create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "onboarding_select_own" on public.onboarding_responses
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "onboarding_insert_own" on public.onboarding_responses
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "onboarding_delete_own" on public.onboarding_responses
  for delete to authenticated
  using ((select auth.uid()) = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- handle_new_user runs from the auth.users trigger context, which does not
-- require EXECUTE on the calling role, so it should not be reachable through
-- the exposed REST API (PostgREST /rpc).
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- Self-service account deletion. Deleting from auth.users cascades to
-- public.profiles and public.onboarding_responses via their ON DELETE CASCADE
-- foreign keys. SECURITY DEFINER lets a signed-in user remove their own auth
-- record; it only ever deletes the caller's own row (auth.uid()), and EXECUTE
-- is restricted to the authenticated role.
create or replace function public.delete_current_user()
returns void
language sql
security definer
set search_path = ''
as $$
  delete from auth.users where id = (select auth.uid());
$$;

revoke execute on function public.delete_current_user() from public, anon;
grant execute on function public.delete_current_user() to authenticated;
