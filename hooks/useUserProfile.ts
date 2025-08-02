"use client"

import { useEffect, useState } from "react"
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase"
import type { UserProfile } from "@/lib/supabase"
import { useAuth } from "./useAuth"

export function useUserProfile() {
  const { user, isConfigured } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isConfigured) {
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

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !isSupabaseConfigured()) return { error: "No user logged in or Supabase not configured" }

    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.from("user_profiles").update(updates).eq("id", user.id).select().single()

      if (error) throw error
      setProfile(data)
      return { data, error: null }
    } catch (error) {
      console.error("Error updating profile:", error)
      return { data: null, error }
    }
  }

  return {
    profile,
    loading,
    updateProfile,
    refetch: fetchProfile,
    isConfigured,
  }
}
