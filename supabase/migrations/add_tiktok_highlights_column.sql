-- =================================================================
-- ADD TIKTOK HIGHLIGHTS COLUMN MIGRATION
-- =================================================================

-- Add tiktok_highlights column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS tiktok_highlights JSONB DEFAULT '[]'::jsonb;

-- Add comment to document the column purpose
COMMENT ON COLUMN public.profiles.tiktok_highlights IS 'JSONB array containing TikTok highlight objects with url, title, and description fields';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_tiktok_highlights ON profiles USING GIN (tiktok_highlights);

-- Update existing profiles to have empty array if null
UPDATE public.profiles 
SET tiktok_highlights = '[]'::jsonb 
WHERE tiktok_highlights IS NULL;

-- Example of expected data format:
-- [
--   {
--     "id": 1234567890,
--     "url": "https://www.tiktok.com/@username/video/1234567890123456789",
--     "title": "My Best TikTok",
--     "description": "Check out this amazing TikTok video!"
--   },
--   {
--     "id": 1234567891,
--     "url": "https://www.tiktok.com/@username/video/example123",
--     "title": "Another Great TikTok",
--     "description": "Another awesome TikTok to showcase"
--   }
-- ] 