"use client"

import { useCredits } from "@/hooks/useCredits"
import { useAuth } from "@/hooks/useAuth"
import { useProgress } from "@/hooks/useProgress"

const achievements = [
  {
    id: "first_5_xp",
    title: "First Steps",
    icon: "🎯",
    description: "Earn your first 5 XP",
    xpRequired: 5,
    unlocked: true,
  },
  {
    id: "3_day_streak",
    title: "Streak Master",
    icon: "🔥",
    description: "Learn for 3 consecutive days",
    streakRequired: 3,
    unlocked: true,
  },
  {
    id: "skill_explorer",
    title: "Skill Explorer",
    icon: "🗺️",
    description: "Complete 5 different courses",
    coursesRequired: 5,
    unlocked: false,
  },
  {
    id: "speed_learner",
    title: "Speed Learner",
    icon: "⚡",
    description: "Complete 3 courses in one day",
    dailyCoursesRequired: 3,
    unlocked: false,
  },
  {
    id: "master_student",
    title: "Master Student",
    icon: "🎓",
    description: "Earn 1000 XP",
    xpRequired: 1000,
    unlocked: false,
  },
  {
    id: "social_learner",
    title: "Social Learner",
    icon: "👥",
    description: "Share 3 completed courses",
    sharesRequired: 3,
    unlocked: true,
  },
]

const rewards = [
  { id: 1, title: "Custom Avatar", cost: 100, icon: "👤", owned: false },
  { id: 2, title: "Premium Theme", cost: 250, icon: "🎨", owned: true },
  { id: 3, title: "Certificate Badge", cost: 500, icon: "🏆", owned: false },
  { id: 4, title: "Exclusive Course", cost: 750, icon: "📚", owned: false },
]

const levels = [
  { level: 1, title: "Curious Cat", xpRequired: 0, color: "from-sage-400 to-sky-400" },
  { level: 2, title: "Skill Explorer", xpRequired: 100, color: "from-sky-400 to-lavender-400" },
  { level: 3, title: "Knowledge Seeker", xpRequired: 500, color: "from-lavender-400 to-beige-400" },
  { level: 4, title: "Learning Master", xpRequired: 1000, color: "from-beige-400 to-sage-400" },
  { level: 5, title: "Skill Samurai", xpRequired: 2000, color: "from-sage-500 to-lavender-500" },
]

export default function Gamify() {
  const { user } = useAuth()
  const { credits } = useCredits()
  const { progress } = useProgress()

  // Demo data for better showcase
  const currentXP = credits?.total_xp || 185
  const currentLevel = credits?.current_level || 2
  const streak = credits?.streak_days || 5
  const completedCourses = progress.filter((course) => course.status === "completed").length || 2

  if (!user) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center animate-slide-in-bottom">
        <div className="text-center">
          <h1 className="text-3xl font-poppins font-bold text-slate-800 mb-4">Please Sign In</h1>
          <p className="text-slate-600 mb-6">You need to be logged in to view your gamification progress.</p>
          <button className="bg-gradient-to-r from-sage-500 to-lavender-500 hover:from-sage-600 hover:to-lavender-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 hover:scale-105">
            Sign In
          </button>
        </div>
      </div>
    )
  }

  const currentLevelData = levels[currentLevel - 1]
  const nextLevelData = levels[currentLevel] || levels[levels.length - 1]
  const progressToNext =
    currentLevel < 5
      ? ((currentXP - currentLevelData.xpRequired) / (nextLevelData.xpRequired - currentLevelData.xpRequired)) * 100
      : 100

  return (
    <div className="min-h-screen py-8 px-4 animate-fade-in-scale">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-in-bottom">
          <h1 className="text-5xl font-poppins font-bold text-slate-800 mb-4">🎮 Gamify Your Learning</h1>
          <p className="text-xl text-slate-600">Level up, earn rewards, and track your achievements</p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 stagger-animation">
          {/* XP Progress */}
          <div className="bg-white/60 backdrop-blur-sm border border-sage-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-slate-800 mb-1">{currentXP} XP</div>
              <div className="text-slate-600">Total Experience</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2 overflow-hidden">
              <div
                className={`h-4 rounded-full bg-gradient-to-r ${currentLevelData.color} transition-all duration-1000`}
                style={{ width: `${Math.min(progressToNext, 100)}%` }}
              ></div>
            </div>
            <div className="text-center text-sm text-slate-600">
              Level {currentLevel}: {currentLevelData.title}
            </div>
            <div className="text-center text-xs text-slate-500 mt-1">
              {currentLevel < 5 ? `${nextLevelData.xpRequired - currentXP} XP to next level` : "Max level reached!"}
            </div>
          </div>

          {/* Streak */}
          <div className="bg-white/60 backdrop-blur-sm border border-sage-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="text-center">
              <div className="text-4xl mb-2 animate-bounce">🔥</div>
              <div className="text-3xl font-bold text-orange-600 mb-1">{streak}</div>
              <div className="text-slate-600">Day Streak</div>
              <div className="mt-2 text-sm text-orange-600 font-medium">
                {streak >= 7 ? "🏆 Week Warrior!" : streak >= 3 ? "🔥 On Fire!" : "Keep it up!"}
              </div>
            </div>
          </div>

          {/* Course Completion */}
          <div className="bg-white/60 backdrop-blur-sm border border-sage-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="text-center">
              <div className="text-4xl mb-2">📚</div>
              <div className="text-3xl font-bold text-sage-600 mb-1">{completedCourses}</div>
              <div className="text-slate-600">Courses Completed</div>
              <div className="mt-2 text-sm text-sage-600 font-medium">
                {completedCourses >= 5 ? "🎓 Scholar!" : completedCourses >= 2 ? "📖 Learner!" : "🌱 Beginner!"}
              </div>
            </div>
          </div>
        </div>

        {/* Level System */}
        <div className="mb-12 animate-slide-in-left">
          <h2 className="text-3xl font-poppins font-bold text-slate-800 mb-8 text-center">🏆 XP Level System</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {levels.map((level, index) => (
              <div
                key={level.level}
                className={`p-4 rounded-2xl text-center transition-all duration-300 hover:scale-105 animate-fade-in ${
                  level.level <= currentLevel
                    ? `bg-gradient-to-br ${level.color} text-white shadow-lg`
                    : "bg-gray-100 text-gray-500"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-2xl font-bold mb-2">Level {level.level}</div>
                <div className="text-sm font-medium mb-1">{level.title}</div>
                <div className="text-xs">{level.xpRequired} XP</div>
                {level.level === currentLevel && (
                  <div className="mt-2 text-xs bg-white/20 rounded-full px-2 py-1">Current</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-12 animate-slide-in-right">
          <h2 className="text-3xl font-poppins font-bold text-slate-800 mb-8 text-center">🏅 Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <div
                key={achievement.id}
                className={`p-6 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in ${
                  achievement.unlocked
                    ? "bg-gradient-to-br from-sage-100 to-lavender-100 border-2 border-sage-300"
                    : "bg-gray-100 border-2 border-gray-200"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
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
                      ✅ Unlocked
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rewards Store */}
        <div className="animate-fade-in-scale" style={{ animationDelay: "0.3s" }}>
          <h2 className="text-3xl font-poppins font-bold text-slate-800 mb-8 text-center">🛍️ Rewards Store</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rewards.map((reward, index) => {
              const canAfford = currentXP >= reward.cost

              return (
                <div
                  key={reward.id}
                  className={`p-6 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 animate-slide-in-bottom ${
                    reward.owned
                      ? "bg-gradient-to-br from-lavender-100 to-sage-100 border-2 border-lavender-300"
                      : canAfford
                        ? "bg-white/60 backdrop-blur-sm border-2 border-sage-200 hover:border-sage-300"
                        : "bg-gray-100 border-2 border-gray-200"
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-center">
                    <div className={`text-4xl mb-3 ${reward.owned || canAfford ? "" : "grayscale"}`}>{reward.icon}</div>
                    <h3
                      className={`text-lg font-poppins font-semibold mb-2 ${
                        reward.owned || canAfford ? "text-slate-800" : "text-gray-500"
                      }`}
                    >
                      {reward.title}
                    </h3>
                    <div className={`text-sm mb-3 ${reward.owned || canAfford ? "text-slate-600" : "text-gray-400"}`}>
                      {reward.cost} XP
                    </div>
                    <button
                      disabled={reward.owned || !canAfford}
                      className={`w-full py-2 px-4 rounded-full font-medium transition-all duration-300 ${
                        reward.owned
                          ? "bg-sage-200 text-sage-800 cursor-default"
                          : canAfford
                            ? "bg-gradient-to-r from-sage-500 to-lavender-500 hover:from-sage-600 hover:to-lavender-600 text-white hover:scale-105"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {reward.owned ? "✅ Owned" : canAfford ? "Unlock" : "Locked"}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
