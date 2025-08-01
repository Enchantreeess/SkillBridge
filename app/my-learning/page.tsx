"use client"

const learningData = [
  {
    id: 1,
    title: "Git Mastery in 5 Minutes",
    progress: 100,
    xpEarned: 50,
    status: "completed",
    thumbnail: "/placeholder.svg?height=100&width=150&text=Git",
  },
  {
    id: 2,
    title: "AI Prompt Engineering",
    progress: 75,
    xpEarned: 56,
    status: "in-progress",
    thumbnail: "/placeholder.svg?height=100&width=150&text=AI",
  },
  {
    id: 3,
    title: "Figma Design Basics",
    progress: 30,
    xpEarned: 18,
    status: "in-progress",
    thumbnail: "/placeholder.svg?height=100&width=150&text=Figma",
  },
  {
    id: 4,
    title: "React Hooks Deep Dive",
    progress: 0,
    xpEarned: 0,
    status: "not-started",
    thumbnail: "/placeholder.svg?height=100&width=150&text=React",
  },
]

export default function MyLearning() {
  const totalXP = learningData.reduce((sum, course) => sum + course.xpEarned, 0)
  const completedCourses = learningData.filter((course) => course.status === "completed").length
  const inProgressCourses = learningData.filter((course) => course.status === "in-progress").length

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-poppins font-bold text-slate-800 mb-4">My Learning</h1>
          <p className="text-xl text-slate-600">Track your progress and continue your journey</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gradient-to-br from-sage-100 to-sage-200 p-6 rounded-2xl shadow-lg">
            <div className="text-3xl font-bold text-sage-700 mb-2">{totalXP}</div>
            <div className="text-sage-600 font-medium">Total XP Earned</div>
          </div>
          <div className="bg-gradient-to-br from-sky-100 to-sky-200 p-6 rounded-2xl shadow-lg">
            <div className="text-3xl font-bold text-sky-700 mb-2">{completedCourses}</div>
            <div className="text-sky-600 font-medium">Courses Completed</div>
          </div>
          <div className="bg-gradient-to-br from-lavender-100 to-lavender-200 p-6 rounded-2xl shadow-lg">
            <div className="text-3xl font-bold text-lavender-700 mb-2">{inProgressCourses}</div>
            <div className="text-lavender-600 font-medium">In Progress</div>
          </div>
        </div>

        {/* Course List */}
        <div className="space-y-6">
          {learningData.map((course) => (
            <div
              key={course.id}
              className="bg-white/60 backdrop-blur-sm border border-sage-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-center space-x-6">
                {/* Thumbnail */}
                <img
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.title}
                  className="w-24 h-16 object-cover rounded-lg shadow-md"
                />

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-poppins font-semibold text-slate-800 mb-2">{course.title}</h3>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-600">Progress</span>
                      <span className="text-sm font-medium text-slate-700">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          course.status === "completed"
                            ? "bg-gradient-to-r from-sage-400 to-sky-400"
                            : course.status === "in-progress"
                              ? "bg-gradient-to-r from-sky-400 to-lavender-400"
                              : "bg-gray-300"
                        }`}
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{course.xpEarned} XP earned</span>
                    <button
                      className={`font-medium py-2 px-4 rounded-full transition-all duration-300 hover:scale-105 ${
                        course.status === "completed"
                          ? "bg-sage-100 text-sage-700 hover:bg-sage-200"
                          : course.status === "in-progress"
                            ? "bg-gradient-to-r from-sky-500 to-lavender-500 text-white hover:from-sky-600 hover:to-lavender-600"
                            : "bg-gradient-to-r from-sage-500 to-sky-500 text-white hover:from-sage-600 hover:to-sky-600"
                      }`}
                    >
                      {course.status === "completed"
                        ? "Review"
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
      </div>
    </div>
  )
}
