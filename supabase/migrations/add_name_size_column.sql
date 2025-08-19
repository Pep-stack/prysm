-- =================================================================
-- ADD NAME SIZE COLUMN MIGRATION
-- =================================================================

-- Add name_size column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS name_size TEXT DEFAULT 'small';

-- Add comment to document the column purpose
COMMENT ON COLUMN public.profiles.name_size IS 'Font size for the name in personal info section. Options: small (28px), medium (32px), large (36px), extra-large (40px), xxl (44px)';

-- Create index for better performance on new column
CREATE INDEX IF NOT EXISTS idx_profiles_name_size ON profiles (name_size) WHERE name_size IS NOT NULL;
