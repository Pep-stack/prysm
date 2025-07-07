-- =================================================================
-- SIMPLIFY PROFILE SCHEMA
-- =================================================================

-- Add new consolidated columns
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS social_media JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS sections JSONB DEFAULT '[]';

-- Migrate existing social media data to JSONB
UPDATE public.profiles 
SET social_media = jsonb_build_object(
  'linkedin', COALESCE(linkedin, ''),
  'x_profile', COALESCE(x_profile, ''),
  'instagram', COALESCE(instagram, ''),
  'facebook', COALESCE(facebook, ''),
  'youtube_channel', COALESCE(youtube_channel, ''),
  'tiktok', COALESCE(tiktok, ''),
  'github_gitlab', COALESCE(github_gitlab, ''),
  'dribbble_behance', COALESCE(dribbble_behance, ''),
  'stackoverflow', COALESCE(stackoverflow, '')
)
WHERE social_media = '{}';

-- Migrate existing sections data
UPDATE public.profiles 
SET sections = COALESCE(card_sections, '[]'::jsonb)
WHERE sections = '[]';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_social_media ON profiles USING GIN (social_media);
CREATE INDEX IF NOT EXISTS idx_profiles_sections ON profiles USING GIN (sections);

-- Add comments for documentation
COMMENT ON COLUMN profiles.social_media IS 'Consolidated social media links as JSONB';
COMMENT ON COLUMN profiles.sections IS 'Card sections configuration as JSONB'; 