import { createClient } from "@supabase/supabase-js";

// Client-side Supabase initialization
// Set these in your .env.local
// NEXT_PUBLIC_SUPABASE_URL=...
// NEXT_PUBLIC_SUPABASE_ANON_KEY=...
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      db: { schema: "public" },
      auth: { persistSession: false },
      realtime: { params: { eventsPerSecond: 10 } },
    })
  : (null as any);

/*
Required database schema (run on your Supabase project):

-- Rooms table
create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now(),
  last_message text,
  last_message_time timestamptz
);

-- Messages table
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  sender text not null,
  sender_name text not null,
  message text not null,
  avatar text,
  created_at timestamptz not null default now()
);

-- Indexes for performance
create index if not exists idx_messages_room_id_created_at on public.messages(room_id, created_at);

-- Realtime setup (enabled by default for public schema)

-- User Settings table (per anonymous local user id)
create table if not exists public.settings (
  user_id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- Weather cache table (shared cache)
create table if not exists public.weather_cache (
  id uuid primary key default gen_random_uuid(),
  city text,
  lat double precision,
  lon double precision,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
create index if not exists idx_weather_city on public.weather_cache(lower(city));
create index if not exists idx_weather_lat_lon on public.weather_cache(lat, lon);

-- Calculator history table
create table if not exists public.calc_history (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  calculation text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_calc_history_user_created on public.calc_history(user_id, created_at desc);

-- Optional RPC to upsert weather cache by city (avoids race conditions)
create or replace function public.upsert_weather_cache_by_city(p_city text, p_data jsonb)
returns uuid
language plpgsql
as $$
declare v_id uuid;
begin
  if p_city is null or length(trim(p_city)) = 0 then
    raise exception 'City must not be empty';
  end if;
  -- Try update existing row (case-insensitive match)
  update public.weather_cache
     set data = p_data,
         updated_at = now()
   where lower(city) = lower(p_city)
   returning id into v_id;

  if v_id is null then
    insert into public.weather_cache(city, data)
         values (p_city, p_data)
      returning id into v_id;
  end if;
  return v_id;
end; $$;

-- Basic development RLS policies (adjust for production!)
-- Enable RLS
alter table public.rooms enable row level security;
alter table public.messages enable row level security;
alter table public.settings enable row level security;
alter table public.weather_cache enable row level security;
alter table public.calc_history enable row level security;

-- Dev-friendly policies allowing anon read/write (replace with auth-based rules in prod)
do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='rooms' and policyname='rooms_dev_rw') then
    create policy rooms_dev_rw on public.rooms for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='messages' and policyname='messages_dev_rw') then
    create policy messages_dev_rw on public.messages for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='settings' and policyname='settings_dev_rw') then
    create policy settings_dev_rw on public.settings for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='weather_cache' and policyname='weather_dev_rw') then
    create policy weather_dev_rw on public.weather_cache for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='calc_history' and policyname='calc_dev_rw') then
    create policy calc_dev_rw on public.calc_history for all using (true) with check (true);
  end if;
end $$;

-- Recommended production examples (use after enabling Supabase Auth)
-- replace 'auth.uid()' mapping with your user identifier mapping as needed
-- Messages: everyone can read; only insert/delete own messages when sender maps to user
-- create policy messages_select on public.messages for select using (true);
-- create policy messages_insert on public.messages for insert with check (sender = auth.uid()::text);
-- create policy messages_delete on public.messages for delete using (sender = auth.uid()::text);
-- Settings: only owner can read/write
-- create policy settings_owner_rw on public.settings for all using (user_id = auth.uid()::text) with check (user_id = auth.uid()::text);
-- Calc history: only owner can read/write
-- create policy calc_owner_rw on public.calc_history for all using (user_id = auth.uid()::text) with check (user_id = auth.uid()::text);
*/
