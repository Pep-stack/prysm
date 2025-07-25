-- =================================================================
-- ADD SKILLS COLUMN MIGRATION
-- =================================================================

-- Add skills column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS skills TEXT;

-- Add comment to document the column purpose
COMMENT ON COLUMN public.profiles.skills IS 'JSON string containing array of skill objects with name, category, proficiency, yearsOfExperience, and description fields';

-- Example of expected data format:
-- [
--   {
--     "id": 1234567890,
--     "name": "React",
--     "category": "Frontend Development",
--     "proficiency": "advanced",
--     "yearsOfExperience": "3",
--     "description": "Experience with React hooks, context, and modern patterns"
--   },
--   {
--     "id": 1234567891,
--     "name": "Python",
--     "category": "Programming Languages",
--     "proficiency": "intermediate",
--     "yearsOfExperience": "2",
--     "description": "Backend development and data analysis"
--   }
-- ] 