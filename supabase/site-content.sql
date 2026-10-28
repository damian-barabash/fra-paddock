-- Site texts edited in Panel Klubu → „Strona” (visual editor).
-- Two rows: `published` (read by everyone, shown on the site) and `draft` (admins only).
-- `data` = { "<text key>": "<html>" }. In the draft a JSON null means
-- "restore the original text" once published.
create table if not exists public.site_content (
  id text primary key check (id in ('published', 'draft')),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);
alter table public.site_content enable row level security;

drop policy if exists site_content_read on public.site_content;
create policy site_content_read on public.site_content
  for select to anon, authenticated
  using (id = 'published' or public.is_admin());

grant select on public.site_content to anon, authenticated;

insert into public.site_content (id) values ('published'), ('draft') on conflict do nothing;

-- One call for every save: no direct write policies, only this function (admins).
--   mode 'draft'   → draft = draft || changes            (null = restore original)
--   mode 'publish' → published gets the changes (null keys removed), the same keys leave the draft
--   mode 'discard' → the given keys leave the draft
create or replace function public.site_content_save(p_mode text, p_changes jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  ch jsonb := coalesce(p_changes, '{}'::jsonb);
  ks text[];
  nulls text[];
  vals jsonb;
begin
  if not public.is_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  select coalesce(array_agg(key), '{}') into ks from jsonb_each(ch);
  select coalesce(array_agg(key), '{}') into nulls from jsonb_each(ch) where jsonb_typeof(value) = 'null';
  vals := jsonb_strip_nulls(ch);

  if p_mode = 'draft' then
    update site_content set data = data || ch, updated_at = now(), updated_by = auth.uid() where id = 'draft';
  elsif p_mode = 'publish' then
    update site_content set data = (data || vals) - nulls, updated_at = now(), updated_by = auth.uid() where id = 'published';
    update site_content set data = data - ks, updated_at = now(), updated_by = auth.uid() where id = 'draft';
  elsif p_mode = 'discard' then
    update site_content set data = data - ks, updated_at = now(), updated_by = auth.uid() where id = 'draft';
  else
    raise exception 'bad mode %', p_mode;
  end if;

  return (select jsonb_object_agg(id, data) from site_content);
end;
$$;

revoke all on function public.site_content_save(text, jsonb) from public, anon;
grant execute on function public.site_content_save(text, jsonb) to authenticated;

notify pgrst, 'reload schema';
