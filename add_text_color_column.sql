-- Add text_color column to profiles table
-- File: add_text_color_column.sql

-- Add the text_color column with a default value of black
ALTER TABLE profiles 
ADD COLUMN text_color VARCHAR(7) DEFAULT '#000000';

-- Update existing profiles to have the default text color
UPDATE profiles 
SET text_color = '#000000' 
WHERE text_color IS NULL;

-- Add a check constraint to ensure only valid hex colors are stored
ALTER TABLE profiles 
ADD CONSTRAINT check_text_color_format 
CHECK (text_color ~ '^#[0-9A-Fa-f]{6}$');

-- Add comment for documentation
COMMENT ON COLUMN profiles.text_color IS 'Hex color code for text color, limited to black (#000000), gray (#6b7280), or white (#ffffff)'; 