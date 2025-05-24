-- Check current structure of profiles table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Check if we can see any existing profiles
SELECT 
    id,
    name,
    headline,
    bio,
    email
FROM public.profiles 
LIMIT 5;

-- Try to add bio column again (safe - will do nothing if it exists)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Try to add headline column again (safe - will do nothing if it exists)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS headline TEXT; 