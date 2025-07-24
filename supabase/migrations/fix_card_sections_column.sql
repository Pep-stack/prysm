-- Fix card sections column mapping
-- Ensure card_sections column exists and migrate data if needed

-- Add card_sections column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS card_sections JSONB DEFAULT '[]'::jsonb;

-- Add card_sections_pro column if it doesn't exist (for backward compatibility)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS card_sections_pro JSONB DEFAULT '[]'::jsonb;

-- Migrate data from card_sections_pro to card_sections if card_sections is empty
UPDATE public.profiles 
SET card_sections = card_sections_pro
WHERE (card_sections IS NULL OR card_sections = '[]'::jsonb)
  AND card_sections_pro IS NOT NULL 
  AND card_sections_pro != '[]'::jsonb;

-- Index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_card_sections ON profiles USING GIN (card_sections);

-- Add comment for documentation
COMMENT ON COLUMN profiles.card_sections IS 'Card sections configuration as JSONB (primary column)';
COMMENT ON COLUMN profiles.card_sections_pro IS 'Legacy card sections column - use card_sections instead'; 