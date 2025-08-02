import { createClient } from "@supabase/supabase-js"

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only create client if both variables are present
let supabase: ReturnType<typeof createClient> | null = null

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })
}

// Export a function that checks if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Export a function that returns the client or throws an error
export const getSupabaseClient = () => {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.",
    )
  }
  return supabase
}

// Export the client (will be null if not configured)
export { supabase }

// Types for our database tables
export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  category: string
  image_url: string
  xp_reward: number
  difficulty: string
  duration_minutes: number
  is_popular: boolean
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  email: string
  name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Credits {
  id: string
  user_id: string
  total_xp: number
  current_level: number
  streak_days: number
  last_activity_date?: string
  achievements: any[]
  created_at: string
  updated_at: string
}

export interface Progress {
  id: string
  user_id: string
  course_id: string
  course_title: string
  progress_percentage: number
  xp_earned: number
  status: "not-started" | "in-progress" | "completed"
  started_at?: string
  completed_at?: string
  updated_at: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  message: string
  status: "new" | "read" | "replied"
  created_at: string
}
