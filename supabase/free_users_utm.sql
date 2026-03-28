-- Aurigen — UTM Attribution Tracking
-- Stores UTM parameters from free-tier email captures.
-- Multiple rows per email (one per visit with UTM params).
-- Run this in Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS free_users_utm (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email       TEXT NOT NULL,
  utm_source  TEXT,
  utm_medium  TEXT,
  utm_campaign TEXT,
  utm_term    TEXT,
  utm_content TEXT,
  captured_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_free_users_utm_email ON free_users_utm (email);

-- Index for campaign analysis
CREATE INDEX IF NOT EXISTS idx_free_users_utm_campaign ON free_users_utm (utm_campaign, captured_at);

-- Also add UTM columns to free_users if they don't exist
ALTER TABLE free_users ADD COLUMN IF NOT EXISTS utm_source TEXT;
ALTER TABLE free_users ADD COLUMN IF NOT EXISTS utm_medium TEXT;
ALTER TABLE free_users ADD COLUMN IF NOT EXISTS utm_campaign TEXT;
