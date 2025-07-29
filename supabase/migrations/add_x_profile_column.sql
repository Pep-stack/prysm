-- =================================================================
-- ADD X (TWITTER) PROFILE COLUMN MIGRATION
-- =================================================================

-- Add x_profile column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS x_profile TEXT DEFAULT NULL;

-- Add comment to document the column purpose
COMMENT ON COLUMN public.profiles.x_profile IS 'X (Twitter) profile URL for displaying user profile link';

-- Example of expected data format:
-- https://x.com/username or https://twitter.com/username 