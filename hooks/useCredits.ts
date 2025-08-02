"use client"

import { useEffect, useState } from "react"
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase"
import type { Credits } from "@/lib/supabase"
import { useAuth } from "./useAuth"

export function useCredits() {
  const { user, isConfigured } = useAuth()
  const [credits, setCredits] = useState<Credits | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false)
      return
    }

    if (user) {
      fetchCredits()
    } else {
      setCredits(null)
      setLoading(false)
    }
  }, [user, isConfigured])

  const fetchCredits = async () => {
    if (!user || !isSupabaseConfigured()) {
      setLoading(false)
      return
    }

    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.from("credits").select("*").eq("user_id", user.id).single()

      if (error) throw error
      setCredits(data)
    } catch (error) {
      console.error("Error fetching credits:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateCredits = async (updates: Partial<Credits>) => {
    if (!user || !isSupabaseConfigured()) return { error: "No user logged in or Supabase not configured" }

    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.from("credits").update(updates).eq("user_id", user.id).select().single()

      if (error) throw error
      setCredits(data)
      return { data, error: null }
    } catch (error) {
      console.error("Error updating credits:", error)
      return { data: null, error }
    }
  }

  const addXP = async (xpAmount: number) => {
    if (!credits) return

    const newTotalXP = credits.total_xp + xpAmount
    return updateCredits({ total_xp: newTotalXP })
  }

  const updateStreak = async () => {
    if (!credits) return

    const today = new Date().toISOString().split("T")[0]
    const lastActivity = credits.last_activity_date

    let newStreakDays = credits.streak_days

    if (lastActivity) {
      const lastDate = new Date(lastActivity)
      const todayDate = new Date(today)
      const diffTime = todayDate.getTime() - lastDate.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        // Consecutive day
        newStreakDays += 1
      } else if (diffDays > 1) {
        // Streak broken
        newStreakDays = 1
      }
      // If diffDays === 0, same day, no change
    } else {
      // First activity
      newStreakDays = 1
    }

    return updateCredits({
      streak_days: newStreakDays,
      last_activity_date: today,
    })
  }

  return {
    credits,
    loading,
    updateCredits,
    addXP,
    updateStreak,
    refetch: fetchCredits,
    isConfigured,
  }
}
