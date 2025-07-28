-- =================================================================
-- ADD X HIGHLIGHTS COLUMN MIGRATION
-- =================================================================

-- Add x_highlights column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS x_highlights JSONB DEFAULT '[]'::jsonb;

-- Add comment to document the column purpose
COMMENT ON COLUMN public.profiles.x_highlights IS 'JSONB array containing X highlight objects with url, title, and description fields';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_x_highlights ON profiles USING GIN (x_highlights);

-- Update existing profiles to have empty array if null
UPDATE public.profiles 
SET x_highlights = '[]'::jsonb 
WHERE x_highlights IS NULL;

-- Example of expected data format:
-- [
--   {
--     "id": 1234567890,
--     "url": "https://x.com/username/status/123456789",
--     "title": "X Post",
--     "description": "Check out this amazing X post!"
--   },
--   {
--     "id": 1234567891,
--     "url": "https://x.com/username/status/987654321",
--     "title": "Another X Post",
--     "description": "Another great X post to showcase"
--   }
-- ] 