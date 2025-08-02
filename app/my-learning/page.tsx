"use client"

import { useProgress } from "@/hooks/useProgress"
import { useCredits } from "@/hooks/useCredits"
import { useAuth } from "@/hooks/useAuth"
import Link from "next/link"

export default function MyLearning() {
  const { user } = useAuth()
  const { progress, loading, updateProgress } = useProgress()
  const { credits } = useCredits()

  // Sample completed course for demo
  const sampleProgress = [
    {
      id: "sample-1",
      course_id: "git-mastery",
      course_title: "Git Mastery in 5 Minutes",
      progress_percentage: 71,
      xp_earned: 35,
      status: "in-progress" as const,
      user_id: user?.id || "demo",
      started_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "sample-2",
      course_id: "figma-basics",
      course_title: "Figma Design Basics",
      progress_percentage: 100,
      xp_earned: 60,
      status: "completed" as const,
      user_id: user?.id || "demo",
      started_at: new Date(Date.now() - 86400000).toISOString(),
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]

  const displayProgress = progress.length > 0 ? progress : sampleProgress

  if (!user) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center animate-slide-in-bottom">
        <div className="text-center">
          <h1 className="text-3xl font-poppins font-bold text-slate-800 mb-4">Please Sign In</h1>
          <p className="text-slate-600 mb-6">You need to be logged in to view your learning progress.</p>
          <Link
            href="/auth"
            className="bg-gradient-to-r from-sage-500 to-lavender-500 hover:from-sage-600 hover:to-lavender-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 hover:scale-105"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sage-200 border-t-sage-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your learning progress...</p>
        </div>
      </div>
    )
  }

  const totalXP = credits?.total_xp || 85
  const completedCourses = displayProgress.filter((course) => course.status === "completed").length
  const inProgressCourses = displayProgress.filter((course) => course.status === "in-progress").length

  const handleContinueLearning = async (courseId: string, currentProgress: number) => {
    const newProgress = Math.min(currentProgress + 25, 100)
    await updateProgress(courseId, newProgress)
  }

  return (
    <div className="min-h-screen py-8 px-4 animate-slide-in-right">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
       {/* Header */}
<div className="text-center mb-12 animate-fade-in">
  <h1 className="text-5xl font-poppins font-bold text-slate-800 mb-4">My Learning Journey</h1>
  <p className="text-xl text-slate-600 mb-4">Track your progress and continue your learning adventure</p>

  <div className="flex justify-center items-center space-x-2">
    <h2 className="overflow-hidden whitespace-nowrap border-r-2 border-sage-600 text-xl sm:text-2xl font-poppins font-semibold text-sage-600 animate-typewriter">
      Bridge the gap between curiosity and mastery
    </h2>
    <span className="animate-blink text-sage-600 font-bold text-2xl">|</span>
  </div>
</div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 stagger-animation">
          <div className="bg-gradient-to-br from-sage-100 to-sage-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="text-3xl font-bold text-sage-700 mb-2">{totalXP}</div>
            <div className="text-sage-600 font-medium">Total XP Earned</div>
            <div className="mt-2 text-sm text-sage-500">🎯 Keep learning to earn more!</div>
          </div>
          <div className="bg-gradient-to-br from-lavender-100 to-lavender-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="text-3xl font-bold text-lavender-700 mb-2">{completedCourses}</div>
            <div className="text-lavender-600 font-medium">Courses Completed</div>
            <div className="mt-2 text-sm text-lavender-500">🏆 Amazing progress!</div>
          </div>
          <div className="bg-gradient-to-br from-sky-100 to-sky-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="text-3xl font-bold text-sky-700 mb-2">{inProgressCourses}</div>
            <div className="text-sky-600 font-medium">In Progress</div>
            <div className="mt-2 text-sm text-sky-500">📚 Keep going!</div>
          </div>
        </div>

        {/* Course List */}
        <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-poppins font-bold text-slate-800">Your Courses</h2>
            <Link
              href="/courses"
              className="bg-gradient-to-r from-sage-500 to-lavender-500 hover:from-sage-600 hover:to-lavender-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Browse Courses
            </Link>
          </div>

          {displayProgress.map((course, index) => (
            <div
              key={course.id}
              className="bg-white/60 backdrop-blur-sm border border-sage-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-slide-in-left"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center space-x-6">
                {/* Thumbnail */}
                <div className="w-24 h-16 bg-gradient-to-br from-sage-200 to-lavender-200 rounded-lg shadow-md flex items-center justify-center relative overflow-hidden">
                  <span className="text-2xl">
                    {course.course_title.includes("Git") ? "🔧" : course.course_title.includes("Figma") ? "🎨" : "📚"}
                  </span>
                  {course.status === "completed" && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-poppins font-semibold text-slate-800 mb-2">{course.course_title}</h3>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-600">Progress</span>
                      <span className="text-sm font-medium text-slate-700">{course.progress_percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          course.status === "completed"
                            ? "bg-gradient-to-r from-green-400 to-emerald-500"
                            : course.status === "in-progress"
                              ? "bg-gradient-to-r from-sky-400 to-lavender-400"
                              : "bg-gray-300"
                        }`}
                        style={{ width: `${course.progress_percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-slate-600">{course.xp_earned} XP earned</span>
                      {course.status === "completed" && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          ✅ Completed
                        </span>
                      )}
                      {course.status === "in-progress" && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          🔄 In Progress
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleContinueLearning(course.course_id, course.progress_percentage)}
                      className={`font-medium py-2 px-4 rounded-full transition-all duration-300 hover:scale-105 ${
                        course.status === "completed"
                          ? "bg-sage-100 text-sage-700 hover:bg-sage-200"
                          : course.status === "in-progress"
                            ? "bg-gradient-to-r from-sky-500 to-lavender-500 text-white hover:from-sky-600 hover:to-lavender-600"
                            : "bg-gradient-to-r from-sage-500 to-lavender-500 text-white hover:from-sage-600 hover:to-lavender-600"
                      }`}
                    >
                      {course.status === "completed"
                        ? "Review Course"
                        : course.status === "in-progress"
                          ? "Continue Learning"
                          : "Start Course"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Achievement Section */}
        <div
          className="mt-16 bg-gradient-to-br from-beige-100 to-sage-100 rounded-2xl p-8 shadow-lg animate-fade-in-scale"
          style={{ animationDelay: "0.5s" }}
        >
          <h3 className="text-2xl font-poppins font-bold text-slate-800 mb-4 text-center">🎉 Recent Achievement</h3>
          <div className="text-center">
            <div className="text-4xl mb-2">🏆</div>
            <p className="text-lg font-medium text-slate-700">Skill Explorer</p>
            <p className="text-slate-600">You've completed your first course! Keep up the great work.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
