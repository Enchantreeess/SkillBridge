-- Create contact_submissions table for storing contact form data
CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on created_at for better query performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);

-- Create an index on status for filtering
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);

-- Enable Row Level Security (RLS)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert contact submissions
CREATE POLICY "Anyone can submit contact forms" ON contact_submissions
    FOR INSERT WITH CHECK (true);

-- Create policy to allow authenticated users to read contact submissions (for admin)
CREATE POLICY "Authenticated users can read contact submissions" ON contact_submissions
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update contact submissions (for admin)
CREATE POLICY "Authenticated users can update contact submissions" ON contact_submissions
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_contact_submissions_updated_at
    BEFORE UPDATE ON contact_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing (optional)
INSERT INTO contact_submissions (name, email, message, status) VALUES
    ('John Doe', 'john@example.com', 'Hello, I have a question about your courses.', 'new'),
    ('Jane Smith', 'jane@example.com', 'I would like to know more about the pricing.', 'read'),
    ('Bob Johnson', 'bob@example.com', 'Great platform! Keep up the good work.', 'replied')
ON CONFLICT DO NOTHING;
