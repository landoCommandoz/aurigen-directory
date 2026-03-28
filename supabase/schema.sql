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
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  alert_text   TEXT NOT NULL,
  type         TEXT DEFAULT 'info',              -- info | upcoming | intel | warning | critical
  state_code   CHAR(2),
  date         DATE,                             -- display date for the alert
  auction_date DATE,                             -- links to the auction this alert is about
  active       BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (state_code, auction_date, alert_text)
);

CREATE INDEX IF NOT EXISTS idx_pulse_state ON pulse_alerts (state_code);
CREATE INDEX IF NOT EXISTS idx_pulse_active ON pulse_alerts (active);
CREATE INDEX IF NOT EXISTS idx_pulse_auction_date ON pulse_alerts (auction_date);

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

-- ── Paid Users table (Stripe webhook → access verification) ───
CREATE TABLE IF NOT EXISTS paid_users (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email             TEXT NOT NULL UNIQUE,
  stripe_session_id TEXT,
  paid_at           TIMESTAMPTZ DEFAULT NOW(),
  active            BOOLEAN DEFAULT TRUE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_paid_users_email ON paid_users (email);

-- Enable RLS — only service role key can read/write
ALTER TABLE paid_users ENABLE ROW LEVEL SECURITY;

-- No public policies = no access via anon key or authenticated key.
-- Only the service_role key (used by Netlify functions) bypasses RLS.

-- ── Free Users table (email capture → Beehiiv subscription) ───
CREATE TABLE IF NOT EXISTS free_users (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email           TEXT NOT NULL UNIQUE,
  language        TEXT DEFAULT 'en',
  source          TEXT DEFAULT 'gate',
  subscribed_at   TIMESTAMPTZ DEFAULT NOW(),
  beehiiv_synced  BOOLEAN DEFAULT FALSE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_free_users_email ON free_users (email);

-- Enable RLS — only service role key can read/write
ALTER TABLE free_users ENABLE ROW LEVEL SECURITY;

-- No public policies = no access via anon key or authenticated key.
-- Only the service_role key (used by Netlify functions) bypasses RLS.

-- ── Consumed Sessions table (one-time-use Stripe session verification) ─
CREATE TABLE IF NOT EXISTS consumed_sessions (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_session_id TEXT NOT NULL UNIQUE,
  email             TEXT NOT NULL,
  consumed_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_consumed_sessions_sid ON consumed_sessions (stripe_session_id);

-- Enable RLS — only service role key can read/write
ALTER TABLE consumed_sessions ENABLE ROW LEVEL SECURITY;
-- No public policies = service role only.
