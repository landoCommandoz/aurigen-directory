-- Aurigen Weekly Reports
-- Run manually in Supabase SQL Editor after deploy

CREATE TABLE IF NOT EXISTS weekly_reports (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  week_of date NOT NULL,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  generated_at timestamptz DEFAULT now()
);

-- Unique index: one report per week
CREATE UNIQUE INDEX IF NOT EXISTS idx_weekly_reports_week ON weekly_reports (week_of);

-- RLS: service role only
ALTER TABLE weekly_reports ENABLE ROW LEVEL SECURITY;
