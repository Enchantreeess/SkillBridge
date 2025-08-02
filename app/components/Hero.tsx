"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Hero() {
  const [isHovered, setIsHovered] = useState(false)
  const router = useRouter()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        {/* Logo/Brand */}
        <div className="mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-2xl">
            <span className="text-3xl font-bold text-white">SB</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            SkillBridge
          </h1>
        </div>

        {/* Main Headline */}
        <div className="mb-8 animate-slide-in-bottom">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Bridge the gap between
            <span className="block bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
              curiosity and mastery
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Master any skill in just 5 minutes with our revolutionary microlearning platform
          </p>
        </div>

        {/* CTA Button */}
        <div className="animate-fade-in-scale">
          <button
            onClick={() => router.push("/courses")}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative inline-flex items-center justify-center px-12 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 transform"
          >
            <span className="relative z-10">Start Learning</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">→</div>
          </button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-in-bottom">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">50+</div>
            <div className="text-gray-400">Micro Courses</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">5 min</div>
            <div className="text-gray-400">Average Duration</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">10k+</div>
            <div className="text-gray-400">Skills Mastered</div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400 rounded-full animate-ping"></div>
      <div className="absolute bottom-20 right-10 w-6 h-6 bg-purple-400 rounded-full animate-pulse"></div>
      <div className="absolute top-1/2 right-20 w-3 h-3 bg-pink-400 rounded-full animate-bounce"></div>
    </section>
  )
}
