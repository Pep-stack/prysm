-- =================================================================
-- ADD YOUTUBE HIGHLIGHTS COLUMN MIGRATION
-- =================================================================

-- Add youtube_highlights column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS youtube_highlights JSONB DEFAULT '[]'::jsonb;

-- Add comment to document the column purpose
COMMENT ON COLUMN public.profiles.youtube_highlights IS 'JSONB array containing YouTube highlight objects with url, title, and description fields';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_youtube_highlights ON profiles USING GIN (youtube_highlights);

-- Update existing profiles to have empty array if null
UPDATE public.profiles 
SET youtube_highlights = '[]'::jsonb 
WHERE youtube_highlights IS NULL;

-- Example of expected data format:
-- [
--   {
--     "id": 1234567890,
--     "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
--     "title": "My Best Video",
--     "description": "Check out this amazing YouTube video!"
--   },
--   {
--     "id": 1234567891,
--     "url": "https://www.youtube.com/watch?v=example123",
--     "title": "Another Great Video",
--     "description": "Another awesome video to showcase"
--   }
-- ] 