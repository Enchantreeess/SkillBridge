"use client"

import { useState, useEffect } from "react"

export default function Hero() {
  const [typewriterText, setTypewriterText] = useState("")
  const [rippleEffect, setRippleEffect] = useState(false)
  const fullText = "Learn Git, Figma, Prompt Engineering, and more in 5 minutes."

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setTypewriterText(fullText.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
      }
    }, 80)

    return () => clearInterval(timer)
  }, [])

  const handleStartLearning = () => {
    setRippleEffect(true)
    setTimeout(() => setRippleEffect(false), 600)

    const marqueeSection = document.getElementById("marquee")
    if (marqueeSection) {
      marqueeSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-sage-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-sky-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-lavender-200/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* 3D Animated Cubes */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-96 h-96">
          {/* Cube 1 */}
          <div
            className="absolute top-10 left-10 w-16 h-16 bg-gradient-to-br from-sage-300/30 to-sage-400/30 backdrop-blur-sm border border-sage-300/50 rounded-lg transform rotate-12 animate-spin shadow-lg"
            style={{ animationDuration: "8s" }}
          ></div>
          {/* Cube 2 */}
          <div
            className="absolute top-20 right-10 w-12 h-12 bg-gradient-to-br from-sky-300/30 to-sky-400/30 backdrop-blur-sm border border-sky-300/50 rounded-lg transform -rotate-12 animate-spin shadow-lg"
            style={{ animationDuration: "12s", animationDirection: "reverse" }}
          ></div>
          {/* Cube 3 */}
          <div
            className="absolute bottom-20 left-20 w-20 h-20 bg-gradient-to-br from-lavender-300/30 to-lavender-400/30 backdrop-blur-sm border border-lavender-300/50 rounded-lg transform rotate-45 animate-spin shadow-lg"
            style={{ animationDuration: "10s" }}
          ></div>
          {/* Cube 4 */}
          <div
            className="absolute bottom-10 right-20 w-14 h-14 bg-gradient-to-br from-beige-300/30 to-beige-400/30 backdrop-blur-sm border border-beige-300/50 rounded-lg transform -rotate-45 animate-spin shadow-lg"
            style={{ animationDuration: "15s", animationDirection: "reverse" }}
          ></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-poppins font-bold mb-6 text-slate-800">
          <span className="bg-gradient-to-r from-sage-600 via-sky-600 to-lavender-600 bg-clip-text text-transparent">
            Microlearning.
          </span>
          <br />
          <span className="bg-gradient-to-r from-lavender-600 via-sky-600 to-sage-600 bg-clip-text text-transparent">
            Supercharged.
          </span>
        </h1>

        <div className="mb-8 h-16 flex items-center justify-center">
          <p className="text-xl md:text-2xl text-slate-600 font-inter">
            {typewriterText}
            <span className="animate-pulse text-sage-500">|</span>
          </p>
        </div>

        <button
          onClick={handleStartLearning}
          className={`relative overflow-hidden bg-gradient-to-r from-sage-500 to-sky-500 hover:from-sage-600 hover:to-sky-600 text-white font-poppins font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-sage-200/50 ${
            rippleEffect ? "animate-pulse" : ""
          }`}
        >
          <span className="relative z-10">Start Learning</span>
          {rippleEffect && <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>}
        </button>

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-4 h-4 bg-sage-400 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute top-20 right-20 w-3 h-3 bg-sky-400 rounded-full animate-bounce delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-5 h-5 bg-lavender-400 rounded-full animate-bounce delay-500"></div>
      </div>
    </section>
  )
}
