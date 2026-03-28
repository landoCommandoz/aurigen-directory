-- ============================================================
-- AURIGEN — redemption_events table
-- Tracks property status changes (active → redeemed/struck off)
-- Phase 4D: Redemption Tracking
-- ============================================================

create table if not exists redemption_events (
  id bigint generated always as identity primary key,
  state_code text not null,
  county text not null,
  auction_id bigint references auctions(id),
  parcel_id text not null,
  previous_status text not null,
  new_status text not null,
  detected_at timestamptz not null default now(),
  redemption_confirmed boolean not null default false
);

-- One status transition per parcel per status
create unique index if not exists idx_redemption_events_parcel_status
  on redemption_events (state_code, county, parcel_id, new_status);

-- Enable RLS
alter table redemption_events enable row level security;

-- Service role only
create policy "Service role full access"
  on redemption_events
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
