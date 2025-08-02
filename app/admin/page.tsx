"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { getSupabaseClient } from "@/lib/supabase"

interface ContactSubmission {
  id: string
  name: string
  email: string
  message: string
  status: "new" | "read" | "replied"
  created_at: string
}

interface UserStats {
  total_users: number
  total_xp: number
  total_courses_completed: number
  avg_level: number
}

export default function AdminDashboard() {
  const { user, isConfigured } = useAuth()
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && isConfigured) {
      fetchData()
    } else {
      setLoading(false)
    }
  }, [user, isConfigured])

  const fetchData = async () => {
    if (!isConfigured) return

    try {
      const supabase = getSupabaseClient()

      // Fetch contact submissions
      const { data: contactData, error: contactError } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false })

      if (contactError) throw contactError
      setContacts(contactData || [])

      // Fetch user statistics
      const { data: statsData, error: statsError } = await supabase
        .from("user_profiles")
        .select("total_xp, current_level")

      if (statsError) throw statsError

      if (statsData) {
        const stats: UserStats = {
          total_users: statsData.length,
          total_xp: statsData.reduce((sum, user) => sum + user.total_xp, 0),
          total_courses_completed: 0, // You can calculate this from course_progress table
          avg_level: statsData.reduce((sum, user) => sum + user.current_level, 0) / statsData.length,
        }
        setUserStats(stats)
      }
    } catch (error) {
      console.error("Error fetching admin data:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateContactStatus = async (id: string, status: "new" | "read" | "replied") => {
    if (!isConfigured) return

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("contact_submissions").update({ status }).eq("id", id)

      if (error) throw error

      setContacts((prev) => prev.map((contact) => (contact.id === id ? { ...contact, status } : contact)))
    } catch (error) {
      console.error("Error updating contact status:", error)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-poppins font-bold text-slate-800 mb-4">Admin Access Required</h1>
          <p className="text-slate-600">Please sign in with admin credentials.</p>
        </div>
      </div>
    )
  }

  if (!isConfigured) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-poppins font-bold text-slate-800 mb-4">Supabase Configuration Required</h1>
          <p className="text-slate-600">Please configure Supabase to access the admin dashboard.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sage-200 border-t-sage-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-poppins font-bold text-slate-800 mb-4">Admin Dashboard</h1>
          <p className="text-xl text-slate-600">Manage contacts and view platform analytics</p>
        </div>

        {/* Stats Cards */}
        {userStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-gradient-to-br from-sage-100 to-sage-200 p-6 rounded-2xl shadow-lg">
              <div className="text-3xl font-bold text-sage-700 mb-2">{userStats.total_users}</div>
              <div className="text-sage-600 font-medium">Total Users</div>
            </div>
            <div className="bg-gradient-to-br from-sky-100 to-sky-200 p-6 rounded-2xl shadow-lg">
              <div className="text-3xl font-bold text-sky-700 mb-2">{userStats.total_xp.toLocaleString()}</div>
              <div className="text-sky-600 font-medium">Total XP Earned</div>
            </div>
            <div className="bg-gradient-to-br from-lavender-100 to-lavender-200 p-6 rounded-2xl shadow-lg">
              <div className="text-3xl font-bold text-lavender-700 mb-2">{userStats.avg_level.toFixed(1)}</div>
              <div className="text-lavender-600 font-medium">Average Level</div>
            </div>
            <div className="bg-gradient-to-br from-beige-100 to-beige-200 p-6 rounded-2xl shadow-lg">
              <div className="text-3xl font-bold text-beige-700 mb-2">{contacts.length}</div>
              <div className="text-beige-600 font-medium">Contact Messages</div>
            </div>
          </div>
        )}

        {/* Contact Submissions */}
        <div className="bg-white/60 backdrop-blur-sm border border-sage-200/50 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-poppins font-bold text-slate-800 mb-6">Contact Submissions</h2>

          {contacts.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📭</div>
              <p className="text-slate-600">No contact submissions yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                    contact.status === "new"
                      ? "border-sage-300 bg-sage-50"
                      : contact.status === "read"
                        ? "border-sky-300 bg-sky-50"
                        : "border-lavender-300 bg-lavender-50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">{contact.name}</h3>
                      <p className="text-slate-600">{contact.email}</p>
                      <p className="text-sm text-slate-500">
                        {new Date(contact.created_at).toLocaleDateString()} at{" "}
                        {new Date(contact.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateContactStatus(contact.id, "read")}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          contact.status === "read"
                            ? "bg-sky-200 text-sky-800"
                            : "bg-gray-200 text-gray-600 hover:bg-sky-200 hover:text-sky-800"
                        }`}
                      >
                        Mark Read
                      </button>
                      <button
                        onClick={() => updateContactStatus(contact.id, "replied")}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          contact.status === "replied"
                            ? "bg-lavender-200 text-lavender-800"
                            : "bg-gray-200 text-gray-600 hover:bg-lavender-200 hover:text-lavender-800"
                        }`}
                      >
                        Mark Replied
                      </button>
                    </div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-4">
                    <p className="text-slate-700">{contact.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
