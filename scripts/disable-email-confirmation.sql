-- Disable email confirmation requirement in Supabase
-- Run this in your Supabase SQL editor to disable email confirmation

-- Update auth settings to disable email confirmation
-- Note: This should be done in the Supabase Dashboard under Authentication > Settings
-- Set "Enable email confirmations" to OFF

-- Alternative: Update user email_confirmed_at for existing users
UPDATE auth.users 
SET email_confirmed_at = now(), 
    confirmed_at = now()
WHERE email_confirmed_at IS NULL;

-- Create a function to auto-confirm new users
CREATE OR REPLACE FUNCTION public.auto_confirm_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Auto-confirm the user's email
    NEW.email_confirmed_at = now();
    NEW.confirmed_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-confirm users on signup
DROP TRIGGER IF EXISTS auto_confirm_user_trigger ON auth.users;
CREATE TRIGGER auto_confirm_user_trigger
    BEFORE INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.auto_confirm_user();
