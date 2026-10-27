-- D1 schema for paid extras. No personal data: license keys are stored only as SHA-256 hashes.
CREATE TABLE IF NOT EXISTS license_cache (
  key_hash TEXT PRIMARY KEY,
  valid INTEGER NOT NULL,
  benefit_id TEXT,
  checked_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS follows (
  key_hash TEXT PRIMARY KEY,
  follow TEXT NOT NULL,       -- JSON array like ["TX", "GA:fulton"]
  updated_at INTEGER NOT NULL
);
