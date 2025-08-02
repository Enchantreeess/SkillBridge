"use client"

import { useState } from "react"

const team = [
  {
    id: 1,
    name: "Aadiraj Singh Chauhan",
    role: "Lead Instructor & Founder",
    image: "https://aqwqmcfobjnmteibwdwi.supabase.co/storage/v1/object/sign/team-images/Aadirajsinghchauhan.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81MTZiNWZjOC03ZjMxLTQ1YTYtOWI2NS02ZDJmNTcyODQ3MmYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ0ZWFtLWltYWdlcy9BYWRpcmFqc2luZ2hjaGF1aGFuLmpwZWciLCJpYXQiOjE3NTQxMzc5MDksImV4cCI6MTc1NjcyOTkwOX0.4stblE_Vj4VsJCF9cTYuTRDD7MioMdumsSR8La4xxZw",

    quote: "Learning should be accessible, engaging, and transformative for everyone.",
    specialty: "Full-Stack Development & AI",
    github: "https://github.com/Ninja3031",
    linkedin: "https://www.linkedin.com/in/aadiraj-singh-chauhan-1a720a262/?originalSubdomain=in",
  
    funFact: "Can solve a Rubik's cube in under 2 minutes and has built 50+ web applications!",
    bio: "Passionate about making complex technologies simple and accessible. With 5+ years in full-stack development and AI, Aadiraj believes in the power of microlearning to transform careers. He has taught over 10,000 students and specializes in breaking down complex concepts into digestible 5-minute lessons.",
    achievements: ["10,000+ Students Taught", "5+ Years Experience", "AI & Full-Stack Expert", "Microlearning Pioneer"],
    courses: [
      "Git Mastery",
      "React Hooks",
      "AI Prompt Engineering",
      "Node.js API",
      "Python Fundamentals",
      "JavaScript ES6+",
    ],
    skills: ["React", "Node.js", "Python", "AI/ML", "TypeScript", "Next.js", "MongoDB", "PostgreSQL"],
  },
  {
    id: 2,
    name: "Anusha Singh",
    role: "Design Expert & Co-Founder",
    image: "https://aqwqmcfobjnmteibwdwi.supabase.co/storage/v1/object/sign/team-images/Anushasingh.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81MTZiNWZjOC03ZjMxLTQ1YTYtOWI2NS02ZDJmNTcyODQ3MmYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ0ZWFtLWltYWdlcy9BbnVzaGFzaW5naC5qcGVnIiwiaWF0IjoxNzU0MTM4MDAwLCJleHAiOjE3NTY3MzAwMDB9.6MgohoUnvBDVTSSRn_ik9Lkf9iKINuT9NqeYaS2abbE",
    quote: "Good design is invisible, great design is unforgettable.",
    specialty: "UI/UX Design & Creative Tools",
    github: "https://github.com/Enchantreeess",
    linkedin:"https://www.linkedin.com/in/anusha-singh-73937b1b9/", 
    funFact: "Has designed over 100 mobile app interfaces and can create a logo in under 10 minutes!",
    bio: "A creative visionary who believes design should tell a story. Anusha specializes in creating intuitive user experiences that make learning delightful and engaging. She has worked with startups and Fortune 500 companies, bringing a wealth of design expertise to SkillBridge.",
    achievements: ["100+ App Interfaces", "Fortune 500 Experience", "Design Systems Expert", "UX Research Specialist"],
    courses: ["Figma Design", "Color Theory", "Typography", "Logo Design", "Mobile UI Design", "Creative Writing"],
    skills: [
      "Figma",
      "Adobe Creative Suite",
      "Sketch",
      "Principle",
      "InVision",
      "User Research",
      "Prototyping",
      "Branding",
    ],
  },
]

export default function Team() {
  const [selectedMember, setSelectedMember] = useState<number | null>(null)
  const [hoveredImage, setHoveredImage] = useState<number | null>(null)

  return (
    <div className="min-h-screen py-8 px-4 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
  <div className="flex justify-center items-center space-x-2 mb-4">
    <h1 className="overflow-hidden whitespace-nowrap border-r-2 border-slate-800 text-5xl font-poppins font-bold text-slate-800 animate-typewriter">
      Meet Our Team
    </h1>
    <span className="animate-blink text-slate-800 font-bold text-5xl">|</span>
  </div>
  <p className="text-xl text-slate-600 max-w-3xl mx-auto">
    The passionate minds behind SkillBridge – dedicated to making learning accessible, engaging, and
    transformative for everyone around the world.
  </p>
</div>


        {/* Team Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {team.map((member, index) => (
            <div key={member.id} className="space-y-8 animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
              {/* Main Profile Card */}
              <div className="bg-white/60 backdrop-blur-sm border border-sage-200/50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02]">
                <div className="text-center mb-6">
                  <div
                    className="relative w-40 h-40 mx-auto mb-6 cursor-pointer"
                    onMouseEnter={() => setHoveredImage(member.id)}
                    onMouseLeave={() => setHoveredImage(null)}
                  >
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className={`w-full h-full object-cover rounded-full border-4 border-sage-200 shadow-lg transition-all duration-500 ${
                        hoveredImage === member.id
                          ? "scale-110 rotate-3 border-sage-400 shadow-2xl shadow-sage-200/50"
                          : "scale-100 rotate-0"
                      }`}
                    />
                    {/* Hover Overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br from-sage-500/20 to-lavender-500/20 rounded-full transition-all duration-500 ${
                        hoveredImage === member.id ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    {/* Animated Ring */}
                    <div
                      className={`absolute inset-0 border-4 border-gradient-to-r from-sage-400 to-lavender-400 rounded-full transition-all duration-500 ${
                        hoveredImage === member.id ? "scale-125 opacity-50" : "scale-100 opacity-0"
                      }`}
                    />
                  </div>
                  <h2 className="text-3xl font-poppins font-bold text-slate-800 mb-2 transition-colors duration-300 hover:text-sage-600">
                    {member.name}
                  </h2>
                  <p className="text-lg text-sage-600 font-medium mb-2">{member.role}</p>
                  <p className="text-slate-600">{member.specialty}</p>
                </div>

                {/* Quote */}
                <div className="bg-gradient-to-r from-sage-100 to-lavender-100 rounded-lg p-6 mb-6 hover:from-sage-200 hover:to-lavender-200 transition-all duration-300">
                  <div className="text-4xl text-sage-500 mb-2 animate-pulse">"</div>
                  <p className="text-slate-700 font-medium italic text-lg leading-relaxed">{member.quote}</p>
                  <div className="text-right text-sage-600 mt-2">- {member.name}</div>
                </div>

                {/* Bio */}
                <p className="text-slate-600 leading-relaxed mb-6">{member.bio}</p>

                {/* Fun Fact */}
                <div className="bg-beige-100 rounded-lg p-4 mb-6 hover:bg-beige-200 transition-all duration-300 hover:scale-[1.02]">
                  <h4 className="font-semibold text-beige-800 mb-2">🎯 Fun Fact</h4>
                  <p className="text-beige-700">{member.funFact}</p>
                </div>

                {/* Social Links */}
                <div className="flex justify-center space-x-4">
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-sage-500 hover:bg-sage-600 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-12 hover:shadow-lg"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-lavender-500 hover:bg-lavender-600 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-12 hover:shadow-lg"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  
                </div>
              </div>

              {/* Achievements Grid */}
              <div className="bg-white/60 backdrop-blur-sm border border-sage-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02]">
                <h3 className="text-xl font-poppins font-semibold text-slate-800 mb-4">🏆 Key Achievements</h3>
                <div className="grid grid-cols-2 gap-3">
                  {member.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-sage-100 to-lavender-100 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium text-center hover:scale-105 hover:from-sage-200 hover:to-lavender-200 transition-all duration-300 cursor-pointer"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {achievement}
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white/60 backdrop-blur-sm border border-sage-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02]">
                <h3 className="text-xl font-poppins font-semibold text-slate-800 mb-4">💻 Technical Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-sky-200 hover:scale-110 transition-all duration-300 cursor-pointer"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Popular Courses */}
              <div className="bg-white/60 backdrop-blur-sm border border-sage-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02]">
                <h3 className="text-xl font-poppins font-semibold text-slate-800 mb-4">📚 Popular Courses</h3>
                <div className="space-y-3">
                  {member.courses.map((course, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 hover:bg-sage-50 rounded-lg transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-md"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="w-3 h-3 bg-gradient-to-r from-sage-400 to-lavender-400 rounded-full animate-pulse"></div>
                      <span className="text-slate-700 font-medium">{course}</span>
                      <div className="ml-auto">
                        <span className="text-xs bg-beige-100 text-beige-700 px-2 py-1 rounded-full hover:bg-beige-200 transition-colors duration-200">
                          5 min
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20 animate-fade-in" style={{ animationDelay: "0.8s" }}>
          <div className="bg-gradient-to-br from-sage-100 via-lavender-100 to-sky-100 rounded-2xl p-12 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02]">
            <h2 className="text-4xl font-poppins font-bold text-slate-800 mb-4">Ready to Learn with Us?</h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Join thousands of learners who are already mastering new skills with our expert-led 5-minute courses.
              Start your journey today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => (window.location.href = "/courses")}
                className="bg-gradient-to-r from-sage-500 to-lavender-500 hover:from-sage-600 hover:to-lavender-600 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Explore Courses
              </button>
              <button
                onClick={() => (window.location.href = "/auth")}
                className="bg-white/60 backdrop-blur-sm border-2 border-sage-300 hover:bg-white/80 hover:border-sage-400 text-sage-700 font-semibold py-4 px-8 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Sign Up Free
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
