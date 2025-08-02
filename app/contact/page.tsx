"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase"
import { PageTransition } from "@/components/PageTransition"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setErrorMessage("")

    try {
      if (!isSupabaseConfigured()) {
        // Demo mode - simulate successful submission
        console.log("Demo mode: Contact form submitted", formData)
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay
        setStatus("success")
        setFormData({ name: "", email: "", message: "" })
        return
      }

      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("contact_submissions")
        .insert([
          {
            name: formData.name,
            email: formData.email,
            message: formData.message,
            status: "new",
          },
        ])
        .select()

      if (error) {
        // Handle specific database errors
        if (
          error.code === "PGRST116" ||
          error.message.includes("relation") ||
          error.message.includes("does not exist")
        ) {
          console.warn("Contact table doesn't exist, falling back to demo mode")
          // Simulate successful submission in demo mode
          await new Promise((resolve) => setTimeout(resolve, 1000))
          setStatus("success")
          setFormData({ name: "", email: "", message: "" })
          return
        }

        console.error("Supabase error details:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        })

        throw new Error(error.message || "Failed to submit contact form")
      }

      console.log("Contact form submitted successfully:", data)
      setStatus("success")
      setFormData({ name: "", email: "", message: "" })
    } catch (error: any) {
      console.error("Error submitting contact form:", error)
      setStatus("error")
      setErrorMessage(error.message || "An unexpected error occurred. Please try again.")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const getButtonContent = () => {
    switch (status) {
      case "loading":
        return (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Sending...
          </>
        )
      case "success":
        return (
          <>
            <CheckCircle className="w-4 h-4 mr-2" />
            Message Sent!
          </>
        )
      case "error":
        return (
          <>
            <AlertCircle className="w-4 h-4 mr-2" />
            Try Again
          </>
        )
      default:
        return (
          <>
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </>
        )
    }
  }

  const getButtonClass = () => {
    switch (status) {
      case "success":
        return "bg-green-600 hover:bg-green-700 border-green-600"
      case "error":
        return "bg-red-600 hover:bg-red-700 border-red-600"
      default:
        return "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
    }
  }

  return (
    <PageTransition variant="slide-in-right">
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions about SkillBridge? We'd love to hear from you. Send us a message and we'll respond as soon
              as possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-gray-800">Send us a Message</CardTitle>
                <CardDescription className="text-gray-600">
                  Fill out the form below and we'll get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  {status === "error" && errorMessage && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-sm">{errorMessage}</p>
                    </div>
                  )}

                  {status === "success" && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-700 text-sm">Thank you for your message! We'll get back to you soon.</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={status === "loading"}
                    className={`w-full py-3 px-6 text-white font-semibold rounded-lg transition-all duration-200 ${getButtonClass()}`}
                  >
                    {getButtonContent()}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <Mail className="w-6 h-6 mt-1 text-purple-200" />
                      <div>
                        <h4 className="font-semibold mb-1">Email</h4>
                        <p className="text-purple-100">support@skillbridge.com</p>
                        <p className="text-purple-100">hello@skillbridge.com</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <Phone className="w-6 h-6 mt-1 text-purple-200" />
                      <div>
                        <h4 className="font-semibold mb-1">Phone</h4>
                        <p className="text-purple-100">+1 (555) 123-4567</p>
                        <p className="text-purple-100">+1 (555) 987-6543</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <MapPin className="w-6 h-6 mt-1 text-purple-200" />
                      <div>
                        <h4 className="font-semibold mb-1">Address</h4>
                        <p className="text-purple-100">
                          123 Learning Street
                          <br />
                          Education City, EC 12345
                          <br />
                          United States
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Office Hours</h3>
                  <div className="space-y-3 text-gray-600">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span className="font-semibold">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span className="font-semibold">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span className="font-semibold">Closed</span>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      <strong>Response Time:</strong> We typically respond to all inquiries within 24 hours during
                      business days.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
