"use client"

const courses = [
  {
    title: "Git Mastery",
    description: "Master version control in just 5 minutes",
    icon: "🔧",
    tag: "New",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "AI Prompting",
    description: "Craft perfect prompts for AI tools",
    icon: "🤖",
    tag: "Hot",
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Figma Basics",
    description: "Design like a pro in minutes",
    icon: "🎨",
    tag: "Updated",
    color: "from-green-500 to-teal-500",
  },
  {
    title: "Canva Quick",
    description: "Create stunning visuals fast",
    icon: "✨",
    tag: "Popular",
    color: "from-orange-500 to-red-500",
  },
  {
    title: "React Hooks",
    description: "Modern React in 5 minutes",
    icon: "⚛️",
    tag: "New",
    color: "from-blue-500 to-purple-500",
  },
  {
    title: "CSS Grid",
    description: "Layout mastery made simple",
    icon: "📐",
    tag: "Essential",
    color: "from-pink-500 to-rose-500",
  },
  {
    title: "TypeScript",
    description: "Type-safe JavaScript basics",
    icon: "📝",
    tag: "Updated",
    color: "from-indigo-500 to-blue-500",
  },
  {
    title: "Node.js API",
    description: "Build APIs in minutes",
    icon: "🚀",
    tag: "New",
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Tailwind CSS",
    description: "Utility-first styling",
    icon: "🎯",
    tag: "Hot",
    color: "from-cyan-500 to-blue-500",
  },
]

export default function CourseGrid() {
  return (
    <section id="courses" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent mb-4">
            5-Minute Courses
          </h2>
          <p className="text-xl text-gray-300">Master new skills in the time it takes to grab coffee</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <div
              key={index}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 cursor-pointer"
            >
              {/* Tag */}
              <div
                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${course.color} text-white`}
              >
                {course.tag}
              </div>

              {/* Icon */}
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{course.icon}</div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                {course.title}
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                {course.description}
              </p>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:to-pink-500/10 rounded-2xl transition-all duration-300 pointer-events-none"></div>

              {/* Animated Border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
