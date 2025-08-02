"use client"

import { useState } from "react"

const categories = ["All", "Tech", "AI", "Design", "Writing", "Business"]

const courses = [
  {
    id: 1,
    title: "Git Mastery in 5 Minutes",
    teacher: "Alex Chen",
    category: "Tech",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Git",
    xp: 50,
    tag: "New",
    description: "Master version control with Git in just 5 minutes",
    popular: true,
  },
  {
    id: 2,
    title: "AI Prompt Engineering",
    teacher: "Sarah Johnson",
    category: "AI",
    thumbnail: "/placeholder.svg?height=200&width=300&text=AI",
    xp: 75,
    tag: "Hot",
    description: "Craft perfect prompts for AI tools",
    popular: true,
  },
  {
    id: 3,
    title: "Figma Design Basics",
    teacher: "Mike Rodriguez",
    category: "Design",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Figma",
    xp: 60,
    tag: "Popular",
    description: "Design like a pro in minutes",
    popular: false,
  },
  {
    id: 4,
    title: "Canva Quick Start",
    teacher: "Emily Davis",
    category: "Design",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Canva",
    xp: 40,
    tag: "Updated",
    description: "Create stunning visuals fast",
    popular: true,
  },
  {
    id: 5,
    title: "Business Writing",
    teacher: "John Smith",
    category: "Writing",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Writing",
    xp: 55,
    tag: "Essential",
    description: "Professional communication skills",
    popular: false,
  },
  {
    id: 6,
    title: "React Hooks Deep Dive",
    teacher: "Alex Chen",
    category: "Tech",
    thumbnail: "/placeholder.svg?height=200&width=300&text=React",
    xp: 80,
    tag: "Advanced",
    description: "Modern React development",
    popular: false,
  },
]

const certificates = [
  {
    title: "Full-Stack Developer",
    courses: 12,
    badge: "🏆",
    color: "from-sage-400 to-sky-400",
  },
  {
    title: "AI Specialist",
    courses: 8,
    badge: "🤖",
    color: "from-sky-400 to-lavender-400",
  },
  {
    title: "Design Master",
    courses: 10,
    badge: "🎨",
    color: "from-lavender-400 to-sage-400",
  },
]

export default function Courses() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [hoveredCourse, setHoveredCourse] = useState<number | null>(null)

  const filteredCourses = courses.filter((course) => selectedCategory === "All" || course.category === selectedCategory)

  const popularCourses = courses.filter((course) => course.popular)

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-poppins font-bold text-slate-800 mb-4">Explore Courses</h1>
          <p className="text-xl text-slate-600">Master new skills in just 5 minutes</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-sage-500 to-sky-500 text-white shadow-lg"
                  : "bg-white/60 backdrop-blur-sm border border-sage-200 text-slate-700 hover:bg-sage-50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Most Popular Certificates */}
        <div className="mb-16">
          <h2 className="text-3xl font-poppins font-bold text-slate-800 mb-8 text-center">Most Popular Certificates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {certificates.map((cert, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl bg-gradient-to-br ${cert.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
              >
                <div className="text-4xl mb-4">{cert.badge}</div>
                <h3 className="text-xl font-poppins font-semibold mb-2">{cert.title}</h3>
                <p className="text-white/90 mb-4">{cert.courses} courses included</p>
                <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-2 px-4 rounded-full transition-all duration-300">
                  View Certificate
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="group bg-white/60 backdrop-blur-sm border border-sage-200/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onMouseEnter={() => setHoveredCourse(course.id)}
              onMouseLeave={() => setHoveredCourse(null)}
            >
              {/* Thumbnail */}
              <div className="relative overflow-hidden">
                <img
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                      course.tag === "New"
                        ? "bg-sage-500"
                        : course.tag === "Hot"
                          ? "bg-red-500"
                          : course.tag === "Popular"
                            ? "bg-sky-500"
                            : course.tag === "Updated"
                              ? "bg-lavender-500"
                              : "bg-gray-500"
                    }`}
                  >
                    {course.tag}
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
                <p className="text-sage-600 font-medium mb-3">by {course.teacher}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{course.xp} XP</span>
                  <button className="bg-gradient-to-r from-sage-500 to-sky-500 hover:from-sage-600 hover:to-sky-600 text-white font-medium py-2 px-4 rounded-full transition-all duration-300 hover:scale-105">
                    Start Course
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
