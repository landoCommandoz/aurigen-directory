-- ============================================================
-- AURIGEN — county_redemption_rates table
-- Aggregated redemption rates per county
-- Phase 4D: Redemption Tracking
-- ============================================================

create table if not exists county_redemption_rates (
  id bigint generated always as identity primary key,
  state_code text not null,
  county text not null,
  total_tracked integer not null default 0,
  total_redeemed integer not null default 0,
  redemption_rate numeric not null default 0.0,
  calculated_at timestamptz not null default now()
);

-- One rate per county
create unique index if not exists idx_county_redemption_rates_state_county
  on county_redemption_rates (state_code, county);

-- Enable RLS
alter table county_redemption_rates enable row level security;

-- Service role only
create policy "Service role full access"
  on county_redemption_rates
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
