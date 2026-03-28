-- Aurigen Referral Tracking
-- Run manually in Supabase SQL Editor after deploy

CREATE TABLE IF NOT EXISTS referrals (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  referrer_email text NOT NULL,
  referred_email text,
  referral_code text NOT NULL,
  converted boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  converted_at timestamptz
);

-- Unique index: one referral code per referrer
CREATE UNIQUE INDEX IF NOT EXISTS idx_referrals_code ON referrals (referral_code);

-- Prevent duplicate referrer+referred pairs
CREATE UNIQUE INDEX IF NOT EXISTS idx_referrals_pair ON referrals (referrer_email, referred_email)
  WHERE referred_email IS NOT NULL;

-- Index for lookup by referred email (conversion tracking)
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON referrals (referred_email)
  WHERE referred_email IS NOT NULL;

-- RLS: service role only
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
