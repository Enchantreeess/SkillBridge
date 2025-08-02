"use client"

import { useEffect, useState } from "react"
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase"
import type { Course } from "@/lib/supabase"

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    if (!isSupabaseConfigured()) {
      // Demo mode - return sample courses
      const demoCourses: Course[] = [
        {
          id: "1",
          title: "Git Mastery in 5 Minutes",
          description: "Master version control with Git fundamentals",
          instructor: "Aadiraj Singh Chauhan",
          category: "Technology",
          image_url: "/placeholder.svg?height=200&width=300&text=Git",
          xp_reward: 50,
          difficulty: "Beginner",
          duration_minutes: 5,
          is_popular: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "2",
          title: "Figma Design Basics",
          description: "Learn UI/UX design principles in Figma",
          instructor: "Anusha Singh",
          category: "Design",
          image_url: "/placeholder.svg?height=200&width=300&text=Figma",
          xp_reward: 60,
          difficulty: "Beginner",
          duration_minutes: 5,
          is_popular: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "3",
          title: "AI Prompt Engineering",
          description: "Craft perfect prompts for AI tools",
          instructor: "Aadiraj Singh Chauhan",
          category: "AI",
          image_url: "/placeholder.svg?height=200&width=300&text=AI",
          xp_reward: 75,
          difficulty: "Intermediate",
          duration_minutes: 5,
          is_popular: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "4",
          title: "Machine Learning Basics",
          description: "Introduction to ML algorithms and concepts",
          instructor: "Aadiraj Singh Chauhan",
          category: "AI",
          image_url: "/placeholder.svg?height=200&width=300&text=ML",
          xp_reward: 90,
          difficulty: "Intermediate",
          duration_minutes: 5,
          is_popular: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "5",
          title: "React Hooks Deep Dive",
          description: "Modern React development patterns",
          instructor: "Aadiraj Singh Chauhan",
          category: "Technology",
          image_url: "/placeholder.svg?height=200&width=300&text=React",
          xp_reward: 80,
          difficulty: "Advanced",
          duration_minutes: 5,
          is_popular: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "6",
          title: "Color Theory Fundamentals",
          description: "Understanding color psychology and application in design",
          instructor: "Anusha Singh",
          category: "Design",
          image_url: "/placeholder.svg?height=200&width=300&text=Color",
          xp_reward: 45,
          difficulty: "Beginner",
          duration_minutes: 5,
          is_popular: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "7",
          title: "Business Strategy 101",
          description: "Core principles of business strategy and planning",
          instructor: "Anusha Singh",
          category: "Business",
          image_url: "/placeholder.svg?height=200&width=300&text=Strategy",
          xp_reward: 65,
          difficulty: "Beginner",
          duration_minutes: 5,
          is_popular: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "8",
          title: "Data Science with Python",
          description: "Introduction to data analysis and visualization",
          instructor: "Aadiraj Singh Chauhan",
          category: "Science",
          image_url: "/placeholder.svg?height=200&width=300&text=DataScience",
          xp_reward: 80,
          difficulty: "Intermediate",
          duration_minutes: 5,
          is_popular: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]
      setCourses(demoCourses)
      setLoading(false)
      return
    }

    try {
      const supabase = getSupabaseClient()

      // First, try to fetch with created_at ordering
      let { data, error } = await supabase.from("courses").select("*").order("created_at", { ascending: false })

      // If created_at column doesn't exist, try without ordering
      if (error && error.message.includes("created_at")) {
        console.warn("created_at column not found, fetching without ordering")
        const fallbackResult = await supabase.from("courses").select("*")

        data = fallbackResult.data
        error = fallbackResult.error
      }

      // If still error, try with different column ordering
      if (error && error.message.includes("column")) {
        console.warn("Column issue detected, trying basic select")
        const basicResult = await supabase
          .from("courses")
          .select(
            "id, title, description, instructor, category, image_url, xp_reward, difficulty, duration_minutes, is_popular",
          )

        // Add missing timestamps to the data
        if (basicResult.data) {
          const now = new Date().toISOString()
          data = basicResult.data.map((course) => ({
            ...course,
            created_at: now,
            updated_at: now,
          }))
          error = null
        } else {
          data = basicResult.data
          error = basicResult.error
        }
      }

      if (error) throw error

      // Ensure all courses have required fields
      const processedCourses = (data || []).map((course) => ({
        ...course,
        created_at: course.created_at || new Date().toISOString(),
        updated_at: course.updated_at || new Date().toISOString(),
        duration_minutes: course.duration_minutes || 5,
        xp_reward: course.xp_reward || 50,
        difficulty: course.difficulty || "Beginner",
        is_popular: course.is_popular || false,
      }))

      setCourses(processedCourses)
    } catch (error: any) {
      console.error("Error fetching courses:", error)
      setError(error.message)

      // Fallback to demo courses if database fetch fails
      console.log("Falling back to demo courses due to database error")
      const demoCourses: Course[] = [
        {
          id: "demo-1",
          title: "Git Mastery in 5 Minutes",
          description: "Master version control with Git fundamentals",
          instructor: "Aadiraj Singh Chauhan",
          category: "Technology",
          image_url: "/placeholder.svg?height=200&width=300&text=Git",
          xp_reward: 50,
          difficulty: "Beginner",
          duration_minutes: 5,
          is_popular: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "demo-2",
          title: "Figma Design Basics",
          description: "Learn UI/UX design principles in Figma",
          instructor: "Anusha Singh",
          category: "Design",
          image_url: "/placeholder.svg?height=200&width=300&text=Figma",
          xp_reward: 60,
          difficulty: "Beginner",
          duration_minutes: 5,
          is_popular: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "demo-3",
          title: "AI Prompt Engineering",
          description: "Craft perfect prompts for AI tools",
          instructor: "Aadiraj Singh Chauhan",
          category: "AI",
          image_url: "/placeholder.svg?height=200&width=300&text=AI",
          xp_reward: 75,
          difficulty: "Intermediate",
          duration_minutes: 5,
          is_popular: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]
      setCourses(demoCourses)
    } finally {
      setLoading(false)
    }
  }

  return {
    courses,
    loading,
    error,
    refetch: fetchCourses,
  }
}
