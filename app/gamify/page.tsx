"use client"

import { useState } from "react"

const achievements = [
  { id: 1, title: "First 5 XP", icon: "🎯", unlocked: true, description: "Complete your first lesson" },
  { id: 2, title: "3-Day Streak", icon: "🔥", unlocked: true, description: "Learn for 3 consecutive days" },
  { id: 3, title: "Skill Explorer", icon: "🗺️", unlocked: false, description: "Try 5 different skill categories" },
  { id: 4, title: "Speed Learner", icon: "⚡", unlocked: false, description: "Complete 10 lessons in one day" },
  { id: 5, title: "Master Student", icon: "🎓", unlocked: false, description: "Earn 1000 XP" },
  { id: 6, title: "Social Learner", icon: "👥", unlocked: false, description: "Share 3 completed courses" },
]

const rewards = [
  { id: 1, title: "Custom Avatar", cost: 100, unlocked: true, icon: "👤" },
  { id: 2, title: "Premium Theme", cost: 250, unlocked: false, icon: "🎨" },
  { id: 3, title: "Certificate Badge", cost: 500, unlocked: false, icon: "🏆" },
  { id: 4, title: "Exclusive Course", cost: 750, unlocked: false, icon: "📚" },
]

const levels = [
  { level: 1, title: "Curious Cat", xpRequired: 0, color: "from-sage-400 to-sky-400" },
  { level: 2, title: "Skill Explorer", xpRequired: 100, color: "from-sky-400 to-lavender-400" },
  { level: 3, title: "Knowledge Seeker", xpRequired: 300, color: "from-lavender-400 to-sage-400" },
  { level: 4, title: "Learning Master", xpRequired: 600, color: "from-sage-500 to-sky-500" },
  { level: 5, title: "Skill Samurai", xpRequired: 1000, color: "from-sky-500 to-lavender-500" },
]

export default function Gamify() {
  const [currentXP] = useState(180)
  const [currentLevel] = useState(2)
  const [streak] = useState(5)

  const currentLevelData = levels[currentLevel - 1]
  const nextLevelData = levels[currentLevel] || levels[levels.length - 1]
  const progressToNext =
    ((currentXP - currentLevelData.xpRequired) / (nextLevelData.xpRequired - currentLevelData.xpRequired)) * 100

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-poppins font-bold text-slate-800 mb-4">Gamify Your Learning</h1>
          <p className="text-xl text-slate-600">Level up, earn rewards, and track your achievements</p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* XP Progress */}
          <div className="bg-white/60 backdrop-blur-sm border border-sage-200/50 rounded-2xl p-6 shadow-lg">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-slate-800 mb-1">{currentXP} XP</div>
              <div className="text-slate-600">Total Experience</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div
                className={`h-4 rounded-full bg-gradient-to-r ${currentLevelData.color} transition-all duration-500`}
                style={{ width: `${Math.min(progressToNext, 100)}%` }}
              ></div>
            </div>
            <div className="text-center text-sm text-slate-600">
              Level {currentLevel}: {currentLevelData.title}
            </div>
          </div>

          {/* Streak */}
          <div className="bg-white/60 backdrop-blur-sm border border-sage-200/50 rounded-2xl p-6 shadow-lg">
            <div className="text-center">
              <div className="text-4xl mb-2">🔥</div>
              <div className="text-3xl font-bold text-orange-600 mb-1">{streak}</div>
              <div className="text-slate-600">Day Streak</div>
            </div>
          </div>

          {/* Course Completion */}
          <div className="bg-white/60 backdrop-blur-sm border border-sage-200/50 rounded-2xl p-6 shadow-lg">
            <div className="text-center">
              <div className="text-4xl mb-2">📚</div>
              <div className="text-3xl font-bold text-sage-600 mb-1">12</div>
              <div className="text-slate-600">Courses Completed</div>
            </div>
          </div>
        </div>

        {/* Level System */}
        <div className="mb-12">
          <h2 className="text-3xl font-poppins font-bold text-slate-800 mb-8 text-center">XP Level System</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {levels.map((level) => (
              <div
                key={level.level}
                className={`p-4 rounded-2xl text-center transition-all duration-300 hover:scale-105 ${
                  level.level <= currentLevel
                    ? `bg-gradient-to-br ${level.color} text-white shadow-lg`
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <div className="text-2xl font-bold mb-2">Level {level.level}</div>
                <div className="text-sm font-medium mb-1">{level.title}</div>
                <div className="text-xs">{level.xpRequired} XP</div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-12">
          <h2 className="text-3xl font-poppins font-bold text-slate-800 mb-8 text-center">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-6 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 ${
                  achievement.unlocked
                    ? "bg-gradient-to-br from-sage-100 to-sky-100 border-2 border-sage-300"
                    : "bg-gray-100 border-2 border-gray-200"
                }`}
              >
                <div className="text-center">
                  <div className={`text-4xl mb-3 ${achievement.unlocked ? "" : "grayscale"}`}>{achievement.icon}</div>
                  <h3
                    className={`text-lg font-poppins font-semibold mb-2 ${
                      achievement.unlocked ? "text-slate-800" : "text-gray-500"
                    }`}
                  >
                    {achievement.title}
                  </h3>
                  <p className={`text-sm ${achievement.unlocked ? "text-slate-600" : "text-gray-400"}`}>
                    {achievement.description}
                  </p>
                  {achievement.unlocked && (
                    <div className="mt-3 px-3 py-1 bg-sage-200 text-sage-800 rounded-full text-xs font-medium">
                      Unlocked
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rewards Grid */}
        <div>
          <h2 className="text-3xl font-poppins font-bold text-slate-800 mb-8 text-center">Rewards Store</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className={`p-6 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 ${
                  reward.unlocked
                    ? "bg-gradient-to-br from-lavender-100 to-sage-100 border-2 border-lavender-300"
                    : currentXP >= reward.cost
                      ? "bg-white/60 backdrop-blur-sm border-2 border-sage-200 hover:border-sage-300"
                      : "bg-gray-100 border-2 border-gray-200"
                }`}
              >
                <div className="text-center">
                  <div className={`text-4xl mb-3 ${reward.unlocked || currentXP >= reward.cost ? "" : "grayscale"}`}>
                    {reward.icon}
                  </div>
                  <h3
                    className={`text-lg font-poppins font-semibold mb-2 ${
                      reward.unlocked || currentXP >= reward.cost ? "text-slate-800" : "text-gray-500"
                    }`}
                  >
                    {reward.title}
                  </h3>
                  <div
                    className={`text-sm mb-3 ${
                      reward.unlocked || currentXP >= reward.cost ? "text-slate-600" : "text-gray-400"
                    }`}
                  >
                    {reward.cost} XP
                  </div>
                  <button
                    disabled={reward.unlocked || currentXP < reward.cost}
                    className={`w-full py-2 px-4 rounded-full font-medium transition-all duration-300 ${
                      reward.unlocked
                        ? "bg-sage-200 text-sage-800 cursor-default"
                        : currentXP >= reward.cost
                          ? "bg-gradient-to-r from-sage-500 to-sky-500 hover:from-sage-600 hover:to-sky-600 text-white hover:scale-105"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {reward.unlocked ? "Owned" : currentXP >= reward.cost ? "Unlock" : "Locked"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
