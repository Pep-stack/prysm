-- =================================================================
-- ADD SUBSCRIPTION COLUMNS MIGRATION
-- =================================================================

-- Add subscription-related columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS trial_end_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS subscription_metadata JSONB DEFAULT '{}';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_plan ON profiles (subscription_plan);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON profiles (subscription_status);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON profiles (stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_subscription_id ON profiles (stripe_subscription_id);

-- Add comments for documentation
COMMENT ON COLUMN profiles.subscription_plan IS 'Current subscription plan: free, pro, business';
COMMENT ON COLUMN profiles.subscription_status IS 'Subscription status: active, canceled, past_due, trialing';
COMMENT ON COLUMN profiles.subscription_start_date IS 'When the current subscription started';
COMMENT ON COLUMN profiles.subscription_end_date IS 'When the current subscription ends';
COMMENT ON COLUMN profiles.stripe_customer_id IS 'Stripe customer ID for billing';
COMMENT ON COLUMN profiles.stripe_subscription_id IS 'Stripe subscription ID';
COMMENT ON COLUMN profiles.trial_end_date IS 'When the trial period ends (if applicable)';
COMMENT ON COLUMN profiles.subscription_metadata IS 'Additional subscription metadata as JSONB';

-- Update existing users to have free plan by default
UPDATE public.profiles 
SET subscription_plan = 'free', 
    subscription_status = 'active',
    subscription_start_date = COALESCE(updated_at, NOW())
WHERE subscription_plan IS NULL;
