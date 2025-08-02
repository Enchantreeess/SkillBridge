"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const pageTransitions = {
  "/": "animate-fade-in-scale",
  "/courses": "animate-slide-in-right",
  "/my-learning": "animate-slide-in-left",
  "/gamify": "animate-fade-in-scale",
  "/team": "animate-slide-in-bottom",
  "/contact": "animate-slide-in-right",
  "/auth": "animate-fade-in-scale",
}

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [animationClass, setAnimationClass] = useState("")

  useEffect(() => {
    setIsLoading(true)
    const transition = pageTransitions[pathname as keyof typeof pageTransitions] || "animate-fade-in"
    setAnimationClass(transition)

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 150)

    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <div
      className={`transition-all duration-300 ${isLoading ? "opacity-0 translate-y-4" : `opacity-100 translate-y-0 ${animationClass}`}`}
    >
      {children}
    </div>
  )
}
