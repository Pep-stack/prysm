-- =================================================================
-- ADD TIKTOK PROFILE COLUMN MIGRATION
-- =================================================================

-- Add tiktok_profile column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS tiktok_profile TEXT DEFAULT NULL;

-- Add comment to document the column purpose
COMMENT ON COLUMN public.profiles.tiktok_profile IS 'TikTok profile URL for displaying user profile link';

-- Example of expected data format:
-- https://www.tiktok.com/@username 