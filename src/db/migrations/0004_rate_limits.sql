-- Rate limit counters (sliding window using timestamps)
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  window_start TIMESTAMP NOT NULL,
  count INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(key, window_start)
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_key_start ON rate_limits(key, window_start);
