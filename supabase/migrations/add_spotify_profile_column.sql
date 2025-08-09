-- =================================================================
-- ADD SPOTIFY PROFILE COLUMN MIGRATION
-- =================================================================

-- Add spotify_profile column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS spotify_profile TEXT DEFAULT NULL;

-- Add comment to document the column purpose
COMMENT ON COLUMN public.profiles.spotify_profile IS 'Spotify profile URL for displaying user profile link';

-- Example of expected data format:
-- https://open.spotify.com/user/username or https://open.spotify.com/artist/artistname
