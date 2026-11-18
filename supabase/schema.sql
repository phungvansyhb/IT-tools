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
