-- Pulse Alerts — user-created alerts support — Session 12
-- Run against production Supabase after deploy

ALTER TABLE pulse_alerts
  ADD COLUMN IF NOT EXISTS created_by text;

-- Index for user's own alerts
CREATE INDEX IF NOT EXISTS idx_pulse_alerts_created_by ON pulse_alerts (created_by) WHERE created_by IS NOT NULL;
