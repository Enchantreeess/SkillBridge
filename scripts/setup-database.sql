-- Enable Row Level Security
ALTER TABLE IF EXISTS public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    instructor TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    xp_reward INTEGER DEFAULT 50,
    difficulty TEXT DEFAULT 'Beginner' CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    duration_minutes INTEGER DEFAULT 5,
    is_popular BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create credits table (XP system)
CREATE TABLE IF NOT EXISTS public.credits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    total_xp INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    streak_days INTEGER DEFAULT 0,
    last_activity_date DATE DEFAULT CURRENT_DATE,
    achievements JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id)
);

-- Create progress table
CREATE TABLE IF NOT EXISTS public.progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    xp_earned INTEGER DEFAULT 0,
    status TEXT DEFAULT 'not-started' CHECK (status IN ('not-started', 'in-progress', 'completed')),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, course_id)
);

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security Policies

-- Courses - Public read access
CREATE POLICY "Anyone can view courses" ON public.courses
    FOR SELECT USING (true);

-- User profiles - Users can only see and edit their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Credits - Users can only see and edit their own credits
CREATE POLICY "Users can view own credits" ON public.credits
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own credits" ON public.credits
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own credits" ON public.credits
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Progress - Users can only see and edit their own progress
CREATE POLICY "Users can view own progress" ON public.progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Contact submissions - Allow anyone to insert, only authenticated users to read
CREATE POLICY "Anyone can submit contact forms" ON public.contact_submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Only authenticated users can view contact submissions" ON public.contact_submissions
    FOR SELECT USING (auth.role() = 'authenticated');

-- Functions to automatically update timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.courses
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.credits
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.progress
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Function to create user profile and credits on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
    
    INSERT INTO public.credits (user_id, total_xp, current_level, streak_days)
    VALUES (NEW.id, 0, 1, 0);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile and credits on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update user level based on XP
CREATE OR REPLACE FUNCTION public.update_user_level()
RETURNS TRIGGER AS $$
BEGIN
    -- Update level based on XP thresholds
    NEW.current_level = CASE
        WHEN NEW.total_xp >= 2000 THEN 5 -- Skill Samurai
        WHEN NEW.total_xp >= 1000 THEN 4 -- Learning Master
        WHEN NEW.total_xp >= 500 THEN 3  -- Knowledge Seeker
        WHEN NEW.total_xp >= 100 THEN 2  -- Skill Explorer
        ELSE 1 -- Curious Cat
    END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update level when XP changes
CREATE TRIGGER update_level_on_xp_change BEFORE UPDATE ON public.credits
    FOR EACH ROW WHEN (OLD.total_xp IS DISTINCT FROM NEW.total_xp)
    EXECUTE PROCEDURE public.update_user_level();

-- Insert sample courses
INSERT INTO public.courses (title, description, instructor, category, image_url, xp_reward, is_popular) VALUES
('Git Mastery in 5 Minutes', 'Master version control with Git fundamentals', 'Aadiraj Singh Chauhan', 'Technology', '/placeholder.svg?height=200&width=300&text=Git', 50, true),
('Figma Design Basics', 'Learn UI/UX design principles in Figma', 'Anusha Singh', 'Design', '/placeholder.svg?height=200&width=300&text=Figma', 60, true),
('AI Prompt Engineering', 'Craft perfect prompts for AI tools', 'Aadiraj Singh Chauhan', 'Technology', '/placeholder.svg?height=200&width=300&text=AI', 75, true),
('Color Theory Fundamentals', 'Understanding color in design', 'Anusha Singh', 'Design', '/placeholder.svg?height=200&width=300&text=Color', 45, false),
('React Hooks Deep Dive', 'Modern React development patterns', 'Aadiraj Singh Chauhan', 'Technology', '/placeholder.svg?height=200&width=300&text=React', 80, false),
('Typography Essentials', 'Master the art of typography', 'Anusha Singh', 'Design', '/placeholder.svg?height=200&width=300&text=Typography', 55, false),
('Python Data Science', 'Introduction to data analysis with Python', 'Aadiraj Singh Chauhan', 'Science', '/placeholder.svg?height=200&width=300&text=Python', 70, false),
('Creative Writing Basics', 'Fundamentals of storytelling', 'Anusha Singh', 'Humanities', '/placeholder.svg?height=200&width=300&text=Writing', 40, false),
('Business Strategy 101', 'Core principles of business strategy', 'Aadiraj Singh Chauhan', 'Business', '/placeholder.svg?height=200&width=300&text=Strategy', 65, false),
('Digital Marketing Essentials', 'Modern marketing techniques', 'Anusha Singh', 'Business', '/placeholder.svg?height=200&width=300&text=Marketing', 50, false)
ON CONFLICT DO NOTHING;
