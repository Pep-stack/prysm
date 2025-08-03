-- Migration to ensure publications section is properly set up
-- This migration adds support for the Publications section

-- Add publications column if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS publications TEXT;

-- Add comment for documentation
COMMENT ON COLUMN profiles.publications IS 'Publications and blog posts as JSON string';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_publications ON profiles (publications) WHERE publications IS NOT NULL;

-- Update RLS policies if needed (publications should be readable by everyone)
-- This ensures publications data is accessible in public profiles 