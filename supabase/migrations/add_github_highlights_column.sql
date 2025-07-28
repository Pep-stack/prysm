-- =================================================================
-- ADD GITHUB HIGHLIGHTS COLUMN MIGRATION
-- =================================================================

-- Add github_highlights column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS github_highlights JSONB DEFAULT '[]'::jsonb;

-- Add comment to document the column purpose
COMMENT ON COLUMN public.profiles.github_highlights IS 'JSONB array containing GitHub highlight objects with url, title, and description fields';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_github_highlights ON profiles USING GIN (github_highlights);

-- Update existing profiles to have empty array if null
UPDATE public.profiles 
SET github_highlights = '[]'::jsonb 
WHERE github_highlights IS NULL;

-- Example of expected data format:
-- [
--   {
--     "id": 1234567890,
--     "url": "https://github.com/username/repository",
--     "title": "My Best Project",
--     "description": "Check out this amazing GitHub repository!"
--   },
--   {
--     "id": 1234567891,
--     "url": "https://gist.github.com/username/gist-id",
--     "title": "Useful Code Snippet",
--     "description": "A helpful code snippet I created"
--   },
--   {
--     "id": 1234567892,
--     "url": "https://github.com/username/repo/issues/123",
--     "title": "Issue Contribution",
--     "description": "An issue I reported or contributed to"
--   }
-- ] 