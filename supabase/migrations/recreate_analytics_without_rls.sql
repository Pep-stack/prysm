-- =================================================================
-- RECREATE ANALYTICS TABLES WITHOUT RLS FOR TESTING
-- =================================================================

-- Drop existing analytics tables
DROP TABLE IF EXISTS analytics_section_views;
DROP TABLE IF EXISTS analytics_social_clicks;
DROP TABLE IF EXISTS analytics_contacts;
DROP TABLE IF EXISTS analytics_views;

-- Create analytics_views table without RLS
CREATE TABLE analytics_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  viewer_ip TEXT,
  user_agent TEXT,
  country TEXT,
  city TEXT,
  referrer TEXT,
  device_type TEXT,
  browser TEXT,
  source TEXT DEFAULT 'direct',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics_contacts table without RLS
CREATE TABLE analytics_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  contact_type TEXT NOT NULL,
  viewer_ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics_social_clicks table without RLS
CREATE TABLE analytics_social_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  viewer_ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics_section_views table without RLS
CREATE TABLE analytics_section_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL,
  viewer_ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_analytics_views_profile_id ON analytics_views(profile_id);
CREATE INDEX idx_analytics_views_created_at ON analytics_views(created_at);
CREATE INDEX idx_analytics_views_viewer_ip ON analytics_views(viewer_ip);
CREATE INDEX idx_analytics_views_country ON analytics_views(country);

CREATE INDEX idx_analytics_contacts_profile_id ON analytics_contacts(profile_id);
CREATE INDEX idx_analytics_contacts_created_at ON analytics_contacts(created_at);
CREATE INDEX idx_analytics_contacts_contact_type ON analytics_contacts(contact_type);

CREATE INDEX idx_analytics_social_clicks_profile_id ON analytics_social_clicks(profile_id);
CREATE INDEX idx_analytics_social_clicks_created_at ON analytics_social_clicks(created_at);
CREATE INDEX idx_analytics_social_clicks_platform ON analytics_social_clicks(platform);

CREATE INDEX idx_analytics_section_views_profile_id ON analytics_section_views(profile_id);
CREATE INDEX idx_analytics_section_views_created_at ON analytics_section_views(created_at);
CREATE INDEX idx_analytics_section_views_section_type ON analytics_section_views(section_type);

-- Note: RLS is disabled for testing. In production, you should enable RLS with proper policies. 