-- Add soft delete columns
ALTER TABLE fleet ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE routes ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Index for soft delete queries
CREATE INDEX IF NOT EXISTS idx_fleet_deleted_at ON fleet(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_routes_deleted_at ON routes(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_bookings_deleted_at ON bookings(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at) WHERE deleted_at IS NULL;
