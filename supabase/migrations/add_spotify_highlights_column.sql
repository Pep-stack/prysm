-- =================================================================
-- ADD SPOTIFY HIGHLIGHTS COLUMN MIGRATION
-- =================================================================

-- Add spotify_highlights column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS spotify_highlights JSONB DEFAULT NULL;

-- Add comment to document the column purpose
COMMENT ON COLUMN public.profiles.spotify_highlights IS 'Array of Spotify tracks, playlists, albums for highlights section';

-- Example of expected data format:
-- [
--   {
--     "url": "https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh",
--     "title": "Track Title",
--     "artist": "Artist Name"
--   },
--   {
--     "url": "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M", 
--     "title": "Playlist Name"
--   }
-- ]
