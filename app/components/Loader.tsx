"use client"

import { useEffect, useState } from "react"

export default function Loader() {
  const [fadeOut, setFadeOut] = useState(false)
  const [text, setText] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  const fullText = "Bridge the gap between curiosity and mastery"

  useEffect(() => {
    // Typewriter effect
    let index = 0
    const typeTimer = setInterval(() => {
      if (index < fullText.length) {
        setText(fullText.slice(0, index + 1))
        index++
      } else {
        clearInterval(typeTimer)
        // Hide cursor after typing is complete
        setTimeout(() => setShowCursor(false), 500)
      }
    }, 80)

    // Cursor blinking effect
    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)

    // Start fade out after 4.5 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true)
    }, 4500)

    return () => {
      clearInterval(typeTimer)
      clearInterval(cursorTimer)
      clearTimeout(fadeTimer)
    }
  }, [])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-sage-50 via-lavender-50 to-sky-50 transition-all duration-1000 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Geometric Shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-sage-200/30 to-sage-400/30 rounded-full blur-xl animate-float"></div>
        <div
          className="absolute bottom-32 right-32 w-40 h-40 bg-gradient-to-br from-lavender-200/30 to-lavender-400/30 rounded-full blur-xl animate-float"
          style={{ animationDelay: "1s", animationDirection: "reverse" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/4 w-24 h-24 bg-gradient-to-br from-sky-200/30 to-sky-400/30 rounded-full blur-xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-36 h-36 bg-gradient-to-br from-beige-200/30 to-beige-400/30 rounded-full blur-xl animate-float"
          style={{ animationDelay: "0.5s", animationDirection: "reverse" }}
        ></div>

        {/* Animated Lines */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-sage-300/50 to-transparent animate-pulse"></div>
        <div
          className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-lavender-300/50 to-transparent animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Multiple Ripple Effects */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-96 h-96 border-2 rounded-full animate-ripple-wave"
            style={{
              borderColor: i % 3 === 0 ? "#7bb87b" : i % 3 === 1 ? "#9c6bff" : "#38bdf8",
              animationDelay: `${i * 0.8}s`,
              opacity: 0.3 - i * 0.05,
            }}
          ></div>
        ))}
      </div>

      {/* Central Loading Animation */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        {/* Logo Animation */}
        <div className="mb-12 relative">
          <div className="w-32 h-32 mx-auto relative">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 border-4 border-transparent border-t-sage-400 border-r-lavender-400 rounded-full animate-spin"></div>

            {/* Middle pulsing ring */}
            <div className="absolute inset-3 border-3 border-transparent border-b-sky-400 border-l-beige-400 rounded-full animate-spin-reverse"></div>

            {/* Inner core */}
            <div className="absolute inset-6 bg-gradient-to-br from-sage-400 via-lavender-400 to-sky-400 rounded-full animate-pulse flex items-center justify-center">
              <div className="text-white font-bold text-2xl">SB</div>
            </div>

            {/* Orbiting dots */}
            <div className="absolute inset-0 animate-spin-slow">
              <div className="absolute -top-2 left-1/2 w-4 h-4 bg-sage-500 rounded-full transform -translate-x-1/2 animate-bounce"></div>
              <div className="absolute top-1/2 -right-2 w-3 h-3 bg-lavender-500 rounded-full transform -translate-y-1/2 animate-bounce delay-300"></div>
              <div className="absolute -bottom-2 left-1/2 w-4 h-4 bg-sky-500 rounded-full transform -translate-x-1/2 animate-bounce delay-700"></div>
              <div className="absolute top-1/2 -left-2 w-3 h-3 bg-beige-500 rounded-full transform -translate-y-1/2 animate-bounce delay-1000"></div>
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-poppins font-bold mb-4">
            <span className="bg-gradient-to-r from-sage-600 via-lavender-600 to-sky-600 bg-clip-text text-transparent animate-gradient-x">
              SkillBridge
            </span>
          </h1>
        </div>

        {/* Typewriter Text */}
        <div className="mb-12 h-20 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl md:text-3xl font-poppins font-medium text-slate-700 leading-relaxed">
              {text}
              <span
                className={`inline-block w-1 h-8 ml-1 bg-sage-500 transition-opacity duration-150 ${
                  showCursor ? "opacity-100" : "opacity-0"
                }`}
              ></span>
            </p>
          </div>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full animate-bounce"
              style={{
                backgroundColor: i === 0 ? "#7bb87b" : i === 1 ? "#9c6bff" : i === 2 ? "#38bdf8" : "#f4b95c",
                animationDelay: `${i * 0.2}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-8 w-64 mx-auto">
          <div className="w-full bg-white/30 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-sage-400 via-lavender-400 to-sky-400 rounded-full animate-loading-bar"></div>
          </div>
        </div>

        {/* Subtitle */}
        <div className="mt-6">
          <p className="text-slate-500 font-medium animate-pulse">Preparing your learning experience...</p>
        </div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-4 border-t-4 border-sage-300 rounded-tl-2xl animate-pulse"></div>
      <div className="absolute top-8 right-8 w-16 h-16 border-r-4 border-t-4 border-lavender-300 rounded-tr-2xl animate-pulse delay-500"></div>
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-4 border-b-4 border-sky-300 rounded-bl-2xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-4 border-b-4 border-beige-300 rounded-br-2xl animate-pulse delay-1500"></div>
    </div>
  )
}
