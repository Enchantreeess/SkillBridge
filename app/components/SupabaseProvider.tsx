"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { isSupabaseConfigured } from "@/lib/supabase"

interface SupabaseContextType {
  isConfigured: boolean
  error: string | null
}

const SupabaseContext = createContext<SupabaseContextType>({
  isConfigured: false,
  error: null,
})

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [isConfigured, setIsConfigured] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if Supabase environment variables are configured
    try {
      const configured = isSupabaseConfigured()
      setIsConfigured(configured)

      if (!configured) {
        setError("Supabase environment variables are not configured. Please check your .env.local file.")
      } else {
        setError(null)
      }
    } catch (err) {
      setError("Error checking Supabase configuration")
      setIsConfigured(false)
    }
  }, [])

  return <SupabaseContext.Provider value={{ isConfigured, error }}>{children}</SupabaseContext.Provider>
}

export const useSupabaseConfig = () => useContext(SupabaseContext)
