-- Add expires_at column to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

-- Add index on expires_at to help with cleanup queries
CREATE INDEX IF NOT EXISTS idx_bookings_expires_at ON bookings(expires_at);

-- Add index on status to help with filtering
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
