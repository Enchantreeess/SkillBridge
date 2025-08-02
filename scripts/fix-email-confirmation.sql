-- Fix email confirmation issues in Supabase
-- Run this script to resolve "Email not confirmed" errors

-- Method 1: Update all existing users to be confirmed
UPDATE auth.users 
SET 
    email_confirmed_at = COALESCE(email_confirmed_at, now()),
    confirmed_at = COALESCE(confirmed_at, now())
WHERE email_confirmed_at IS NULL OR confirmed_at IS NULL;

-- Method 2: Create or replace the auto-confirm trigger
CREATE OR REPLACE FUNCTION public.auto_confirm_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Auto-confirm the user's email on creation
    NEW.email_confirmed_at = COALESCE(NEW.email_confirmed_at, now());
    NEW.confirmed_at = COALESCE(NEW.confirmed_at, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS auto_confirm_user_trigger ON auth.users;

-- Create the trigger to auto-confirm new users
CREATE TRIGGER auto_confirm_user_trigger
    BEFORE INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.auto_confirm_user();

-- Method 3: Create a function to manually confirm users by email
CREATE OR REPLACE FUNCTION public.confirm_user_by_email(user_email text)
RETURNS boolean AS $$
DECLARE
    user_record auth.users%ROWTYPE;
BEGIN
    -- Find the user by email
    SELECT * INTO user_record FROM auth.users WHERE email = user_email;
    
    IF user_record.id IS NOT NULL THEN
        -- Update the user to be confirmed
        UPDATE auth.users 
        SET 
            email_confirmed_at = now(),
            confirmed_at = now()
        WHERE id = user_record.id;
        
        RETURN true;
    ELSE
        RETURN false;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Confirm the demo user specifically
SELECT public.confirm_user_by_email('demo@skillbridge.com');

-- Method 4: Create a more robust user creation function
CREATE OR REPLACE FUNCTION public.create_confirmed_user(
    user_email text,
    user_password text,
    user_name text DEFAULT 'User'
)
RETURNS json AS $$
DECLARE
    new_user_id uuid;
    result json;
BEGIN
    -- Insert user directly into auth.users with confirmation
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        confirmed_at,
        created_at,
        updated_at,
        raw_user_meta_data
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        user_email,
        crypt(user_password, gen_salt('bf')),
        now(),
        now(),
        now(),
        now(),
        json_build_object('name', user_name)
    )
    RETURNING id INTO new_user_id;
    
    -- Return success result
    result := json_build_object(
        'success', true,
        'user_id', new_user_id,
        'message', 'User created and confirmed successfully'
    );
    
    RETURN result;
    
EXCEPTION WHEN OTHERS THEN
    -- Return error result
    result := json_build_object(
        'success', false,
        'error', SQLERRM,
        'message', 'Failed to create user'
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
