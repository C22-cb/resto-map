-- RestoMap database schema
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'restaurant'
    CHECK (type IN ('restaurant', 'bar', 'cafe', 'other')),
  address TEXT,
  arrondissement INTEGER,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  cuisine TEXT,
  price_level INTEGER CHECK (price_level BETWEEN 1 AND 4),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  status TEXT NOT NULL DEFAULT 'to_try'
    CHECK (status IN ('to_try', 'tried', 'favorite')),
  occasion_tags TEXT[] DEFAULT '{}',
  ambiance_tags TEXT[] DEFAULT '{}',
  source_link TEXT,
  source_type TEXT
    CHECK (source_type IN ('tiktok', 'instagram_post', 'instagram_reel', 'manual')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS (public access for MVP - no auth needed)
ALTER TABLE places ENABLE ROW LEVEL SECURITY;

-- Allow all operations for everyone (private app, no auth for MVP)
CREATE POLICY "public_select" ON places FOR SELECT USING (true);
CREATE POLICY "public_insert" ON places FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update" ON places FOR UPDATE USING (true);
CREATE POLICY "public_delete" ON places FOR DELETE USING (true);

-- Index for fast location queries
CREATE INDEX IF NOT EXISTS places_arrondissement_idx ON places (arrondissement);
CREATE INDEX IF NOT EXISTS places_type_idx ON places (type);
CREATE INDEX IF NOT EXISTS places_status_idx ON places (status);
CREATE INDEX IF NOT EXISTS places_created_at_idx ON places (created_at DESC);
