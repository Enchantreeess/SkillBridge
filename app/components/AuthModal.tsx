"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: "signin" | "signup"
}

const SAMPLE_CREDENTIALS = {
  email: "demo@skillbridge.com",
  password: "demo123456",
  name: "Demo User",
}

export default function AuthModal({ isOpen, onClose, defaultMode = "signin" }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">(defaultMode)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { signIn, signUp } = useAuth()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (mode === "signup") {
        const { error } = await signUp(formData.email, formData.password, formData.name)
        if (error) {
          // If user already exists, try to sign them in instead
          if (error.message.includes("already registered") || error.message.includes("already exists")) {
            const { error: signInError } = await signIn(formData.email, formData.password)
            if (signInError) throw signInError
            onClose()
          } else {
            throw error
          }
        } else {
          // Account created successfully, now sign them in
          const { error: signInError } = await signIn(formData.email, formData.password)
          if (signInError) throw signInError
          onClose()
        }
      } else {
        const { error } = await signIn(formData.email, formData.password)
        if (error) {
          // If user doesn't exist, create account and sign them in
          if (error.message.includes("Invalid login credentials") || error.message.includes("not found")) {
            const { error: signUpError } = await signUp(formData.email, formData.password, formData.name || "User")
            if (signUpError) throw signUpError

            // Now sign them in
            const { error: signInError } = await signIn(formData.email, formData.password)
            if (signInError) throw signInError
            onClose()
          } else {
            throw error
          }
        } else {
          onClose()
        }
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const useSampleCredentials = () => {
    setFormData({
      name: SAMPLE_CREDENTIALS.name,
      email: SAMPLE_CREDENTIALS.email,
      password: SAMPLE_CREDENTIALS.password,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white/90 backdrop-blur-md border border-sage-200/50 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-poppins font-bold text-slate-800 mb-2">
            {mode === "signin" ? "Welcome Back" : "Join SkillBridge"}
          </h2>
          <p className="text-slate-600">
            {mode === "signin" ? "Sign in to continue your learning journey" : "Start your learning adventure today"}
          </p>
        </div>

        {/* Sample Credentials Info */}
        <div className="mb-4 p-3 bg-sage-100 border border-sage-300 rounded-lg">
          <p className="text-sm text-sage-800 mb-2">
            <strong>Try with sample credentials:</strong>
          </p>
          <p className="text-xs text-sage-700 mb-2">
            Email: {SAMPLE_CREDENTIALS.email}
            <br />
            Password: {SAMPLE_CREDENTIALS.password}
          </p>
          <button
            type="button"
            onClick={useSampleCredentials}
            className="text-xs bg-sage-500 hover:bg-sage-600 text-white px-3 py-1 rounded transition-colors"
          >
            Use Sample Credentials
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-white/50 border-2 border-sage-200/50 rounded-lg px-4 py-3 text-slate-800 placeholder-transparent focus:outline-none focus:border-sage-400 focus:bg-white/80 transition-all duration-300 peer"
                placeholder="Your Name"
              />
              <label className="absolute left-4 -top-2.5 text-sm text-sage-600 bg-white px-2 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-sage-600 peer-focus:bg-white">
                Your Name
              </label>
            </div>
          )}

          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-white/50 border-2 border-sage-200/50 rounded-lg px-4 py-3 text-slate-800 placeholder-transparent focus:outline-none focus:border-sage-400 focus:bg-white/80 transition-all duration-300 peer"
              placeholder="Your Email"
            />
            <label className="absolute left-4 -top-2.5 text-sm text-sage-600 bg-white px-2 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-sage-600 peer-focus:bg-white">
              Email Address
            </label>
          </div>

          <div className="relative">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-white/50 border-2 border-sage-200/50 rounded-lg px-4 py-3 text-slate-800 placeholder-transparent focus:outline-none focus:border-sage-400 focus:bg-white/80 transition-all duration-300 peer"
              placeholder="Password"
            />
            <label className="absolute left-4 -top-2.5 text-sm text-sage-600 bg-white px-2 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-sage-600 peer-focus:bg-white">
              Password
            </label>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-sage-500 to-lavender-500 hover:from-sage-600 hover:to-lavender-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-poppins font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {mode === "signin" ? "Signing In..." : "Creating Account..."}
              </div>
            ) : mode === "signin" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-600">
            {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-sage-600 hover:text-sage-700 font-medium transition-colors"
            >
              {mode === "signin" ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
