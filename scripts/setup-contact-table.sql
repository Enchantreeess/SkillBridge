-- Create contact_submissions table for storing contact form data
DROP TABLE IF EXISTS public.contact_submissions CASCADE;

CREATE TABLE public.contact_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_contact_submissions_status ON public.contact_submissions(status);
CREATE INDEX idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);
CREATE INDEX idx_contact_submissions_email ON public.contact_submissions(email);

-- Enable Row Level Security
ALTER TABLE IF EXISTS public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Row Level Security Policies

-- Allow anyone to insert contact forms (public submissions)
CREATE POLICY "Anyone can submit contact forms" ON public.contact_submissions
    FOR INSERT WITH CHECK (true);

-- Only authenticated users can view contact submissions (admin access)
CREATE POLICY "Only authenticated users can view contact submissions" ON public.contact_submissions
    FOR SELECT USING (auth.role() = 'authenticated');

-- Only authenticated users can update contact submissions (admin actions)
CREATE POLICY "Only authenticated users can update contact submissions" ON public.contact_submissions
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Function to automatically update timestamps
CREATE OR REPLACE FUNCTION public.handle_contact_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER handle_contact_updated_at BEFORE UPDATE ON public.contact_submissions
    FOR EACH ROW EXECUTE PROCEDURE public.handle_contact_updated_at();

-- Insert sample contact submissions for testing
INSERT INTO public.contact_submissions (name, email, message, status) VALUES
('John Doe', 'john@example.com', 'I love the platform! Great courses.', 'read'),
('Jane Smith', 'jane@example.com', 'Can you add more advanced AI courses?', 'new'),
('Mike Johnson', 'mike@example.com', 'Having trouble with the gamification system.', 'replied'),
('Sarah Wilson', 'sarah@example.com', 'The UI is amazing! Keep up the great work.', 'read'),
('Demo User', 'demo@skillbridge.com', 'This is a test message from the demo user.', 'new')
ON CONFLICT DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON public.contact_submissions TO anon;
GRANT SELECT, UPDATE ON public.contact_submissions TO authenticated;
