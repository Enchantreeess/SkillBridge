"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Loader from "./Loader"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Show loader for 5 seconds to display the full animation
    const timer = setTimeout(() => {
      setLoading(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <Loader />
  }

  return <>{children}</>
}
