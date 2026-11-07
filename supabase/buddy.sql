-- צעד קטן 7.0: "חבר לדרך" (a close person follows what you chose to share, and sends a heart or a kind word)
-- Paste once in the Supabase SQL Editor of project jgqlwuvmwbsgrcqddeyw. Safe to run again.

create table if not exists public.buddy_links (
  token uuid primary key default gen_random_uuid(),
  owner uuid not null default auth.uid() references auth.users(id) on delete cascade,
  label text not null default '',
  snapshot jsonb not null default '{}'::jsonb,
  revoked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists buddy_links_owner on public.buddy_links(owner);

create table if not exists public.buddy_cheers (
  id bigint generated always as identity primary key,
  token uuid not null references public.buddy_links(token) on delete cascade,
  owner uuid not null references auth.users(id) on delete cascade,
  from_name text not null default '',
  emoji text not null default '💛',
  body text not null default '',
  created_at timestamptz not null default now(),
  seen_at timestamptz
);
create index if not exists buddy_cheers_owner on public.buddy_cheers(owner, seen_at);
create index if not exists buddy_cheers_token on public.buddy_cheers(token, created_at);

alter table public.buddy_links enable row level security;
alter table public.buddy_cheers enable row level security;

-- the owner manages their own links; nobody else reads the table directly
drop policy if exists "own links select" on public.buddy_links;
drop policy if exists "own links insert" on public.buddy_links;
drop policy if exists "own links update" on public.buddy_links;
drop policy if exists "own links delete" on public.buddy_links;
create policy "own links select" on public.buddy_links for select to authenticated using (owner = (select auth.uid()));
create policy "own links insert" on public.buddy_links for insert to authenticated with check (owner = (select auth.uid()));
create policy "own links update" on public.buddy_links for update to authenticated using (owner = (select auth.uid())) with check (owner = (select auth.uid()));
create policy "own links delete" on public.buddy_links for delete to authenticated using (owner = (select auth.uid()));

-- the owner reads the cheers they got and marks them seen; cheers are written only through buddy_cheer()
drop policy if exists "own cheers select" on public.buddy_cheers;
drop policy if exists "own cheers update" on public.buddy_cheers;
create policy "own cheers select" on public.buddy_cheers for select to authenticated using (owner = (select auth.uid()));
create policy "own cheers update" on public.buddy_cheers for update to authenticated using (owner = (select auth.uid())) with check (owner = (select auth.uid()));

-- the buddy's page (no account needed): only what the owner chose to share, by the secret link
create or replace function public.buddy_view(p_token uuid)
returns jsonb language sql stable security definer set search_path to '' as $$
  select jsonb_build_object('label', l.label, 'snapshot', l.snapshot, 'updated_at', l.updated_at)
    from public.buddy_links l where l.token = p_token and not l.revoked;
$$;

-- a heart or a kind word from the buddy: short, and at most 30 a day per link
create or replace function public.buddy_cheer(p_token uuid, p_from text, p_emoji text, p_body text)
returns boolean language plpgsql security definer set search_path to '' as $$
declare o uuid;
begin
  select owner into o from public.buddy_links where token = p_token and not revoked;
  if o is null then return false; end if;
  if (select count(*) from public.buddy_cheers where token = p_token and created_at > now() - interval '1 day') >= 30 then return false; end if;
  insert into public.buddy_cheers(token, owner, from_name, emoji, body)
  values (p_token, o, left(coalesce(p_from, ''), 40), left(coalesce(nullif(p_emoji, ''), '💛'), 8), left(coalesce(p_body, ''), 280));
  return true;
end $$;

revoke all on function public.buddy_view(uuid) from public;
revoke all on function public.buddy_cheer(uuid, text, text, text) from public;
grant execute on function public.buddy_view(uuid) to anon, authenticated;
grant execute on function public.buddy_cheer(uuid, text, text, text) to anon, authenticated;
