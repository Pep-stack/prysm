-- Add website_preview column to card_profiles table
-- This will store website preview data as JSON

ALTER TABLE card_profiles 
ADD COLUMN IF NOT EXISTS website_preview jsonb DEFAULT '[]'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN card_profiles.website_preview IS 'Website preview section data stored as JSON array with title, subtitle, button_text, website_url, and logo_url';

-- Example of the JSON structure that will be stored:
-- [
--   {
--     "id": "unique-id",
--     "title": "My Website", 
--     "subtitle": "Check out my personal portfolio website",
--     "button_text": "Visit Website",
--     "website_url": "https://example.com",
--     "logo_url": "https://storage.supabase.co/path/to/logo.png"
--   }
-- ]
