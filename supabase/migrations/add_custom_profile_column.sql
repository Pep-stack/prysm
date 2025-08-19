-- Add custom_profile column to card_profiles table
-- This will store custom profile data as JSON

ALTER TABLE card_profiles 
ADD COLUMN IF NOT EXISTS custom_profile jsonb DEFAULT '[]'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN card_profiles.custom_profile IS 'Custom profile section data stored as JSON array with platform_name, profile_url, username, and icon_color';

-- Example of the JSON structure that will be stored:
-- [
--   {
--     "id": "unique-id",
--     "platform_name": "Discord", 
--     "profile_url": "https://discord.gg/username",
--     "username": "username",
--     "icon_color": "#5865F2"
--   }
-- ]
