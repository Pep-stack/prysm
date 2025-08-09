-- =================================================================
-- ADD SPOTIFY BUTTON COLUMN MIGRATION
-- =================================================================

-- Add spotify column to profiles table if it doesn't exist (for button links)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS spotify TEXT DEFAULT NULL;

-- Add comment to document the column purpose
COMMENT ON COLUMN public.profiles.spotify IS 'Spotify link URL for social media button';

-- Example of expected data format:
-- https://open.spotify.com/playlist/xyz or https://open.spotify.com/artist/xyz
