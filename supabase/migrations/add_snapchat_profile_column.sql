-- =================================================================
-- ADD SNAPCHAT PROFILE COLUMN MIGRATION
-- =================================================================

-- Add snapchat_profile column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS snapchat_profile TEXT DEFAULT NULL;

-- Add comment to document the column purpose
COMMENT ON COLUMN public.profiles.snapchat_profile IS 'Snapchat profile URL for displaying user profile link';

-- Example of expected data format:
-- https://snapchat.com/add/username 