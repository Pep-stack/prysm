-- Add gallery column to profiles table
-- This migration adds support for Gallery section

-- Add gallery column
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS gallery TEXT;

-- Add comment for documentation
COMMENT ON COLUMN profiles.gallery IS 'Gallery images and content as JSON string'; 