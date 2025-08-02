"use client"

import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { useSupabaseConfig } from "@/app/components/SupabaseProvider"
import { getSupabaseClient } from "@/lib/supabase"

interface DemoUser extends User {
  isDemoUser?: boolean
}

export function useAuth() {
  const [user, setUser] = useState<DemoUser | null>(null)
  const [loading, setLoading] = useState(true)
  const { isConfigured } = useSupabaseConfig()

  useEffect(() => {
    // Check for existing demo session first
    const demoSession = localStorage.getItem("skillbridge_demo_session")
    if (demoSession) {
      try {
        const demoUser = JSON.parse(demoSession)
        setUser(demoUser)
        setLoading(false)
        return
      } catch (error) {
        localStorage.removeItem("skillbridge_demo_session")
      }
    }

    if (!isConfigured) {
      setLoading(false)
      return
    }

    // Initialize auth when configured
    const initAuth = async () => {
      try {
        const supabase = getSupabaseClient()

        // Get initial session
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          setUser(session.user)
        }
        setLoading(false)

        // Listen for auth changes
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (session?.user) {
            setUser(session.user)
          } else {
            setUser(null)
          }
          setLoading(false)
        })

        return () => subscription.unsubscribe()
      } catch (error) {
        console.error("Auth initialization error:", error)
        setLoading(false)
      }
    }

    initAuth()
  }, [isConfigured])

  const signUp = async (email: string, password: string, name: string) => {
    if (!isConfigured) {
      // Demo mode - create demo session
      return createDemoSession(email, name)
    }

    try {
      const supabase = getSupabaseClient()

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: undefined,
        },
      })

      if (error) {
        if (error.message.includes("already registered") || error.message.includes("already exists")) {
          // Try to sign in instead
          return signIn(email, password)
        }
        throw error
      }

      // If signup successful, try to sign in
      if (data.user) {
        const signInResult = await signIn(email, password)
        if (signInResult.error) {
          // If sign in fails due to confirmation, create demo session
          return createDemoSession(email, name)
        }
        return signInResult
      }

      return { data, error: null }
    } catch (error: any) {
      console.error("Sign up error:", error)
      // Fallback to demo session
      return createDemoSession(email, name)
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!isConfigured) {
      // Demo mode - create demo session
      return createDemoSession(email, "Demo User")
    }

    try {
      const supabase = getSupabaseClient()

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          // Try to create account
          const signUpResult = await signUp(email, password, "User")
          return signUpResult
        }

        if (error.message.includes("Email not confirmed")) {
          // Create demo session for unconfirmed emails
          return createDemoSession(email, "Demo User")
        }

        throw error
      }

      return { data, error: null }
    } catch (error: any) {
      console.error("Sign in error:", error)
      // Fallback to demo session
      return createDemoSession(email, "Demo User")
    }
  }

  const signOut = async () => {
    // Clear demo session
    localStorage.removeItem("skillbridge_demo_session")

    if (!isConfigured) {
      setUser(null)
      return { error: null }
    }

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.auth.signOut()
      setUser(null)
      return { error }
    } catch (error: any) {
      setUser(null)
      return { error: { message: error.message } }
    }
  }

  const createDemoSession = async (email: string, name: string) => {
    const demoUser: DemoUser = {
      id: `demo-${Date.now()}`,
      email,
      user_metadata: { name },
      app_metadata: {},
      aud: "authenticated",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isDemoUser: true,
    } as DemoUser

    // Store in localStorage for persistence
    localStorage.setItem("skillbridge_demo_session", JSON.stringify(demoUser))
    setUser(demoUser)

    return { data: { user: demoUser }, error: null }
  }

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    createDemoSession,
    isConfigured,
  }
}
