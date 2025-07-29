-- =================================================================
-- ADD BEHANCE PROFILE COLUMN MIGRATION
-- =================================================================

-- Add behance_profile column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS behance_profile TEXT DEFAULT NULL;

-- Add comment to document the column purpose
COMMENT ON COLUMN public.profiles.behance_profile IS 'Behance profile URL for displaying user profile link';

-- Example of expected data format:
-- https://www.behance.net/username 