"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

const SAMPLE_CREDENTIALS = {
  email: "demo@skillbridge.com",
  password: "demo123456",
  name: "Demo User",
}

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signup")
  const [formData, setFormData] = useState({
    name: SAMPLE_CREDENTIALS.name,
    email: SAMPLE_CREDENTIALS.email,
    password: SAMPLE_CREDENTIALS.password,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const { signIn, signUp, createDemoSession, isConfigured } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      if (!isConfigured) {
        // Demo mode without Supabase
        setSuccess("Demo mode: Creating session...")
        await createDemoSession(formData.email, formData.name)
        setSuccess("Welcome to SkillBridge! Redirecting...")
        setTimeout(() => router.push("/courses"), 1000)
        return
      }

      if (mode === "signup") {
        setSuccess("Creating your account...")
        const { error } = await signUp(formData.email, formData.password, formData.name)

        if (error) {
          if (
            error.message.includes("already registered") ||
            error.message.includes("already exists") ||
            error.message.includes("User already exists")
          ) {
            // User exists, try to sign them in
            setSuccess("Account exists! Signing you in...")
            const { error: signInError } = await signIn(formData.email, formData.password)

            if (signInError) {
              if (signInError.message.includes("Email not confirmed") || signInError.message.includes("Demo mode")) {
                // Handle email confirmation issue with demo fallback
                setSuccess("Email confirmation issue detected. Creating demo session...")
                await createDemoSession(formData.email, formData.name)
                setSuccess("Welcome to SkillBridge! Redirecting...")
                setTimeout(() => router.push("/courses"), 1000)
                return
              }
              throw signInError
            } else {
              setSuccess("Welcome back! Redirecting...")
              setTimeout(() => router.push("/courses"), 1000)
            }
          } else {
            throw error
          }
        } else {
          // Account created, try to sign in
          setSuccess("Account created! Signing you in...")
          const { error: signInError } = await signIn(formData.email, formData.password)

          if (signInError) {
            if (signInError.message.includes("Email not confirmed") || signInError.message.includes("Demo mode")) {
              // Handle email confirmation issue with demo fallback
              setSuccess("Email confirmation bypassed for demo. Creating session...")
              await createDemoSession(formData.email, formData.name)
              setSuccess("Welcome to SkillBridge! Redirecting...")
              setTimeout(() => router.push("/courses"), 1000)
              return
            }
            throw signInError
          } else {
            setSuccess("Welcome to SkillBridge! Redirecting...")
            setTimeout(() => router.push("/courses"), 1000)
          }
        }
      } else {
        // Sign in mode
        const { error } = await signIn(formData.email, formData.password)

        if (error) {
          if (error.message.includes("Invalid login credentials") || error.message.includes("not found")) {
            // User doesn't exist, create account
            setSuccess("Creating account for you...")
            const { error: signUpError } = await signUp(formData.email, formData.password, formData.name || "User")

            if (!signUpError) {
              // Try to sign in after creating account
              const { error: signInError } = await signIn(formData.email, formData.password)

              if (
                signInError &&
                (signInError.message.includes("Email not confirmed") || signInError.message.includes("Demo mode"))
              ) {
                // Handle email confirmation with demo fallback
                setSuccess("Account created! Creating demo session...")
                await createDemoSession(formData.email, formData.name || "User")
                setSuccess("Welcome to SkillBridge! Redirecting...")
                setTimeout(() => router.push("/courses"), 1000)
                return
              } else if (!signInError) {
                setSuccess("Account created and signed in! Redirecting...")
                setTimeout(() => router.push("/courses"), 1000)
              } else {
                throw signInError
              }
            } else {
              throw signUpError
            }
          } else if (error.message.includes("Email not confirmed") || error.message.includes("Demo mode")) {
            // Handle email confirmation issue
            setSuccess("Email confirmation bypassed for demo. Creating session...")
            await createDemoSession(formData.email, formData.name)
            setSuccess("Welcome back! Redirecting...")
            setTimeout(() => router.push("/courses"), 1000)
            return
          } else {
            throw error
          }
        } else {
          setSuccess("Welcome back! Redirecting...")
          setTimeout(() => router.push("/courses"), 1000)
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error)
      setError(
        `Authentication failed: ${error.message}. Try using the sample credentials or check your Supabase configuration.`,
      )
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

  const resetToSample = () => {
    setFormData({
      name: SAMPLE_CREDENTIALS.name,
      email: SAMPLE_CREDENTIALS.email,
      password: SAMPLE_CREDENTIALS.password,
    })
    setError("")
    setSuccess("")
  }

  const handleDemoAccess = async () => {
    setLoading(true)
    setError("")
    setSuccess("Creating demo session...")

    try {
      await createDemoSession(SAMPLE_CREDENTIALS.email, SAMPLE_CREDENTIALS.name)
      setSuccess("Demo access granted! Redirecting...")
      setTimeout(() => router.push("/courses"), 1000)
    } catch (error) {
      setError("Demo access failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-8 px-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="bg-white/60 backdrop-blur-sm border border-sage-200/50 rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-poppins font-bold text-slate-800 mb-2">
              {mode === "signin" ? "Welcome Back" : "Join SkillBridge"}
            </h1>
            <p className="text-slate-600">
              {mode === "signin" ? "Sign in to continue learning" : "Start your learning journey today"}
            </p>
          </div>

          {/* Demo Access Button */}
          <div className="mb-6 p-4 bg-gradient-to-r from-green-100 to-blue-100 border border-green-300 rounded-lg">
            <h3 className="text-sm font-semibold text-green-800 mb-2">🚀 Quick Demo Access</h3>
            <p className="text-xs text-green-700 mb-3">
              Skip authentication and access the platform instantly with demo credentials.
            </p>
            <button
              onClick={handleDemoAccess}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 disabled:scale-100"
            >
              {loading ? "Creating Demo Session..." : "Enter Demo Mode"}
            </button>
          </div>

          {/* Sample Credentials Card */}
          <div className="mb-6 p-4 bg-gradient-to-r from-sage-100 to-lavender-100 border border-sage-300 rounded-lg">
            <h3 className="text-sm font-semibold text-sage-800 mb-2">🎯 Sample Credentials</h3>
            <div className="text-xs text-sage-700 space-y-1">
              <p>
                <strong>Email:</strong> {SAMPLE_CREDENTIALS.email}
              </p>
              <p>
                <strong>Password:</strong> {SAMPLE_CREDENTIALS.password}
              </p>
              <p>
                <strong>Name:</strong> {SAMPLE_CREDENTIALS.name}
              </p>
              <p className="text-orange-700 font-medium mt-2">
                ⚠️ If email confirmation is required, use Demo Mode above
              </p>
            </div>
            <button
              type="button"
              onClick={resetToSample}
              className="mt-2 text-xs bg-sage-500 hover:bg-sage-600 text-white px-3 py-1 rounded transition-colors"
            >
              Fill Sample Data
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                minLength={6}
                className="w-full bg-white/50 border-2 border-sage-200/50 rounded-lg px-4 py-3 text-slate-800 placeholder-transparent focus:outline-none focus:border-sage-400 focus:bg-white/80 transition-all duration-300 peer"
                placeholder="Password"
              />
              <label className="absolute left-4 -top-2.5 text-sm text-sage-600 bg-white px-2 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-sage-600 peer-focus:bg-white">
                Password (min 6 characters)
              </label>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-sage-500 to-lavender-500 hover:from-sage-600 hover:to-lavender-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-poppins font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {mode === "signin" ? "Signing In..." : "Creating Account..."}
                </div>
              ) : mode === "signin" ? (
                "Sign In"
              ) : (
                "Create Account & Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600">
              {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => {
                  setMode(mode === "signin" ? "signup" : "signin")
                  setError("")
                  setSuccess("")
                }}
                className="text-sage-600 hover:text-sage-700 font-medium transition-colors"
              >
                {mode === "signin" ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-sage-200">
            <p className="text-xs text-slate-500 text-center">
              Having trouble? Use the "Quick Demo Access" button above to bypass authentication.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
