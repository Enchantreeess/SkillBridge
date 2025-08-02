"use client"

import { useEffect, useState } from "react"
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase"
import type { Progress } from "@/lib/supabase"
import { useAuth } from "./useAuth"
import { useCredits } from "./useCredits"

export function useProgress() {
  const { user, isConfigured } = useAuth()
  const { addXP, updateStreak } = useCredits()
  const [progress, setProgress] = useState<Progress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false)
      return
    }

    if (user) {
      fetchProgress()
    } else {
      setProgress([])
      setLoading(false)
    }
  }, [user, isConfigured])

  const fetchProgress = async () => {
    if (!user || !isSupabaseConfigured()) {
      setLoading(false)
      return
    }

    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("progress")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })

      if (error) throw error
      setProgress(data || [])
    } catch (error) {
      console.error("Error fetching progress:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateProgress = async (courseId: string, progressPercentage: number) => {
    if (!user || !isSupabaseConfigured()) return { error: "No user logged in or Supabase not configured" }

    const status = progressPercentage === 0 ? "not-started" : progressPercentage === 100 ? "completed" : "in-progress"

    const existingProgress = progress.find((p) => p.course_id === courseId)

    const updateData: Partial<Progress> = {
      user_id: user.id,
      course_id: courseId,
      course_title: existingProgress?.course_title || "Unknown Course",
      progress_percentage: progressPercentage,
      status,
      updated_at: new Date().toISOString(),
    }

    if (status === "in-progress" && !existingProgress?.started_at) {
      updateData.started_at = new Date().toISOString()
    }

    if (status === "completed") {
      updateData.completed_at = new Date().toISOString()
      updateData.xp_earned = 50 // Default XP reward
    }

    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("progress")
        .upsert(updateData, { onConflict: "user_id,course_id" })
        .select()
        .single()

      if (error) throw error

      // Update local state
      setProgress((prev) => {
        const existing = prev.find((p) => p.course_id === courseId)
        if (existing) {
          return prev.map((p) => (p.course_id === courseId ? data : p))
        } else {
          return [data, ...prev]
        }
      })

      // Add XP and update streak if course completed
      if (status === "completed") {
        await addXP(updateData.xp_earned || 50)
        await updateStreak()
      }

      return { data, error: null }
    } catch (error) {
      console.error("Error updating progress:", error)
      return { data: null, error }
    }
  }

  const startCourse = async (courseId: string, courseTitle: string) => {
    if (!user || !isSupabaseConfigured()) return { error: "No user logged in or Supabase not configured" }

    const updateData: Partial<Progress> = {
      user_id: user.id,
      course_id: courseId,
      course_title: courseTitle,
      progress_percentage: 10,
      xp_earned: 0,
      status: "in-progress",
      started_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("progress")
        .upsert(updateData, { onConflict: "user_id,course_id" })
        .select()
        .single()

      if (error) throw error

      // Update local state
      setProgress((prev) => {
        const existing = prev.find((p) => p.course_id === courseId)
        if (existing) {
          return prev.map((p) => (p.course_id === courseId ? data : p))
        } else {
          return [data, ...prev]
        }
      })

      return { data, error: null }
    } catch (error) {
      console.error("Error starting course:", error)
      return { data: null, error }
    }
  }

  return {
    progress,
    loading,
    updateProgress,
    startCourse,
    refetch: fetchProgress,
    isConfigured,
  }
}
