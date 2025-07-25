-- =================================================================
-- ADD SERVICES COLUMN MIGRATION
-- =================================================================

-- Add services column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS services TEXT;

-- Add comment to document the column purpose
COMMENT ON COLUMN public.profiles.services IS 'JSON string containing array of service objects with title, category, subcategory, description, price, duration, features, expertise, and isPopular fields';

-- Example of expected data format:
-- [
--   {
--     "id": 1234567890,
--     "title": "Custom Web Development",
--     "category": "Web Development",
--     "subcategory": "Full-Stack Development",
--     "description": "Complete web application development from frontend to backend",
--     "price": "$500-2000",
--     "duration": "2-4 weeks",
--     "features": [
--       "Responsive design",
--       "SEO optimization",
--       "Performance optimization",
--       "Security best practices"
--     ],
--     "expertise": "advanced",
--     "isPopular": true
--   },
--   {
--     "id": 1234567891,
--     "title": "UI/UX Design",
--     "category": "Design & Creative",
--     "subcategory": "UI/UX Design",
--     "description": "User-centered design solutions for web and mobile applications",
--     "price": "$300-1500",
--     "duration": "1-3 weeks",
--     "features": [
--       "User research",
--       "Wireframing",
--       "Prototyping",
--       "Design systems"
--     ],
--     "expertise": "intermediate",
--     "isPopular": false
--   }
-- ] 