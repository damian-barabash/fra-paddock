-- Sign-ups from the members' zone (buttons „Zapisz się” on events, „Zarezerwuj…” on offers).
-- Shown in Panel Klubu → Zgłoszenia with a per-admin „new” badge and who has already seen each one.
create table if not exists public.signups (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  kind        text not null check (kind in ('event', 'offer')),
  event_id    uuid references public.club_events (id) on delete set null,
  post_id     uuid references public.posts (id) on delete set null,
  title       text not null,            -- snapshot, stays even if the event is deleted
  starts_at   timestamptz,              -- event date / offer validity, snapshot
  link        text,                     -- where the button led
  created_at  timestamptz not null default now()
);
create unique index if not exists signups_once on public.signups (user_id, kind, coalesce(event_id, post_id));
create index if not exists signups_created_idx on public.signups (created_at desc);
alter table public.signups enable row level security;
drop policy if exists signups_read on public.signups;
create policy signups_read on public.signups for select to authenticated using (user_id = auth.uid() or public.is_admin());
drop policy if exists signups_admin_delete on public.signups;
create policy signups_admin_delete on public.signups for delete to authenticated using (public.is_admin());
grant select, delete on public.signups to authenticated;

create table if not exists public.signup_views (
  signup_id uuid not null references public.signups (id) on delete cascade,
  admin_id  uuid not null references public.profiles (id) on delete cascade,
  seen_at   timestamptz not null default now(),
  primary key (signup_id, admin_id)
);
alter table public.signup_views enable row level security;
drop policy if exists signup_views_read on public.signup_views;
create policy signup_views_read on public.signup_views for select to authenticated using (public.is_admin());
drop policy if exists signup_views_own on public.signup_views;
create policy signup_views_own on public.signup_views for insert to authenticated with check (public.is_admin() and admin_id = auth.uid());
grant select, insert on public.signup_views to authenticated;

-- A member signs up: the server checks the event/offer is really visible to them and keeps a snapshot.
create or replace function public.club_signup(p_kind text, p_ref uuid)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  sid uuid;
  t text; d timestamptz; l text;
begin
  if not public.is_member() then raise exception 'forbidden' using errcode = '42501'; end if;
  if p_kind = 'event' then
    select title, starts_at, cta_url into t, d, l from club_events where id = p_ref and published;
  elsif p_kind = 'offer' then
    select title, valid_until, cta_url into t, d, l from posts
      where id = p_ref and kind = 'offer' and public.can_see_post(id);
  else
    raise exception 'bad kind';
  end if;
  if t is null then raise exception 'not found' using errcode = 'P0002'; end if;

  insert into signups (user_id, kind, event_id, post_id, title, starts_at, link)
  values (auth.uid(), p_kind, case when p_kind = 'event' then p_ref end, case when p_kind = 'offer' then p_ref end, t, d, l)
  on conflict do nothing
  returning id into sid;
  return sid;
end $$;
revoke all on function public.club_signup(text, uuid) from public, anon;
grant execute on function public.club_signup(text, uuid) to authenticated;

-- The red number in the admin menu: sign-ups this admin has not opened yet.
create or replace function public.unseen_signups()
returns integer language sql stable security definer set search_path = public as $$
  select case when public.is_admin() then (
    select count(*)::int from signups s
    where not exists (select 1 from signup_views v where v.signup_id = s.id and v.admin_id = auth.uid())
  ) else 0 end
$$;
grant execute on function public.unseen_signups() to authenticated;

notify pgrst, 'reload schema';
