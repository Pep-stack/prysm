-- =================================================================
-- ADD SOCIAL BAR POSITION MIGRATION
-- =================================================================

-- Add social_bar_position column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS social_bar_position VARCHAR(20) DEFAULT 'top';

-- Add check constraint to ensure valid values
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_social_bar_position_check 
CHECK (social_bar_position IN ('top', 'bottom'));

-- Update existing records to have default value
UPDATE profiles 
SET social_bar_position = 'top' 
WHERE social_bar_position IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN profiles.social_bar_position IS 'Position of social bar: top (below header) or bottom (above footer)';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_social_bar_position ON profiles (social_bar_position); 