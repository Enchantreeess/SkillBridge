-- SkillBridge V4 Database Setup
-- This script sets up the complete database schema for SkillBridge V4

-- Enable Row Level Security
ALTER TABLE IF EXISTS public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing tables if they exist (clean slate for V4)
DROP TABLE IF EXISTS public.progress CASCADE;
DROP TABLE IF EXISTS public.credits CASCADE;
DROP TABLE IF EXISTS public.courses CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;
DROP TABLE IF EXISTS public.contact_submissions CASCADE;

-- Create courses table
CREATE TABLE public.courses (
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
CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create credits table (XP and gamification system)
CREATE TABLE public.credits (
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

-- Create progress table (course progress tracking)
CREATE TABLE public.progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    course_title TEXT NOT NULL,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    xp_earned INTEGER DEFAULT 0,
    status TEXT DEFAULT 'not-started' CHECK (status IN ('not-started', 'in-progress', 'completed')),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, course_id)
);

-- Create contact_submissions table
CREATE TABLE public.contact_submissions (
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
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', 'User'));
    
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

-- Insert V4 sample courses with Aadiraj Singh Chauhan and Anusha Singh as instructors
INSERT INTO public.courses (title, description, instructor, category, image_url, xp_reward, difficulty, is_popular) VALUES
-- Technology Courses by Aadiraj Singh Chauhan
('Git Mastery in 5 Minutes', 'Master version control with Git fundamentals and advanced workflows', 'Aadiraj Singh Chauhan', 'Technology', '/placeholder.svg?height=200&width=300&text=Git', 50, 'Beginner', true),
('React Hooks Deep Dive', 'Modern React development patterns and advanced hooks usage', 'Aadiraj Singh Chauhan', 'Technology', '/placeholder.svg?height=200&width=300&text=React', 80, 'Advanced', false),
('Node.js API Development', 'Build scalable REST APIs with Node.js and Express', 'Aadiraj Singh Chauhan', 'Technology', '/placeholder.svg?height=200&width=300&text=NodeJS', 75, 'Intermediate', false),
('Python Fundamentals', 'Learn Python programming from scratch', 'Aadiraj Singh Chauhan', 'Technology', '/placeholder.svg?height=200&width=300&text=Python', 60, 'Beginner', false),
('JavaScript ES6+', 'Modern JavaScript features and best practices', 'Aadiraj Singh Chauhan', 'Technology', '/placeholder.svg?height=200&width=300&text=JavaScript', 65, 'Intermediate', true),
('TypeScript Essentials', 'Type-safe JavaScript development', 'Aadiraj Singh Chauhan', 'Technology', '/placeholder.svg?height=200&width=300&text=TypeScript', 70, 'Intermediate', false),

-- AI Courses by Aadiraj Singh Chauhan
('AI Prompt Engineering', 'Craft perfect prompts for AI tools and maximize their potential', 'Aadiraj Singh Chauhan', 'AI', '/placeholder.svg?height=200&width=300&text=AI', 75, 'Intermediate', true),
('Machine Learning Basics', 'Introduction to ML algorithms and concepts', 'Aadiraj Singh Chauhan', 'AI', '/placeholder.svg?height=200&width=300&text=ML', 90, 'Intermediate', true),
('ChatGPT for Productivity', 'Leverage ChatGPT to boost your daily productivity', 'Aadiraj Singh Chauhan', 'AI', '/placeholder.svg?height=200&width=300&text=ChatGPT', 55, 'Beginner', false),
('AI Ethics and Safety', 'Understanding responsible AI development and usage', 'Aadiraj Singh Chauhan', 'AI', '/placeholder.svg?height=200&width=300&text=Ethics', 70, 'Intermediate', false),
('Computer Vision Intro', 'Basics of image recognition and computer vision', 'Aadiraj Singh Chauhan', 'AI', '/placeholder.svg?height=200&width=300&text=Vision', 85, 'Advanced', false),

-- Design Courses by Anusha Singh
('Figma Design Basics', 'Learn UI/UX design principles in Figma from scratch', 'Anusha Singh', 'Design', '/placeholder.svg?height=200&width=300&text=Figma', 60, 'Beginner', true),
('Color Theory Fundamentals', 'Understanding color psychology and application in design', 'Anusha Singh', 'Design', '/placeholder.svg?height=200&width=300&text=Color', 45, 'Beginner', false),
('Typography Essentials', 'Master the art of typography and font selection', 'Anusha Singh', 'Design', '/placeholder.svg?height=200&width=300&text=Typography', 55, 'Intermediate', false),
('Logo Design Principles', 'Create memorable and effective logos', 'Anusha Singh', 'Design', '/placeholder.svg?height=200&width=300&text=Logo', 70, 'Intermediate', false),
('Mobile UI Design', 'Design beautiful mobile app interfaces', 'Anusha Singh', 'Design', '/placeholder.svg?height=200&width=300&text=Mobile', 65, 'Intermediate', true),
('User Experience Research', 'Learn UX research methods and user testing', 'Anusha Singh', 'Design', '/placeholder.svg?height=200&width=300&text=UX', 75, 'Advanced', false),

-- Business Courses by Anusha Singh
('Business Strategy 101', 'Core principles of business strategy and planning', 'Anusha Singh', 'Business', '/placeholder.svg?height=200&width=300&text=Strategy', 65, 'Beginner', false),
('Digital Marketing Essentials', 'Modern marketing techniques and social media', 'Anusha Singh', 'Business', '/placeholder.svg?height=200&width=300&text=Marketing', 55, 'Beginner', false),
('Project Management Basics', 'Essential project management skills and tools', 'Anusha Singh', 'Business', '/placeholder.svg?height=200&width=300&text=PM', 60, 'Intermediate', false),

-- Humanities Courses by Anusha Singh
('Creative Writing Basics', 'Fundamentals of storytelling and creative expression', 'Anusha Singh', 'Humanities', '/placeholder.svg?height=200&width=300&text=Writing', 40, 'Beginner', false),
('Content Creation Mastery', 'Create engaging content for social media and blogs', 'Anusha Singh', 'Humanities', '/placeholder.svg?height=200&width=300&text=Content', 50, 'Beginner', false),

-- Science Courses by Aadiraj Singh Chauhan
('Data Science with Python', 'Introduction to data analysis and visualization', 'Aadiraj Singh Chauhan', 'Science', '/placeholder.svg?height=200&width=300&text=DataScience', 80, 'Intermediate', false),
('Statistics for Beginners', 'Essential statistical concepts made simple', 'Aadiraj Singh Chauhan', 'Science', '/placeholder.svg?height=200&width=300&text=Stats', 50, 'Beginner', false),
('Research Methodology', 'Scientific research methods and best practices', 'Aadiraj Singh Chauhan', 'Science', '/placeholder.svg?height=200&width=300&text=Research', 60, 'Intermediate', false)

ON CONFLICT DO NOTHING;

-- Create demo user for testing (this will be handled by the auth system)
-- The demo credentials are: demo@skillbridge.com / demo123456
