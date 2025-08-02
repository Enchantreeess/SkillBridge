"use client"

import { useCourses } from "@/hooks/useCourses"

export default function Marquee() {
  const { courses } = useCourses()

  // Take first 8 courses for marquee
  const marqueeCourses = courses.slice(0, 8)

  return (
    <section
      id="courses"
      className="py-16 bg-gradient-to-r from-sage-100/50 via-lavender-100/50 to-sky-100/50 backdrop-blur-sm border-y border-sage-200/30"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-poppins font-bold text-slate-800 mb-2">Popular Courses</h2>
        <p className="text-slate-600">Discover what thousands of learners are mastering</p>
      </div>

      <div className="overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...marqueeCourses, ...marqueeCourses, ...marqueeCourses].map((course, index) => (
            <div
              key={`${course.id}-${index}`}
              className="mx-6 flex-shrink-0 bg-white/60 backdrop-blur-sm border border-sage-200/50 rounded-2xl p-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 w-80"
            >
              <img
                src={course.image_url || "/placeholder.svg?height=120&width=280&text=Course"}
                alt={course.title}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <h3 className="font-poppins font-semibold text-slate-800 mb-1 truncate">{course.title}</h3>
              <p className="text-sm text-sage-600 mb-2">by {course.instructor}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-sage-100 text-sage-700 px-2 py-1 rounded-full">{course.category}</span>
                <span className="text-sm font-medium text-lavender-600">{course.xp_reward} XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
