-- Referral Commission Layer — Session 12
-- Run against production Supabase after deploy

ALTER TABLE referrals
  ADD COLUMN IF NOT EXISTS commission_amount numeric DEFAULT 100.47,
  ADD COLUMN IF NOT EXISTS commission_status text DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS commission_paid_at timestamptz,
  ADD COLUMN IF NOT EXISTS stripe_payout_id text,
  ADD COLUMN IF NOT EXISTS paypal_email text;

-- Index for admin commission dashboard queries
CREATE INDEX IF NOT EXISTS idx_referrals_commission_status ON referrals (commission_status) WHERE converted = true;
