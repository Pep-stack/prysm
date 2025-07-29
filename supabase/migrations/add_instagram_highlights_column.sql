-- =================================================================
-- ADD INSTAGRAM PROFILE COLUMN MIGRATION
-- =================================================================

-- Add instagram_profile column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS instagram_profile TEXT DEFAULT NULL;

-- Add comment to document the column purpose
COMMENT ON COLUMN public.profiles.instagram_profile IS 'Instagram profile URL for displaying user profile link';

-- Update existing instagram_highlights column if it exists (for backward compatibility)
DO $$
BEGIN
    -- Check if instagram_highlights column exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'instagram_highlights'
    ) THEN
        -- Copy data from instagram_highlights to instagram_profile if instagram_profile is empty
        UPDATE public.profiles 
        SET instagram_profile = instagram_highlights 
        WHERE instagram_profile IS NULL 
        AND instagram_highlights IS NOT NULL;
        
        -- Drop the old column
        ALTER TABLE public.profiles DROP COLUMN IF EXISTS instagram_highlights;
    END IF;
END $$;

-- Example of expected data format:
-- [
--   {
--     "id": 1234567890,
--     "url": "https://www.instagram.com/p/POST_ID/",
--     "title": "My Best Instagram Post",
--     "description": "Check out this amazing Instagram post!"
--   },
--   {
--     "id": 1234567891,
--     "url": "https://www.instagram.com/reel/REEL_ID/",
--     "title": "Another Great Instagram Reel",
--     "description": "Another awesome Instagram reel to showcase"
--   }
-- ] 