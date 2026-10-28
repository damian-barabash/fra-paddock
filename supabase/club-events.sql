-- Club calendar: „Najbliższe wydarzenie” on top of the member's Paddock + „Wszystkie wydarzenia”.
-- Managed in Panel Klubu → Wydarzenia. Members read published events, admins write.
create table if not exists public.club_events (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  category    text,                    -- Track Day, Grand Tour, Ice Driving, Paddock Night …
  lead        text,                    -- one or two lines on the card
  body_html   text not null default '',
  cover_url   text,
  starts_at   timestamptz not null,
  ends_at     timestamptz,
  place       text,
  cta_label   text,
  cta_url     text,
  post_id     uuid references public.posts (id) on delete set null,  -- linked invitation (RSVP)
  published   boolean not null default true,
  created_by  uuid references auth.users (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists club_events_starts_idx on public.club_events (starts_at);
alter table public.club_events enable row level security;

drop policy if exists club_events_read on public.club_events;
create policy club_events_read on public.club_events
  for select to authenticated using ((published and public.is_member()) or public.is_admin());
drop policy if exists club_events_admin on public.club_events;
create policy club_events_admin on public.club_events
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
grant select, insert, update, delete on public.club_events to authenticated;

-- Small key/value settings of the club zone. `events_block`:
-- { enabled, mode: 'auto'|'manual', featured_id, title, all_label, countdown, show_past }
create table if not exists public.club_settings (
  key        text primary key,
  value      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);
alter table public.club_settings enable row level security;
drop policy if exists club_settings_read on public.club_settings;
create policy club_settings_read on public.club_settings
  for select to authenticated using (public.is_member() or public.is_admin());
drop policy if exists club_settings_admin on public.club_settings;
create policy club_settings_admin on public.club_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
grant select, insert, update, delete on public.club_settings to authenticated;

insert into public.club_settings (key, value) values ('events_block', jsonb_build_object(
  'enabled', true, 'mode', 'auto', 'featured_id', null,
  'title', 'Najbliższe wydarzenie', 'all_label', 'Wszystkie wydarzenia',
  'countdown', true, 'show_past', true
)) on conflict (key) do nothing;

notify pgrst, 'reload schema';
