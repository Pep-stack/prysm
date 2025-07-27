-- =================================================================
-- ANALYTICS TABLES MIGRATION
-- =================================================================

-- Create analytics_views table for tracking page views
CREATE TABLE IF NOT EXISTS analytics_views (
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

-- Create analytics_contacts table for tracking contact clicks
CREATE TABLE IF NOT EXISTS analytics_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  contact_type TEXT NOT NULL, -- 'email', 'phone', 'whatsapp', 'linkedin', etc.
  viewer_ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics_social_clicks table for tracking social media clicks
CREATE TABLE IF NOT EXISTS analytics_social_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL, -- 'linkedin', 'instagram', 'github', etc.
  viewer_ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics_section_views table for tracking section interactions
CREATE TABLE IF NOT EXISTS analytics_section_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL, -- 'experience', 'projects', 'skills', etc.
  viewer_ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =================================================================
-- INDEXES FOR PERFORMANCE
-- =================================================================

-- Indexes for analytics_views
CREATE INDEX IF NOT EXISTS idx_analytics_views_profile_id ON analytics_views(profile_id);
CREATE INDEX IF NOT EXISTS idx_analytics_views_created_at ON analytics_views(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_views_viewer_ip ON analytics_views(viewer_ip);
CREATE INDEX IF NOT EXISTS idx_analytics_views_country ON analytics_views(country);

-- Indexes for analytics_contacts
CREATE INDEX IF NOT EXISTS idx_analytics_contacts_profile_id ON analytics_contacts(profile_id);
CREATE INDEX IF NOT EXISTS idx_analytics_contacts_created_at ON analytics_contacts(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_contacts_contact_type ON analytics_contacts(contact_type);

-- Indexes for analytics_social_clicks
CREATE INDEX IF NOT EXISTS idx_analytics_social_clicks_profile_id ON analytics_social_clicks(profile_id);
CREATE INDEX IF NOT EXISTS idx_analytics_social_clicks_created_at ON analytics_social_clicks(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_social_clicks_platform ON analytics_social_clicks(platform);

-- Indexes for analytics_section_views
CREATE INDEX IF NOT EXISTS idx_analytics_section_views_profile_id ON analytics_section_views(profile_id);
CREATE INDEX IF NOT EXISTS idx_analytics_section_views_created_at ON analytics_section_views(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_section_views_section_type ON analytics_section_views(section_type);

-- =================================================================
-- ROW LEVEL SECURITY (RLS)
-- =================================================================

-- Enable RLS on all analytics tables
ALTER TABLE analytics_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_social_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_section_views ENABLE ROW LEVEL SECURITY;

-- =================================================================
-- POLICIES FOR ANALYTICS TABLES
-- =================================================================

-- Policies for analytics_views
-- Anyone can insert (for tracking)
CREATE POLICY "Anyone can insert analytics views" ON analytics_views
  FOR INSERT WITH CHECK (true);

-- Profile owners can view their own analytics
CREATE POLICY "Users can view their own analytics views" ON analytics_views
  FOR SELECT USING (
    profile_id IN (
      SELECT id FROM profiles WHERE id = auth.uid()
    )
  );

-- Policies for analytics_contacts
-- Anyone can insert (for tracking)
CREATE POLICY "Anyone can insert analytics contacts" ON analytics_contacts
  FOR INSERT WITH CHECK (true);

-- Profile owners can view their own contact analytics
CREATE POLICY "Users can view their own contact analytics" ON analytics_contacts
  FOR SELECT USING (
    profile_id IN (
      SELECT id FROM profiles WHERE id = auth.uid()
    )
  );

-- Policies for analytics_social_clicks
-- Anyone can insert (for tracking)
CREATE POLICY "Anyone can insert analytics social clicks" ON analytics_social_clicks
  FOR INSERT WITH CHECK (true);

-- Profile owners can view their own social click analytics
CREATE POLICY "Users can view their own social click analytics" ON analytics_social_clicks
  FOR SELECT USING (
    profile_id IN (
      SELECT id FROM profiles WHERE id = auth.uid()
    )
  );

-- Policies for analytics_section_views
-- Anyone can insert (for tracking)
CREATE POLICY "Anyone can insert analytics section views" ON analytics_section_views
  FOR INSERT WITH CHECK (true);

-- Profile owners can view their own section view analytics
CREATE POLICY "Users can view their own section view analytics" ON analytics_section_views
  FOR SELECT USING (
    profile_id IN (
      SELECT id FROM profiles WHERE id = auth.uid()
    )
  );

-- =================================================================
-- COMMENTS FOR DOCUMENTATION
-- =================================================================

COMMENT ON TABLE analytics_views IS 'Tracks page views for public profiles';
COMMENT ON TABLE analytics_contacts IS 'Tracks contact button clicks (email, phone, etc.)';
COMMENT ON TABLE analytics_social_clicks IS 'Tracks social media link clicks';
COMMENT ON TABLE analytics_section_views IS 'Tracks section-specific interactions';

COMMENT ON COLUMN analytics_views.source IS 'How the visitor found the profile: direct, qr_code, social_media, etc.';
COMMENT ON COLUMN analytics_views.country IS 'Country of visitor (from IP geolocation)';
COMMENT ON COLUMN analytics_views.city IS 'City of visitor (from IP geolocation)';
COMMENT ON COLUMN analytics_views.referrer IS 'Where the visitor came from (document.referrer)';
COMMENT ON COLUMN analytics_views.device_type IS 'Device type: mobile, desktop, tablet';
COMMENT ON COLUMN analytics_views.browser IS 'Browser: chrome, firefox, safari, etc.';

COMMENT ON COLUMN analytics_contacts.contact_type IS 'Type of contact: email, phone, whatsapp, linkedin, etc.';
COMMENT ON COLUMN analytics_social_clicks.platform IS 'Social platform: linkedin, instagram, github, etc.';
COMMENT ON COLUMN analytics_section_views.section_type IS 'Section type: experience, projects, skills, etc.'; 