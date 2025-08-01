const courses = [
  { name: "Git Mastery", icon: "🔧", color: "sage" },
  { name: "Figma Design", icon: "🎨", color: "sky" },
  { name: "AI Prompting", icon: "🤖", color: "lavender" },
  { name: "Canva Quick", icon: "✨", color: "beige" },
  { name: "React Hooks", icon: "⚛️", color: "sage" },
  { name: "CSS Grid", icon: "📐", color: "sky" },
  { name: "TypeScript", icon: "📝", color: "lavender" },
  { name: "Node.js API", icon: "🚀", color: "beige" },
]

export default function Marquee() {
  return (
    <section
      id="marquee"
      className="py-16 bg-gradient-to-r from-sage-100/50 to-sky-100/50 backdrop-blur-sm border-y border-sage-200/30"
    >
      <div className="overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...courses, ...courses, ...courses].map((course, index) => (
            <div
              key={index}
              className={`mx-6 flex items-center space-x-3 bg-white/60 backdrop-blur-sm border border-${course.color}-200/50 rounded-full px-6 py-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300`}
            >
              <span className="text-2xl">{course.icon}</span>
              <span className="font-poppins font-medium text-slate-700">{course.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
