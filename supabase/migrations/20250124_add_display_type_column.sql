-- Add display_type column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS display_type VARCHAR(10) DEFAULT 'avatar';

-- Add check constraint to ensure valid values
ALTER TABLE profiles 
ADD CONSTRAINT profiles_display_type_check 
CHECK (display_type IN ('avatar', 'header'));

-- Update existing records to have default value
UPDATE profiles 
SET display_type = 'avatar' 
WHERE display_type IS NULL; 