-- Aurigen Scraper — Supabase Schema
-- Run once in the Supabase SQL editor to create tables

-- ── Auctions table ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS auctions (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  state         TEXT NOT NULL,
  state_code    CHAR(2) NOT NULL,
  county        TEXT NOT NULL,
  auction_date  DATE NOT NULL,
  registration_deadline DATE,
  status        TEXT DEFAULT 'Confirmed',      -- Confirmed | Estimated | Cancelled
  platform      TEXT NOT NULL,                  -- realauction | govease | sri | bid4assets
  platform_url  TEXT,
  bid_method    TEXT DEFAULT 'Online',          -- Online | In-Person | Hybrid
  active        BOOLEAN DEFAULT TRUE,
  source        TEXT DEFAULT 'scraper',         -- scraper | seed | manual
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (state_code, county, auction_date, platform)
);

CREATE INDEX IF NOT EXISTS idx_auctions_state_code ON auctions (state_code);
CREATE INDEX IF NOT EXISTS idx_auctions_date ON auctions (auction_date);
CREATE INDEX IF NOT EXISTS idx_auctions_active ON auctions (active);

-- ── Pulse Alerts table ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pulse_alerts (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title       TEXT NOT NULL,
  body        TEXT,
  state_code  CHAR(2),
  county      TEXT,
  alert_type  TEXT DEFAULT 'info',             -- info | warning | deadline | new_auction
  url         TEXT,
  active      BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pulse_state ON pulse_alerts (state_code);
CREATE INDEX IF NOT EXISTS idx_pulse_active ON pulse_alerts (active);

-- ── Scrape Log table ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS scrape_log (
  id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  platform       TEXT NOT NULL,
  records_found  INT DEFAULT 0,
  records_added  INT DEFAULT 0,
  errors         TEXT,
  success        BOOLEAN DEFAULT TRUE,
  ran_at         TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scrape_log_platform ON scrape_log (platform);
CREATE INDEX IF NOT EXISTS idx_scrape_log_ran_at ON scrape_log (ran_at);
