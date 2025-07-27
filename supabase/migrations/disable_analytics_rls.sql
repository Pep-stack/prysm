-- =================================================================
-- TEMPORARILY DISABLE ANALYTICS RLS FOR TESTING
-- =================================================================

-- Disable RLS on analytics tables for testing
ALTER TABLE analytics_views DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_social_clicks DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_section_views DISABLE ROW LEVEL SECURITY;

-- Note: This is for testing only. In production, you should use proper RLS policies. 