-- =================================================================
-- ADD CARD_PROFILES AND CARD_IMAGES COLUMNS MIGRATION
-- =================================================================

-- Add card_profiles column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS card_profiles JSONB DEFAULT '{}';

-- Add card_images column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS card_images JSONB DEFAULT '{}';

-- Add card_display_settings column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS card_display_settings JSONB DEFAULT '{}';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_card_profiles ON profiles USING GIN (card_profiles);
CREATE INDEX IF NOT EXISTS idx_profiles_card_images ON profiles USING GIN (card_images);
CREATE INDEX IF NOT EXISTS idx_profiles_card_display_settings ON profiles USING GIN (card_display_settings);

-- Add comments for documentation
COMMENT ON COLUMN profiles.card_profiles IS 'Personal information per card type as JSONB';
COMMENT ON COLUMN profiles.card_images IS 'Avatar and header images per card type as JSONB';
COMMENT ON COLUMN profiles.card_display_settings IS 'Display settings per card type as JSONB';

-- Example of expected card_profiles data format:
-- {
--   "pro": {
--     "name": "John Doe",
--     "headline": "Full Stack Developer",
--     "bio": "Passionate developer with 5+ years experience...",
--     "location": "Amsterdam, NL",
--     "website": "https://example.com",
--     "availability_status": "available",
--     "show_availability": true,
--     "phone": "+31 6 12345678",
--     "email": "john@example.com",
--     "company": "Tech Corp",
--     "job_title": "Senior Developer",
--     "experience_years": "5+",
--     "languages": "Dutch, English",
--     "timezone": "Europe/Amsterdam"
--   }
-- }

-- Example of expected card_images data format:
-- {
--   "pro": {
--     "avatar_url": "https://example.com/avatar.jpg",
--     "header_url": "https://example.com/header.jpg"
--   }
-- }

-- Example of expected card_display_settings data format:
-- {
--   "pro": {
--     "display_type": "avatar",
--     "avatar_size": "medium",
--     "avatar_shape": "circle",
--     "avatar_position": "left"
--   }
-- } 