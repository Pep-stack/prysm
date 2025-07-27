-- Add geographic analytics tracking
-- This migration adds geographic data tracking to analytics

-- Add geographic columns to analytics_views table
ALTER TABLE analytics_views 
ADD COLUMN IF NOT EXISTS country VARCHAR(100),
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Add geographic columns to analytics_social_clicks table
ALTER TABLE analytics_social_clicks 
ADD COLUMN IF NOT EXISTS country VARCHAR(100),
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Create index for geographic queries
CREATE INDEX IF NOT EXISTS idx_analytics_views_geographic 
ON analytics_views(profile_id, country, city);

CREATE INDEX IF NOT EXISTS idx_analytics_social_clicks_geographic 
ON analytics_social_clicks(profile_id, country, city);

-- Add RLS policies for geographic data
ALTER TABLE analytics_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_social_clicks ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for geographic data
CREATE POLICY "Allow anonymous geographic inserts" ON analytics_views
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous geographic social inserts" ON analytics_social_clicks
FOR INSERT WITH CHECK (true);

-- Allow users to view their own geographic data
CREATE POLICY "Allow users to view own geographic data" ON analytics_views
FOR SELECT USING (
  profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Allow users to view own geographic social data" ON analytics_social_clicks
FOR SELECT USING (
  profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  )
); 