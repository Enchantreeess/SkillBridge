"use client"

import { useEffect, useState } from "react"
import type { CourseProgress } from "@/lib/supabase"
import { useAuth } from "./useAuth"
import { useUserProfile } from "./useUserProfile"
import { getSupabaseClient } from "@/lib/supabase"

export function useCourseProgress() {
  const { user, isConfigured } = useAuth()
  const { addXP, updateStreak } = useUserProfile()
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false)
      return
    }

    if (user) {
      fetchCourseProgress()
    } else {
      setCourseProgress([])
      setLoading(false)
    }
  }, [user, isConfigured])

  const fetchCourseProgress = async () => {
    if (!user || !isConfigured) return

    try {
      const supabase = getSupabaseClient()

      // Try to fetch progress with error handling for missing columns
      let { data, error } = await supabase
        .from("progress")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })

      // If updated_at column doesn't exist, try without ordering
      if (error && error.message.includes("updated_at")) {
        console.warn("updated_at column not found in progress table, fetching without ordering")
        const fallbackResult = await supabase.from("progress").select("*").eq("user_id", user.id)

        data = fallbackResult.data
        error = fallbackResult.error
      }

      if (error) throw error
      setCourseProgress(data || [])
    } catch (error) {
      console.error("Error fetching course progress:", error)
      // Set empty array on error to prevent app crash
      setCourseProgress([])
    } finally {
      setLoading(false)
    }
  }

  const updateCourseProgress = async (
    courseId: string,
    courseTitle: string,
    progressPercentage: number,
    xpEarned: number,
  ) => {
    if (!user || !isConfigured) return { error: "No user logged in or Supabase not configured" }

    const status = progressPercentage === 0 ? "not-started" : progressPercentage === 100 ? "completed" : "in-progress"

    const updateData: Partial<CourseProgress> = {
      user_id: user.id,
      course_id: courseId,
      course_title: courseTitle,
      progress_percentage: progressPercentage,
      xp_earned: xpEarned,
      status,
      updated_at: new Date().toISOString(),
    }

    if (status === "in-progress" && !courseProgress.find((cp) => cp.course_id === courseId)?.started_at) {
      updateData.started_at = new Date().toISOString()
    }

    if (status === "completed") {
      updateData.completed_at = new Date().toISOString()
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
      setCourseProgress((prev) => {
        const existing = prev.find((cp) => cp.course_id === courseId)
        if (existing) {
          return prev.map((cp) => (cp.course_id === courseId ? data : cp))
        } else {
          return [data, ...prev]
        }
      })

      // Add XP and update streak if course completed
      if (status === "completed") {
        await addXP(xpEarned)
        await updateStreak()
      }

      return { data, error: null }
    } catch (error) {
      console.error("Error updating course progress:", error)
      return { data: null, error }
    }
  }

  const startCourse = async (courseId: string, courseTitle: string) => {
    return updateCourseProgress(courseId, courseTitle, 10, 0)
  }

  const completeCourse = async (courseId: string, courseTitle: string, xpReward: number) => {
    return updateCourseProgress(courseId, courseTitle, 100, xpReward)
  }

  return {
    courseProgress,
    loading,
    updateCourseProgress,
    startCourse,
    completeCourse,
    refetch: fetchCourseProgress,
    isConfigured,
  }
}
