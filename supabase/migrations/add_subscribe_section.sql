-- Add subscribe section to profiles table
-- This migration adds a subscribe column to store email subscription form data

-- Add the subscribe column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS subscribe TEXT;

-- Add comment to document the column
COMMENT ON COLUMN profiles.subscribe IS 'JSON string containing subscribe section data (t=title, d=description, p=placeholder, b=buttonText, f=formUrl, s=successMessage)';

-- Create a simple index for better query performance
-- Using WHERE clause to only index non-null values
CREATE INDEX IF NOT EXISTS idx_profiles_subscribe ON profiles (subscribe) WHERE subscribe IS NOT NULL; 