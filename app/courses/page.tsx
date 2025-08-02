"use client"

import { useState } from "react"
import { useCourses } from "@/hooks/useCourses"
import { useProgress } from "@/hooks/useProgress"
import { useAuth } from "@/hooks/useAuth"

const categories = ["All", "Technology", "AI", "Design", "Science", "Business", "Humanities"]

const certificates = [
  {
    title: "Full-Stack Developer",
    courses: ["Git Mastery", "React Hooks", "Node.js API", "JavaScript ES6+", "TypeScript Essentials"],
    badge: "🏆",
    color: "from-sage-400 to-sky-400",
    description: "Master modern web development with this comprehensive certificate program.",
  },
  {
    title: "AI Specialist",
    courses: ["AI Prompt Engineering", "Machine Learning Basics", "ChatGPT for Productivity", "Computer Vision Intro"],
    badge: "🤖",
    color: "from-lavender-400 to-beige-400",
    description: "Become an AI expert with cutting-edge artificial intelligence courses.",
  },
  {
    title: "Design Master",
    courses: ["Figma Design Basics", "Color Theory", "Typography Essentials", "Logo Design", "Mobile UI Design"],
    badge: "🎨",
    color: "from-sky-400 to-sage-400",
    description: "Create stunning designs with professional design principles and tools.",
  },
]

export default function Courses() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedCertificate, setSelectedCertificate] = useState<number | null>(null)
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null)
  const { courses, loading } = useCourses()
  const { startCourse } = useProgress()
  const { user } = useAuth()

  // Filter courses based on selected category
  const filteredCourses = courses.filter((course) => {
    if (selectedCategory === "All") return true
    return course.category === selectedCategory
  })

  const handleStartCourse = async (courseId: string, courseTitle: string) => {
    if (!user) {
      alert("Please sign in to start learning!")
      return
    }

    try {
      await startCourse(courseId, courseTitle)
      alert(`Started "${courseTitle}"! Check your progress in My Learning.`)
    } catch (error) {
      console.error("Error starting course:", error)
      alert("Error starting course. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sage-200 border-t-sage-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading courses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 animate-fade-in-scale">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
      <div className="text-center mb-12 animate-slide-in-bottom">
  <h1 className="text-5xl font-poppins font-bold text-slate-800 mb-4">Explore Courses</h1>
  <p className="text-xl text-slate-600 mb-4">Master new skills in just 5 minutes</p>

  <div className="flex justify-center items-center space-x-2">
    <h2 className="overflow-hidden whitespace-nowrap border-r-2 border-lavender-600 text-xl sm:text-2xl font-poppins font-semibold text-lavender-600 animate-typewriter">
      Build your future, one micro-course at a time
    </h2>
    <span className="animate-blink text-lavender-600 font-bold text-2xl">|</span>
  </div>
</div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 animate-slide-in-left">
          {categories.map((category, index) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 animate-fade-in ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-sage-500 to-lavender-500 text-white shadow-lg"
                  : "bg-white/60 backdrop-blur-sm border border-sage-200 text-slate-700 hover:bg-sage-50"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {category}
              <span className="ml-2 text-sm opacity-75">
                ({category === "All" ? courses.length : courses.filter((c) => c.category === category).length})
              </span>
            </button>
          ))}
        </div>

        {/* Most Popular Certificates */}
        <div className="mb-16 animate-slide-in-right">
          <h2 className="text-3xl font-poppins font-bold text-slate-800 mb-8 text-center">🏆 Certificate Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {certificates.map((cert, index) => (
              <div key={index} className="relative">
                <div
                  className={`p-6 rounded-2xl bg-gradient-to-br ${cert.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer animate-fade-in`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                  onClick={() => setSelectedCertificate(selectedCertificate === index ? null : index)}
                >
                  <div className="text-4xl mb-4">{cert.badge}</div>
                  <h3 className="text-xl font-poppins font-semibold mb-2">{cert.title}</h3>
                  <p className="text-white/90 mb-4">{cert.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{cert.courses.length} courses included</span>
                    <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-2 px-4 rounded-full transition-all duration-300">
                      {selectedCertificate === index ? "Hide Courses" : "View Courses"}
                    </button>
                  </div>
                </div>

                {/* Certificate Course List */}
                {selectedCertificate === index && (
                  <div className="absolute top-full left-0 right-0 mt-4 bg-white/90 backdrop-blur-sm border border-sage-200/50 rounded-2xl p-6 shadow-xl z-10 animate-slide-in-bottom">
                    <h4 className="font-semibold text-slate-800 mb-4">Certificate Courses:</h4>
                    <div className="space-y-3">
                      {cert.courses.map((courseName, courseIndex) => (
                        <div
                          key={courseIndex}
                          className="flex items-center justify-between p-3 bg-sage-50 rounded-lg hover:bg-sage-100 transition-colors duration-200"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-sage-500 rounded-full"></div>
                            <span className="text-slate-700 font-medium">{courseName}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs bg-sage-200 text-sage-700 px-2 py-1 rounded-full">5 min</span>
                            <span className="text-xs bg-lavender-200 text-lavender-700 px-2 py-1 rounded-full">
                              50 XP
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-center">
                      <button className="bg-gradient-to-r from-sage-500 to-lavender-500 hover:from-sage-600 hover:to-lavender-600 text-white font-medium py-2 px-6 rounded-full transition-all duration-300 hover:scale-105">
                        Start Certificate Program
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Filter Display */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-2xl font-poppins font-bold text-slate-800 mb-4">
            {selectedCategory === "All" ? "All Courses" : `${selectedCategory} Courses`}
          </h2>
          <p className="text-slate-600">
            Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""}
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Course Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-poppins font-semibold text-slate-800 mb-2">No courses found</h3>
            <p className="text-slate-600 mb-6">No courses available in the {selectedCategory} category yet.</p>
            <button
              onClick={() => setSelectedCategory("All")}
              className="bg-gradient-to-r from-sage-500 to-lavender-500 hover:from-sage-600 hover:to-lavender-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 hover:scale-105"
            >
              View All Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course, index) => (
              <div
                key={course.id}
                className="group bg-white/60 backdrop-blur-sm border border-sage-200/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slide-in-bottom"
                style={{ animationDelay: `${index * 0.1}s` }}
                onMouseEnter={() => setHoveredCourse(course.id)}
                onMouseLeave={() => setHoveredCourse(null)}
              >
                {/* Thumbnail */}
                <div className="relative overflow-hidden">
                  <img
                    src={course.image_url || "/placeholder.svg?height=200&width=300&text=Course"}
                    alt={course.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                        course.difficulty === "Beginner"
                          ? "bg-green-500"
                          : course.difficulty === "Intermediate"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    >
                      {course.difficulty}
                    </span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-sage-500 text-white">
                      {course.category}
                    </span>
                  </div>
                  {hoveredCourse === course.id && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center animate-fade-in">
                      <p className="text-white text-center px-4 font-medium">{course.description}</p>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-poppins font-semibold text-slate-800 mb-2">{course.title}</h3>
                  <p className="text-sage-600 font-medium mb-3">by {course.instructor}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-600">{course.duration_minutes} min</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-sm text-slate-600">{course.xp_reward} XP</span>
                    </div>
                    {course.is_popular && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded-full">
                        🔥 Popular
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleStartCourse(course.id, course.title)}
                    className="w-full bg-gradient-to-r from-sage-500 to-lavender-500 hover:from-sage-600 hover:to-lavender-600 text-white font-medium py-2 px-4 rounded-full transition-all duration-300 hover:scale-105"
                  >
                    Start Course
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
