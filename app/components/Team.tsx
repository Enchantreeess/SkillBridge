"use client"

const team = [
  {
    name: "Alex Chen",
    role: "Lead Instructor",
    image: "/placeholder.svg?height=300&width=300",
    quote: "Teaching is the art of making complex simple.",
    specialty: "Full-Stack Development",
  },
  {
    name: "Sarah Johnson",
    role: "Design Expert",
    image: "/placeholder.svg?height=300&width=300",
    quote: "Good design is invisible, great design is unforgettable.",
    specialty: "UI/UX Design",
  },
  {
    name: "Mike Rodriguez",
    role: "AI Specialist",
    image: "/placeholder.svg?height=300&width=300",
    quote: "AI is not magic, it's just really good math.",
    specialty: "Machine Learning",
  },
  {
    name: "Emily Davis",
    role: "Content Creator",
    image: "/placeholder.svg?height=300&width=300",
    quote: "Every expert was once a beginner.",
    specialty: "Creative Tools",
  },
]

export default function Team() {
  return (
    <section id="team" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Meet Our Team
          </h2>
          <p className="text-xl text-gray-300">Expert instructors passionate about microlearning</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div
              key={index}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-500 hover:scale-105"
            >
              {/* Profile Image */}
              <div className="relative mb-6 overflow-hidden rounded-xl">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                <p className="text-blue-400 font-medium mb-2">{member.role}</p>
                <p className="text-sm text-gray-400 mb-4">{member.specialty}</p>
              </div>

              {/* Hover Quote */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/90 to-pink-500/90 backdrop-blur-sm rounded-2xl flex items-center justify-center p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-95">
                <div className="text-center">
                  <p className="text-white font-medium italic mb-2">"{member.quote}"</p>
                  <p className="text-blue-200 text-sm">- {member.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
