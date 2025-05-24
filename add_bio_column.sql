-- Add bio column to profiles table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'bio'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN bio TEXT;
    END IF;
END $$;

-- Optional: Add headline column if it doesn't exist either
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'headline'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN headline TEXT;
    END IF;
END $$;

-- Verify the columns exist
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('bio', 'headline')
ORDER BY column_name; 