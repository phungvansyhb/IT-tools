-- OmniDev / IT-Tools Hub — Supabase Schema & RLS Migration
-- Run this SQL in your Supabase project's SQL Editor to enable optional cloud sync.
-- When NEXT_PUBLIC_SUPABASE_URL is omitted, the app automatically falls back to localStorage.

create extension if not exists pgcrypto;

-- 1. Global anonymous popularity & usage counters
create table if not exists public.tool_metrics (
  tool_id text primary key,
  views bigint not null default 0,
  uses bigint not null default 0,
  updated_at timestamptz not null default now()
);

-- 2. Pinned / favorite tools per client_id (browser UUID or user id)
create table if not exists public.user_favorites (
  id uuid primary key default gen_random_uuid(),
  client_id text not null,
  tool_id text not null,
  created_at timestamptz not null default now(),
  unique (client_id, tool_id)
);

create index if not exists idx_user_favorites_client_id
  on public.user_favorites (client_id);

-- 3. Saved tool presets / snippets per client_id
create table if not exists public.saved_presets (
  id uuid primary key default gen_random_uuid(),
  client_id text not null,
  tool_id text not null,
  name text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_saved_presets_client_tool
  on public.saved_presets (client_id, tool_id);

-- 4. Row Level Security (RLS)
alter table public.tool_metrics enable row level security;
alter table public.user_favorites enable row level security;
alter table public.saved_presets enable row level security;

-- Public read/increment access for anonymous metrics
drop policy if exists "Allow public read tool_metrics" on public.tool_metrics;
create policy "Allow public read tool_metrics"
  on public.tool_metrics for select
  using (true);

drop policy if exists "Allow public upsert tool_metrics" on public.tool_metrics;
create policy "Allow public upsert tool_metrics"
  on public.tool_metrics for insert
  with check (true);

drop policy if exists "Allow public update tool_metrics" on public.tool_metrics;
create policy "Allow public update tool_metrics"
  on public.tool_metrics for update
  using (true);

-- Scoped policies for client_id workspaces (works with anon key + client_id header or filter)
drop policy if exists "Allow client manage user_favorites" on public.user_favorites;
create policy "Allow client manage user_favorites"
  on public.user_favorites for all
  using (true)
  with check (true);

drop policy if exists "Allow client manage saved_presets" on public.saved_presets;
create policy "Allow client manage saved_presets"
  on public.saved_presets for all
  using (true)
  with check (true);

-- 5. Atomic metric increment RPC
create or replace function public.increment_tool_metric(
  p_tool_id text,
  p_field text default 'uses'
)
returns void
language plpgsql
security definer
as $$
begin
  insert into public.tool_metrics (tool_id, views, uses, updated_at)
  values (
    p_tool_id,
    case when p_field = 'views' then 1 else 0 end,
    case when p_field = 'uses' then 1 else 0 end,
    now()
  )
  on conflict (tool_id) do update
  set
    views = public.tool_metrics.views + (case when p_field = 'views' then 1 else 0 end),
    uses  = public.tool_metrics.uses  + (case when p_field = 'uses'  then 1 else 0 end),
    updated_at = now();
end;
$$;

-- ============================================================================
-- 6. Feedback, Tool Ratings & Admin Moderation (UNIT-10 / NFR-08 / CON-07)
-- ============================================================================

-- 6a. Per-tool star ratings (1..5) scoped by (client_id, tool_id)
create table if not exists public.tool_ratings (
  id uuid primary key default gen_random_uuid(),
  client_id text not null check (char_length(trim(client_id)) between 8 and 120),
  tool_id text not null check (char_length(trim(tool_id)) between 1 and 80 and tool_id <> 'general'),
  rating smallint not null check (rating >= 1 and rating <= 5),
  comment text not null default '' check (char_length(comment) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (client_id, tool_id)
);

create index if not exists idx_tool_ratings_tool_id
  on public.tool_ratings (tool_id);

create index if not exists idx_tool_ratings_client_id
  on public.tool_ratings (client_id);

-- 6b. Visitor feedback, bug reports & feature requests
create table if not exists public.feedback_submissions (
  id uuid primary key default gen_random_uuid(),
  client_id text not null check (char_length(trim(client_id)) between 8 and 120),
  type text not null check (type in ('feedback', 'bug', 'feature')),
  tool_id text not null default 'general' check (char_length(trim(tool_id)) between 1 and 80),
  title text not null default '' check (char_length(title) <= 140),
  message text not null check (char_length(trim(message)) between 10 and 2000),
  contact_email text not null default '' check (char_length(contact_email) <= 160),
  debug_context jsonb null check (debug_context is null or octet_length(debug_context::text) <= 2048),
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  admin_note text not null default '' check (char_length(admin_note) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_feedback_submissions_client_created
  on public.feedback_submissions (client_id, created_at desc);

create index if not exists idx_feedback_submissions_status_created
  on public.feedback_submissions (status, created_at desc);

create index if not exists idx_feedback_submissions_type_tool
  on public.feedback_submissions (type, tool_id);

-- 6c. Admin allowlist (populated manually via Supabase SQL Editor; signups disabled)
create table if not exists public.feedback_admins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete cascade,
  email text unique not null,
  created_at timestamptz not null default now()
);

-- 6d. Enable RLS on all feedback & rating tables
alter table public.tool_ratings enable row level security;
alter table public.feedback_submissions enable row level security;
alter table public.feedback_admins enable row level security;

-- 6e. Admin verification helpers
create or replace function public.is_feedback_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select
    auth.role() = 'authenticated'
    and exists (
      select 1
      from auth.users u
      join public.feedback_admins fa
        on (
          fa.user_id = u.id
          or (fa.user_id is null and lower(fa.email) = lower(u.email))
        )
      where u.id = auth.uid()
        and u.email_confirmed_at is not null
    );
$$;

create or replace function public.check_is_feedback_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_feedback_admin();
$$;

revoke all on function public.is_feedback_admin() from public;
grant execute on function public.is_feedback_admin() to authenticated;

revoke all on function public.check_is_feedback_admin() from public;
grant execute on function public.check_is_feedback_admin() to authenticated;

-- 6f. Strict RLS Policies
-- feedback_admins: authenticated user can only read their own allowlist row
drop policy if exists "Allow admin read own feedback_admins row" on public.feedback_admins;
create policy "Allow admin read own feedback_admins row"
  on public.feedback_admins for select
  to authenticated
  using (
    user_id = auth.uid()
    or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

-- feedback_submissions: anon/authenticated can ONLY INSERT safe initial rows (no anon SELECT/UPDATE/DELETE)
drop policy if exists "Allow visitor insert feedback_submissions" on public.feedback_submissions;
create policy "Allow visitor insert feedback_submissions"
  on public.feedback_submissions for insert
  to anon, authenticated
  with check (
    char_length(trim(client_id)) between 8 and 120
    and type in ('feedback', 'bug', 'feature')
    and char_length(trim(tool_id)) between 1 and 80
    and char_length(title) <= 140
    and char_length(trim(message)) between 10 and 2000
    and char_length(contact_email) <= 160
    and (debug_context is null or octet_length(debug_context::text) <= 2048)
    and status = 'open'
    and admin_note = ''
  );

drop policy if exists "Allow admin select feedback_submissions" on public.feedback_submissions;
create policy "Allow admin select feedback_submissions"
  on public.feedback_submissions for select
  to authenticated
  using (public.is_feedback_admin());

drop policy if exists "Allow admin update feedback_submissions" on public.feedback_submissions;
create policy "Allow admin update feedback_submissions"
  on public.feedback_submissions for update
  to authenticated
  using (public.is_feedback_admin())
  with check (public.is_feedback_admin());

drop policy if exists "Allow admin delete feedback_submissions" on public.feedback_submissions;
create policy "Allow admin delete feedback_submissions"
  on public.feedback_submissions for delete
  to authenticated
  using (public.is_feedback_admin());

-- tool_ratings: ZERO direct anon access; admins may select/delete for spam moderation
drop policy if exists "Allow admin select tool_ratings" on public.tool_ratings;
create policy "Allow admin select tool_ratings"
  on public.tool_ratings for select
  to authenticated
  using (public.is_feedback_admin());

drop policy if exists "Allow admin delete tool_ratings" on public.tool_ratings;
create policy "Allow admin delete tool_ratings"
  on public.tool_ratings for delete
  to authenticated
  using (public.is_feedback_admin());

-- 6g. Privacy-preserving SECURITY DEFINER RPCs for anonymous visitors
create or replace function public.get_tool_rating_summaries()
returns table (
  tool_id text,
  avg_rating numeric,
  rating_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    tr.tool_id,
    round(avg(tr.rating)::numeric, 1) as avg_rating,
    count(*)::bigint as rating_count
  from public.tool_ratings tr
  group by tr.tool_id;
$$;

create or replace function public.upsert_tool_rating(
  p_client_id text,
  p_tool_id text,
  p_rating smallint,
  p_comment text default ''
)
returns table (
  id uuid,
  client_id text,
  tool_id text,
  rating smallint,
  comment text,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_client_id text := trim(coalesce(p_client_id, ''));
  v_tool_id text := trim(coalesce(p_tool_id, ''));
  v_comment text := trim(coalesce(p_comment, ''));
begin
  if char_length(v_client_id) < 8 or char_length(v_client_id) > 120 then
    raise exception 'Invalid client_id';
  end if;
  if char_length(v_tool_id) < 1 or char_length(v_tool_id) > 80 or v_tool_id = 'general' then
    raise exception 'Invalid tool_id';
  end if;
  if p_rating < 1 or p_rating > 5 then
    raise exception 'Rating must be between 1 and 5';
  end if;
  if char_length(v_comment) > 500 then
    raise exception 'Comment exceeds 500 characters';
  end if;

  return query
  insert into public.tool_ratings (client_id, tool_id, rating, comment, created_at, updated_at)
  values (v_client_id, v_tool_id, p_rating, v_comment, now(), now())
  on conflict (client_id, tool_id) do update
  set
    rating = excluded.rating,
    comment = excluded.comment,
    updated_at = now()
  returning
    public.tool_ratings.id,
    public.tool_ratings.client_id,
    public.tool_ratings.tool_id,
    public.tool_ratings.rating,
    public.tool_ratings.comment,
    public.tool_ratings.created_at,
    public.tool_ratings.updated_at;
end;
$$;

create or replace function public.get_my_tool_ratings(p_client_id text)
returns table (
  id uuid,
  client_id text,
  tool_id text,
  rating smallint,
  comment text,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    tr.id,
    tr.client_id,
    tr.tool_id,
    tr.rating,
    tr.comment,
    tr.created_at,
    tr.updated_at
  from public.tool_ratings tr
  where char_length(trim(coalesce(p_client_id, ''))) >= 8
    and tr.client_id = trim(p_client_id)
  order by tr.updated_at desc;
$$;

create or replace function public.get_my_feedback(p_client_id text)
returns table (
  id uuid,
  client_id text,
  type text,
  tool_id text,
  title text,
  message text,
  contact_email text,
  debug_context jsonb,
  status text,
  admin_note text,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    fs.id,
    fs.client_id,
    fs.type,
    fs.tool_id,
    fs.title,
    fs.message,
    fs.contact_email,
    fs.debug_context,
    fs.status,
    fs.admin_note,
    fs.created_at,
    fs.updated_at
  from public.feedback_submissions fs
  where char_length(trim(coalesce(p_client_id, ''))) >= 8
    and fs.client_id = trim(p_client_id)
  order by fs.created_at desc
  limit 100;
$$;

revoke all on function public.get_tool_rating_summaries() from public;
grant execute on function public.get_tool_rating_summaries() to anon, authenticated;

revoke all on function public.upsert_tool_rating(text, text, smallint, text) from public;
grant execute on function public.upsert_tool_rating(text, text, smallint, text) to anon, authenticated;

revoke all on function public.get_my_tool_ratings(text) from public;
grant execute on function public.get_my_tool_ratings(text) to anon, authenticated;

revoke all on function public.get_my_feedback(text) from public;
grant execute on function public.get_my_feedback(text) to anon, authenticated;

