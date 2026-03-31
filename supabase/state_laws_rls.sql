-- ============================================================
-- AURIGEN — state_laws RLS
-- Enable Row Level Security on state_laws table.
-- Public read access (no auth required for SELECT).
-- ============================================================

-- Enable Row Level Security on state_laws
ALTER TABLE state_laws ENABLE ROW LEVEL SECURITY;

-- Allow public read access (no auth required for SELECT)
CREATE POLICY "Public read access" ON state_laws
  FOR SELECT
  USING (true);
