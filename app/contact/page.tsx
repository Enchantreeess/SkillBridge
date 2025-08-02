"use client"

import type React from "react"

import { useState } from "react"
import { useSupabaseConfig } from "@/app/components/SupabaseProvider"
import { getSupabaseClient } from "@/lib/supabase"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const { isConfigured } = useSupabaseConfig()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      if (isConfigured) {
        try {
          // Test Supabase connection first
          const supabase = getSupabaseClient()

          // Try to insert the contact submission
          const { data, error } = await supabase
            .from("contact_submissions")
            .insert({
              name: formData.name,
              email: formData.email,
              message: formData.message,
              status: "new",
              created_at: new Date().toISOString(),
            })
            .select()

          if (error) {
            console.error("Supabase insertion error:", {
              message: error.message,
              details: error.details,
              hint: error.hint,
              code: error.code,
            })

            // If table doesn't exist or RLS blocks it, fall back to demo mode
            if (
              error.code === "42P01" ||
              error.code === "42501" ||
              error.message.includes("relation") ||
              error.message.includes("policy")
            ) {
              console.log("Table doesn't exist or RLS blocking - falling back to demo mode")
              throw new Error("Database table not configured - using demo mode")
            }

            throw new Error(`Database error: ${error.message}`)
          }

          console.log("Contact form submitted successfully to Supabase:", data)
          setSubmitStatus("success")
          alert("✅ Message sent successfully! We'll get back to you soon.")
        } catch (supabaseError) {
          console.error("Supabase error details:", supabaseError)
          // Fall back to demo mode if Supabase fails
          console.log("Falling back to demo mode due to Supabase error")
          handleDemoSubmission()
        }
      } else {
        // Demo mode
        handleDemoSubmission()
      }

      // Reset form on success
      setFormData({ name: "", email: "", message: "" })
    } catch (error) {
      console.error("Form submission error:", error)
      setSubmitStatus("error")
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      alert(`❌ Error sending message: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDemoSubmission = () => {
    // Demo mode - simulate successful submission
    console.log("📝 Demo mode - Contact form data:", {
      ...formData,
      timestamp: new Date().toISOString(),
      status: "demo_submission",
    })
    setSubmitStatus("success")
    alert("📝 Demo mode: Message logged successfully! Configure Supabase for real submissions.")
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-sage-50 via-sky-50 to-lavender-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-poppins font-bold text-slate-800 mb-4">Get In Touch</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
          {!isConfigured && (
            <div className="mt-6 p-4 bg-blue-100 border border-blue-300 rounded-lg text-blue-800 text-sm max-w-2xl mx-auto">
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Demo mode active: Messages will be logged to console. Configure Supabase for real submissions.
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-poppins font-semibold text-slate-800 mb-6">Send us a message</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/60 border-2 border-sage-200/50 rounded-lg px-4 py-3 text-slate-800 placeholder-transparent focus:outline-none focus:border-sage-400 focus:bg-white/90 transition-all duration-300 peer"
                  placeholder="Your Name"
                />
                <label className="absolute left-4 -top-2.5 text-sm text-sage-600 bg-white px-2 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-sage-600 peer-focus:bg-white">
                  Your Name
                </label>
              </div>

              {/* Email Field */}
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/60 border-2 border-sage-200/50 rounded-lg px-4 py-3 text-slate-800 placeholder-transparent focus:outline-none focus:border-sage-400 focus:bg-white/90 transition-all duration-300 peer"
                  placeholder="Your Email"
                />
                <label className="absolute left-4 -top-2.5 text-sm text-sage-600 bg-white px-2 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-sage-600 peer-focus:bg-white">
                  Your Email
                </label>
              </div>

              {/* Message Field */}
              <div className="relative">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full bg-white/60 border-2 border-sage-200/50 rounded-lg px-4 py-3 text-slate-800 placeholder-transparent focus:outline-none focus:border-sage-400 focus:bg-white/90 transition-all duration-300 peer resize-none"
                  placeholder="Your Message"
                />
                <label className="absolute left-4 -top-2.5 text-sm text-sage-600 bg-white px-2 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-sage-600 peer-focus:bg-white">
                  Your Message
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full font-poppins font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:scale-100 disabled:shadow-none ${
                  submitStatus === "success"
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                    : submitStatus === "error"
                      ? "bg-gradient-to-r from-red-500 to-rose-500 text-white"
                      : "bg-gradient-to-r from-sage-500 to-lavender-500 hover:from-sage-600 hover:to-lavender-600 disabled:from-gray-400 disabled:to-gray-500 text-white"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending...
                  </div>
                ) : submitStatus === "success" ? (
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Message Sent!
                  </div>
                ) : submitStatus === "error" ? (
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Try Again
                  </div>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-sage-100 to-sky-100 rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-sage-500 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-poppins font-semibold text-slate-800">Email Us</h3>
              </div>
              <p className="text-slate-600 mb-2">hello@skillbridge.com</p>
              <p className="text-slate-600">support@skillbridge.com</p>
            </div>

            <div className="bg-gradient-to-br from-lavender-100 to-beige-100 rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-lavender-500 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-poppins font-semibold text-slate-800">Live Chat</h3>
              </div>
              <p className="text-slate-600 mb-4">Get instant help from our support team</p>
              <button className="bg-gradient-to-r from-lavender-500 to-beige-500 hover:from-lavender-600 hover:to-beige-600 text-white font-medium py-2 px-4 rounded-full transition-all duration-300 hover:scale-105">
                Start Chat
              </button>
            </div>

            <div className="bg-gradient-to-br from-sky-100 to-sage-100 rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-poppins font-semibold text-slate-800">Follow Us</h3>
              </div>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-sage-500 hover:bg-sage-600 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-lavender-500 hover:bg-lavender-600 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-sky-500 hover:bg-sky-600 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
