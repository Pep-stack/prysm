-- Add FAQ column to profiles table
-- This migration adds support for FAQ sections

-- Add the FAQ column
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS faq TEXT;

-- Add comment for documentation
COMMENT ON COLUMN profiles.faq IS 'FAQ entries as JSON string';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_faq ON profiles (faq) WHERE faq IS NOT NULL; 