"use client"

import { useState } from "react"

const skills = [
  "Git in 5 minutes",
  "Canva Crash Course",
  "Figma Fundamentals",
  "AI Prompt Engineering",
  "React Basics",
  "CSS Animations",
  "TypeScript Intro",
  "Node.js Essentials",
]

export default function SkillDiscoveryWheel() {
  const [spinning, setSpinning] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState("")

  const spinWheel = () => {
    if (spinning) return

    setSpinning(true)
    setSelectedSkill("")

    setTimeout(() => {
      const randomSkill = skills[Math.floor(Math.random() * skills.length)]
      setSelectedSkill(randomSkill)
      setSpinning(false)
    }, 2000)
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-poppins font-bold text-slate-800 mb-4">Skill Discovery Wheel</h2>
        <p className="text-xl text-slate-600 mb-12">Not sure what to learn? Let the wheel decide your next skill!</p>

        <div className="relative">
          {/* Wheel */}
          <div
            className={`w-80 h-80 mx-auto relative rounded-full bg-gradient-to-br from-sage-200 via-sky-200 to-lavender-200 border-8 border-white shadow-2xl ${
              spinning ? "animate-spin" : ""
            }`}
            style={{ animationDuration: spinning ? "2s" : "0s" }}
          >
            {skills.map((skill, index) => (
              <div
                key={index}
                className="absolute w-full h-full flex items-center justify-center text-sm font-medium text-slate-700"
                style={{
                  transform: `rotate(${(index * 360) / skills.length}deg)`,
                  transformOrigin: "center",
                }}
              >
                <div
                  className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1 shadow-md"
                  style={{
                    transform: `rotate(-${(index * 360) / skills.length}deg)`,
                  }}
                >
                  {skill.split(" ").slice(0, 2).join(" ")}
                </div>
              </div>
            ))}

            {/* Center Button */}
            <button
              onClick={spinWheel}
              disabled={spinning}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-r from-sage-500 to-sky-500 hover:from-sage-600 hover:to-sky-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:scale-100"
            >
              {spinning ? "..." : "SPIN"}
            </button>
          </div>

          {/* Pointer */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
            <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-sage-600"></div>
          </div>
        </div>

        {selectedSkill && (
          <div className="mt-8 p-6 bg-white/60 backdrop-blur-sm border border-sage-200/50 rounded-2xl shadow-lg animate-fade-in">
            <h3 className="text-2xl font-poppins font-semibold text-slate-800 mb-2">🎯 Your Next Skill:</h3>
            <p className="text-xl text-sage-600 font-medium">{selectedSkill}</p>
            <button className="mt-4 bg-gradient-to-r from-sage-500 to-sky-500 hover:from-sage-600 hover:to-sky-600 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 hover:scale-105">
              Start Learning Now
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
