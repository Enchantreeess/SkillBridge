"use client"

import { useState } from "react"

const team = [
  {
    id: 1,
    name: "Aadiraj Singh Chauhan",
    role: "Lead Instructor & Founder",
    image: "/placeholder.svg?height=300&width=300&text=Aadiraj",
    quote: "Learning should be accessible, engaging, and transformative.",
    specialty: "Full-Stack Development & AI",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    funFact: "Can solve a Rubik's cube in under 2 minutes!",
  },
  {
    id: 2,
    name: "Anusha Singh",
    role: "Design Expert & Co-Founder",
    image: "/placeholder.svg?height=300&width=300&text=Anusha",
    quote: "Good design is invisible, great design is unforgettable.",
    specialty: "UI/UX Design & Creative Tools",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    funFact: "Has designed over 100 mobile app interfaces!",
  },
  {
    id: 3,
    name: "Alex Chen",
    role: "Tech Instructor",
    image: "/placeholder.svg?height=300&width=300&text=Alex",
    quote: "Code is poetry written in logic.",
    specialty: "Backend Development & DevOps",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    funFact: "Contributes to 15+ open source projects!",
  },
  {
    id: 4,
    name: "Sarah Johnson",
    role: "AI Specialist",
    image: "/placeholder.svg?height=300&width=300&text=Sarah",
    quote: "AI is not magic, it's just really good math.",
    specialty: "Machine Learning & Data Science",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    funFact: "Published 20+ research papers on AI!",
  },
  {
    id: 5,
    name: "Mike Rodriguez",
    role: "Content Creator",
    image: "/placeholder.svg?height=300&width=300&text=Mike",
    quote: "Every expert was once a beginner.",
    specialty: "Video Production & Storytelling",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    funFact: "Created over 500 educational videos!",
  },
  {
    id: 6,
    name: "Emily Davis",
    role: "Community Manager",
    image: "/placeholder.svg?height=300&width=300&text=Emily",
    quote: "Learning together makes us all stronger.",
    specialty: "Community Building & Support",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    funFact: "Speaks 5 languages fluently!",
  },
]

export default function Team() {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null)

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-poppins font-bold text-slate-800 mb-4">Meet Our Team</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Passionate educators and industry experts dedicated to making learning accessible, engaging, and
            transformative for everyone.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member) => (
            <div
              key={member.id}
              className="group relative bg-white/60 backdrop-blur-sm border border-sage-200/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105"
              onMouseEnter={() => setHoveredMember(member.id)}
              onMouseLeave={() => setHoveredMember(null)}
            >
              {/* Profile Image */}
              <div className="relative overflow-hidden">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Social Links */}
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-poppins font-semibold text-slate-800 mb-1">{member.name}</h3>
                <p className="text-sage-600 font-medium mb-2">{member.role}</p>
                <p className="text-sm text-slate-600 mb-4">{member.specialty}</p>
              </div>

              {/* Hover Overlay */}
              {hoveredMember === member.id && (
                <div className="absolute inset-0 bg-gradient-to-br from-sage-500/95 to-sky-500/95 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
                  <div className="text-center text-white">
                    <div className="text-4xl mb-4">💡</div>
                    <p className="font-medium italic mb-3">"{member.quote}"</p>
                    <div className="text-sm bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                      Fun Fact: {member.funFact}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-br from-sage-100 to-sky-100 rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-poppins font-bold text-slate-800 mb-4">Want to Join Our Team?</h2>
            <p className="text-lg text-slate-600 mb-6">
              We're always looking for passionate educators and industry experts to help us create amazing learning
              experiences.
            </p>
            <button className="bg-gradient-to-r from-sage-500 to-sky-500 hover:from-sage-600 hover:to-sky-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 hover:scale-105 shadow-lg">
              View Open Positions
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
