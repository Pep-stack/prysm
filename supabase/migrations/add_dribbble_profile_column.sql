-- =================================================================
-- ADD DRIBBBLE PROFILE COLUMN MIGRATION
-- =================================================================

-- Add dribbble_profile column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS dribbble_profile TEXT DEFAULT NULL;

-- Add comment to document the column purpose
COMMENT ON COLUMN public.profiles.dribbble_profile IS 'Dribbble profile URL for displaying user profile link';

-- Example of expected data format:
-- https://dribbble.com/username 