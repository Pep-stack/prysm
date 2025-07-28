-- =================================================================
-- ADD LINKEDIN HIGHLIGHTS COLUMN MIGRATION
-- =================================================================

-- Add linkedin_highlights column to profiles table if it doesn't exist
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS linkedin_highlights JSONB DEFAULT '[]'::jsonb;

-- Add comment to document the column purpose
COMMENT ON COLUMN public.profiles.linkedin_highlights IS 'JSONB array containing LinkedIn highlight objects with url, title, and description fields';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_linkedin_highlights ON profiles USING GIN (linkedin_highlights);

-- Update existing profiles to have empty array if null
UPDATE public.profiles
SET linkedin_highlights = '[]'::jsonb
WHERE linkedin_highlights IS NULL;

-- Example of expected data format:
-- [
--   {
--     "id": 1234567890,
--     "url": "https://www.linkedin.com/posts/username_activity_1234567890",
--     "title": "My Professional Achievement",
--     "description": "Check out this amazing LinkedIn post!"
--   },
--   {
--     "id": 1234567891,
--     "url": "https://www.linkedin.com/posts/topic_activity_1234567891",
--     "title": "Thought Leadership Article",
--     "description": "Another great professional insight"
--   }
-- ] 