"use client"

import { useEffect, useState } from "react"

export default function Loader() {
  const [fadeOut, setFadeOut] = useState(false)
  const [text, setText] = useState("")
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
      }
    }, 80)

    // Fade out timer
    const fadeTimer = setTimeout(() => {
      setFadeOut(true)
    }, 3000)

    return () => {
      clearInterval(typeTimer)
      clearTimeout(fadeTimer)
    }
  }, [])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-sage-100 via-sky-100 to-lavender-100 transition-opacity duration-1000 ${fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      {/* Ripple Water Effect Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sage-200/30 rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-sky-200/30 rounded-full animate-ping delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-lavender-200/30 rounded-full animate-ping delay-2000"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-beige-200/30 rounded-full animate-ping delay-500"></div>
      </div>

      {/* Animated Waves */}
      <div className="absolute inset-0">
        <svg className="w-full h-full" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,400 C300,300 600,500 1200,400 L1200,800 L0,800 Z" fill="url(#wave1)" className="animate-pulse" />
          <path
            d="M0,500 C300,400 600,600 1200,500 L1200,800 L0,800 Z"
            fill="url(#wave2)"
            className="animate-pulse delay-1000"
          />
          <defs>
            <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(167, 243, 208)" stopOpacity="0.1" />
              <stop offset="100%" stopColor="rgb(196, 181, 253)" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(125, 211, 252)" stopOpacity="0.1" />
              <stop offset="100%" stopColor="rgb(245, 245, 220)" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-sage-400 to-sky-400 rounded-full animate-spin"></div>
            <div className="absolute inset-2 bg-gradient-to-br from-sage-50 via-sky-50 to-lavender-50 rounded-full"></div>
            <div className="absolute inset-4 bg-gradient-to-r from-lavender-400 to-sage-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-poppins font-semibold text-slate-700 mb-4 min-h-[3rem]">
          {text}
          <span className="animate-pulse text-sage-500">|</span>
        </h1>

        <div className="flex justify-center space-x-2 mt-8">
          <div className="w-3 h-3 bg-sage-400 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-sky-400 rounded-full animate-bounce delay-100"></div>
          <div className="w-3 h-3 bg-lavender-400 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  )
}
