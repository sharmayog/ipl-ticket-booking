-- =====================================================
-- IPL Ticket Booking - Supabase setup
-- Run this whole file once in: Supabase -> SQL Editor -> New query -> Run
-- It is safe to run again (it will not duplicate data or delete bookings).
-- =====================================================

-- 1. MATCHES table
create table if not exists matches (
  id bigint generated always as identity primary key,
  team1 text not null,
  team2 text not null,
  match_date timestamptz not null,
  venue text not null,
  price_general int not null,
  price_premium int not null,
  price_vip int not null,
  total_seats int not null default 200,
  available_seats int not null default 200 check (available_seats >= 0)
);

-- 2. BOOKINGS table (created earlier; make sure it exists and link it to matches)
create table if not exists bookings (
  id bigint generated always as identity primary key,
  ref text not null,
  match text not null,
  venue text,
  match_date text,
  stand text not null,
  qty int not null,
  total int not null,
  name text not null,
  email text not null,
  phone text not null,
  created_at timestamptz default now()
);

alter table bookings
  add column if not exists match_id bigint references matches(id) on delete set null;

-- 3. Sample data (only inserted if the matches table is empty)
insert into matches
  (team1, team2, match_date, venue, price_general, price_premium, price_vip, total_seats, available_seats)
select * from (values
  ('CSK',  'MI',   '2026-03-28 19:30:00+05:30'::timestamptz, 'M. A. Chidambaram Stadium, Chennai',  1500, 3500,  8000, 200, 200),
  ('RCB',  'KKR',  '2026-03-30 19:30:00+05:30'::timestamptz, 'M. Chinnaswamy Stadium, Bengaluru',   1800, 4000,  9000, 150, 150),
  ('DC',   'SRH',  '2026-04-02 19:30:00+05:30'::timestamptz, 'Arun Jaitley Stadium, Delhi',         1200, 3000,  7000, 180, 180),
  ('GT',   'RR',   '2026-04-04 15:30:00+05:30'::timestamptz, 'Narendra Modi Stadium, Ahmedabad',    1300, 3200,  7500, 250, 250),
  ('MI',   'RCB',  '2026-04-06 19:30:00+05:30'::timestamptz, 'Wankhede Stadium, Mumbai',            2000, 4500, 10000,  60,  60),
  ('KKR',  'CSK',  '2026-04-09 19:30:00+05:30'::timestamptz, 'Eden Gardens, Kolkata',               1600, 3800,  8500, 200, 200),
  ('SRH',  'PBKS', '2026-04-11 15:30:00+05:30'::timestamptz, 'Rajiv Gandhi Stadium, Hyderabad',     1100, 2800,  6500, 170, 170),
  ('RR',   'LSG',  '2026-04-13 19:30:00+05:30'::timestamptz, 'Sawai Mansingh Stadium, Jaipur',      1200, 3000,  7000, 120, 120)
) as v(team1, team2, match_date, venue, price_general, price_premium, price_vip, total_seats, available_seats)
where not exists (select 1 from matches);

-- 4. Row level security + policies (demo: open to the public site)
alter table matches  enable row level security;
alter table bookings enable row level security;

drop policy if exists "matches read"   on matches;
drop policy if exists "matches update" on matches;
create policy "matches read"   on matches for select to anon, authenticated using (true);
create policy "matches update" on matches for update to anon, authenticated using (true) with check (true);

drop policy if exists "public insert" on bookings;
drop policy if exists "public read"   on bookings;
drop policy if exists "public delete" on bookings;
create policy "public insert" on bookings for insert to anon, authenticated with check (true);
create policy "public read"   on bookings for select to anon, authenticated using (true);
create policy "public delete" on bookings for delete to anon, authenticated using (true);

-- 5. Table permissions
grant usage on schema public to anon, authenticated;
grant select, update on table public.matches  to anon, authenticated;
grant select, insert, delete on table public.bookings to anon, authenticated;

-- 6. Turn on Realtime for both tables
do $$
begin
  if not exists (select 1 from pg_publication_tables
                 where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'matches') then
    alter publication supabase_realtime add table public.matches;
  end if;
  if not exists (select 1 from pg_publication_tables
                 where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'bookings') then
    alter publication supabase_realtime add table public.bookings;
  end if;
end $$;
