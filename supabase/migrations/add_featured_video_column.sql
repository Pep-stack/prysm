-- Add featured_video column to profiles table
-- This migration adds support for Featured Video section

-- Add featured_video column
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS featured_video TEXT;

-- Add comment for documentation
COMMENT ON COLUMN profiles.featured_video IS 'Featured video data as JSON string'; 