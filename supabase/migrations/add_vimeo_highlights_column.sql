-- =================================================================
-- ADD VIMEO HIGHLIGHTS COLUMN MIGRATION
-- =================================================================

-- Add vimeo_highlights column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS vimeo_highlights JSONB DEFAULT NULL;

-- Add comment to document the column purpose
COMMENT ON COLUMN public.profiles.vimeo_highlights IS 'Array of Vimeo videos for highlights section';

-- Example of expected data format:
-- [
--   {
--     "url": "https://vimeo.com/123456789",
--     "embedCode": "<iframe src=\"https://player.vimeo.com/video/123456789\" width=\"640\" height=\"360\" frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen></iframe>",
--     "title": "Video Title",
--     "description": "Check out this video!"
--   }
-- ]
