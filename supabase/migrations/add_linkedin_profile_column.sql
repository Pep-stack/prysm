-- =================================================================
-- ADD LINKEDIN PROFILE COLUMN MIGRATION
-- =================================================================

-- Add linkedin_profile column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS linkedin_profile TEXT DEFAULT NULL;

-- Add comment to document the column purpose
COMMENT ON COLUMN public.profiles.linkedin_profile IS 'LinkedIn profile URL for displaying user profile link';

-- Example of expected data format:
-- https://www.linkedin.com/in/username/ 