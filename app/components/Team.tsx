"use client"

const team = [
  {
    name: "Aadiraj Singh Chauhan",
    role: "Lead Instructor & Founder",
    image: "/placeholder.svg?height=300&width=300&text=Aadiraj",
    quote: "Teaching is the art of making complex simple.",
    specialty: "Full-Stack Development & AI",
  },
  {
    name: "Anusha Singh",
    role: "Co-Founder & Design Expert",
    image: "/placeholder.svg?height=300&width=300&text=Anusha",
    quote: "Good design is invisible, great design is unforgettable.",
    specialty: "UI/UX Design & Strategy",
  },
]

export default function Team() {
  return (
    <section id="team" className="py-20 px-4 animate-slide-in-bottom">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Meet Our Team
          </h2>
          <p className="text-xl text-gray-300">Expert instructors passionate about microlearning</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {team.map((member, index) => (
            <div
              key={index}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 hover:scale-105"
            >
              {/* Profile Image */}
              <div className="relative mb-6 overflow-hidden rounded-xl mx-auto w-64 h-64">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-blue-400 font-medium mb-2">{member.role}</p>
                <p className="text-sm text-gray-400 mb-4">{member.specialty}</p>
              </div>

              {/* Hover Quote */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/90 to-pink-500/90 backdrop-blur-sm rounded-2xl flex items-center justify-center p-8 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-95">
                <div className="text-center">
                  <p className="text-white font-medium italic mb-4 text-lg">"{member.quote}"</p>
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
