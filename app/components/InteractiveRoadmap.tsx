"use client"

import { useState } from "react"

const milestones = [
  {
    id: 1,
    title: "🎯 Registered",
    description: "Welcome to SkillBridge!",
    completed: true,
    xp: 10,
  },
  {
    id: 2,
    title: "🧠 First Skill Completed",
    description: "You've mastered your first 5-minute lesson",
    completed: true,
    xp: 50,
  },
  {
    id: 3,
    title: "🚀 Skill Streak Started",
    description: "3 days of consistent learning",
    completed: false,
    xp: 100,
  },
  {
    id: 4,
    title: "🏆 Level Up",
    description: "Reached Level 2: Skill Explorer",
    completed: false,
    xp: 200,
  },
  {
    id: 5,
    title: "🌟 Master Learner",
    description: "Completed 10 different skills",
    completed: false,
    xp: 500,
  },
]

export default function InteractiveRoadmap() {
  const [hoveredMilestone, setHoveredMilestone] = useState<number | null>(null)

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-sage-50 to-sky-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-poppins font-bold text-slate-800 mb-4">Your Learning Journey</h2>
          <p className="text-xl text-slate-600">Track your progress and unlock new achievements</p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-sage-300 to-sky-300 rounded-full"></div>

          {/* Milestones */}
          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.id}
                className={`relative flex items-center ${index % 2 === 0 ? "justify-start" : "justify-end"}`}
                onMouseEnter={() => setHoveredMilestone(milestone.id)}
                onMouseLeave={() => setHoveredMilestone(null)}
              >
                {/* Milestone Card */}
                <div
                  className={`w-80 p-6 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                    milestone.completed
                      ? "bg-gradient-to-br from-sage-100 to-sky-100 border-2 border-sage-300"
                      : "bg-white/60 backdrop-blur-sm border-2 border-gray-200"
                  } ${index % 2 === 0 ? "mr-8" : "ml-8"}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-poppins font-semibold text-slate-800">{milestone.title}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        milestone.completed ? "bg-sage-200 text-sage-800" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {milestone.xp} XP
                    </span>
                  </div>
                  <p className="text-slate-600">{milestone.description}</p>

                  {hoveredMilestone === milestone.id && (
                    <div className="mt-4 p-3 bg-white/80 rounded-lg border border-sage-200 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Progress</span>
                        <span className="text-sm font-medium text-sage-600">
                          {milestone.completed ? "Completed" : "In Progress"}
                        </span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            milestone.completed
                              ? "w-full bg-gradient-to-r from-sage-400 to-sky-400"
                              : "w-1/3 bg-gray-400"
                          }`}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Timeline Node */}
                <div
                  className={`absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full border-4 border-white shadow-lg transition-all duration-300 ${
                    milestone.completed ? "bg-gradient-to-r from-sage-400 to-sky-400" : "bg-gray-300"
                  } ${hoveredMilestone === milestone.id ? "scale-125" : ""}`}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
