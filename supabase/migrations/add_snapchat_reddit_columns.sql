-- Add missing social media columns to profiles table
-- This migration adds snapchat and reddit columns that are needed for the custom editors

-- Add snapchat column
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS snapchat TEXT;

-- Add reddit column  
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS reddit TEXT;

-- Add comment to document the purpose
COMMENT ON COLUMN public.profiles.snapchat IS 'Snapchat profile URL for custom editor';
COMMENT ON COLUMN public.profiles.reddit IS 'Reddit profile URL for custom editor'; 