-- =================================================================
-- FIX ANALYTICS POLICIES MIGRATION
-- =================================================================

-- Drop existing policies that might be blocking inserts
DROP POLICY IF EXISTS "Anyone can insert analytics views" ON analytics_views;
DROP POLICY IF EXISTS "Anyone can insert analytics contacts" ON analytics_contacts;
DROP POLICY IF EXISTS "Anyone can insert analytics social clicks" ON analytics_social_clicks;
DROP POLICY IF EXISTS "Anyone can insert analytics section views" ON analytics_section_views;

-- Create new policies that allow anonymous inserts
CREATE POLICY "Allow anonymous analytics inserts" ON analytics_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous contact analytics inserts" ON analytics_contacts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous social analytics inserts" ON analytics_social_clicks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous section analytics inserts" ON analytics_section_views
  FOR INSERT WITH CHECK (true);

-- Keep the existing select policies for authenticated users
-- (These should already exist from the previous migration) 