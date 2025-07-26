-- =================================================================
-- REMOVE ICON SIZE COLUMN MIGRATION
-- =================================================================

-- Remove icon_size column from profiles table
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS icon_size;

-- Add comment for documentation
COMMENT ON TABLE profiles IS 'Profiles table with design settings (icon_size removed)'; 