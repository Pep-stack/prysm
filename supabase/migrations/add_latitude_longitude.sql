-- Add latitude and longitude columns to analytics tables
-- This migration adds geographic coordinates to analytics tracking

-- Add latitude and longitude to analytics_views table
ALTER TABLE analytics_views 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Add latitude and longitude to analytics_social_clicks table
ALTER TABLE analytics_social_clicks 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Create indexes for geographic queries
CREATE INDEX IF NOT EXISTS idx_analytics_views_lat_lng 
ON analytics_views(latitude, longitude);

CREATE INDEX IF NOT EXISTS idx_analytics_social_clicks_lat_lng 
ON analytics_social_clicks(latitude, longitude); 