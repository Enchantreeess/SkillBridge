"use client"

import { useEffect, useState } from "react"
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase"
import type { UserProfile } from "@/lib/supabase"
import { useAuth } from "./useAuth"

export function useUserProfile() {
  const { user, isConfigured } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isConfigured) {
      // Demo mode - create a sample profile
      setProfile({
        id: "demo-user-id",
        email: "demo@skillbridge.com",
        name: "Demo User",
        avatar_url: "/placeholder.svg?height=40&width=40&text=DU",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      setLoading(false)
      return
    }

    if (user) {
      fetchProfile()
    } else {
      setProfile(null)
      setLoading(false)
    }
  }, [user, isConfigured])

  const fetchProfile = async () => {
    if (!user || !isSupabaseConfigured()) {
      setLoading(false)
      return
    }

    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

      if (error) {
        // Handle specific database errors
        if (
          error.code === "PGRST116" ||
          error.message.includes("relation") ||
          error.message.includes("does not exist")
        ) {
          console.warn("Database table doesn't exist, falling back to demo mode")
          // Create demo profile based on user data
          setProfile({
            id: user.id,
            email: user.email || "demo@skillbridge.com",
            name: user.user_metadata?.name || user.email?.split("@")[0] || "Demo User",
            avatar_url: user.user_metadata?.avatar_url || "/placeholder.svg?height=40&width=40&text=DU",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          setError(null)
        } else {
          throw error
        }
      } else {
        setProfile(data)
        setError(null)
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error)
      setError(error.message || "Failed to fetch profile")

      // Fallback to demo profile even on error
      setProfile({
        id: user?.id || "demo-user-id",
        email: user?.email || "demo@skillbridge.com",
        name: user?.user_metadata?.name || "Demo User",
        avatar_url: "/placeholder.svg?height=40&width=40&text=DU",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !isSupabaseConfigured()) {
      // Demo mode - just update local state
      if (profile) {
        const updatedProfile = { ...profile, ...updates, updated_at: new Date().toISOString() }
        setProfile(updatedProfile)
        return { data: updatedProfile, error: null }
      }
      return { error: "No profile to update" }
    }

    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.from("user_profiles").update(updates).eq("id", user.id).select().single()

      if (error) {
        if (
          error.code === "PGRST116" ||
          error.message.includes("relation") ||
          error.message.includes("does not exist")
        ) {
          console.warn("Database table doesn't exist, updating demo profile locally")
          if (profile) {
            const updatedProfile = { ...profile, ...updates, updated_at: new Date().toISOString() }
            setProfile(updatedProfile)
            return { data: updatedProfile, error: null }
          }
        }
        throw error
      }

      setProfile(data)
      return { data, error: null }
    } catch (error: any) {
      console.error("Error updating profile:", error)
      return { data: null, error: error.message || "Failed to update profile" }
    }
  }

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: fetchProfile,
    isConfigured,
  }
}
