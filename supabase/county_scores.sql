-- ============================================================
-- AURIGEN — county_scores table
-- Stores calculated Opportunity Scores per county
-- Phase 4C: Opportunity Score
-- ============================================================

create table if not exists county_scores (
  id bigint generated always as identity primary key,
  state_code text not null,
  county text not null,
  score integer not null check (score >= 1 and score <= 100),
  score_components jsonb not null default '{}',
  calculated_at timestamptz not null default now()
);

-- Unique index: one score per state+county
create unique index if not exists idx_county_scores_state_county
  on county_scores (state_code, county);

-- Enable RLS
alter table county_scores enable row level security;

-- Service role only: no public access for writes
-- Read access is provided via the county-score.js endpoint
create policy "Service role full access"
  on county_scores
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
