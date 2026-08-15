-- Fastline Paddock Club — zgłoszenia o członkostwo
-- Uruchom w Supabase SQL Editor (lub przez migrację).

create table if not exists public.applications (
  id          uuid primary key default gen_random_uuid(),
  full_name   text not null,
  email       text not null,
  phone       text not null,
  car         text,
  message     text,
  source      text default 'paddock-club-web',
  status      text not null default 'new',   -- new | contacted | accepted | rejected
  created_at  timestamptz not null default now()
);

alter table public.applications enable row level security;

-- Publiczny formularz: rola public (anon + authenticated) może TYLKO wstawiać.
drop policy if exists "public can submit application" on public.applications;
create policy "public can submit application"
  on public.applications
  for insert
  to public
  with check (true);

-- Odczyt/edycja tylko dla ról serwerowych (service_role omija RLS) —
-- brak polityki SELECT dla anon = nikt z zewnątrz nie przeczyta zgłoszeń.

create index if not exists applications_created_at_idx
  on public.applications (created_at desc);

-- Po utworzeniu tabeli surowym SQL trzeba odświeżyć cache PostgREST:
notify pgrst, 'reload schema';

-- 2026-07-24: formularz v2 — interesujący poziom członkostwa (już nieużywane w UI od 2026-08-15)
alter table public.applications add column if not exists tier text;

-- 2026-08-15: formularz „Fastline Paddock Pass" (copy Ani 14.08)
alter table public.applications
  add column if not exists brand     text,     -- ulubiona marka motoryzacyjna
  add column if not exists reference text,     -- kto rekomenduje (Klubowicz / wydarzenie)
  add column if not exists interests text[];   -- Track Days / Wyprawy / Lifestyle / Networking
notify pgrst, 'reload schema';
