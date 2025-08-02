"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { useUserProfile } from "@/hooks/useUserProfile"
import { useCourses } from "@/hooks/useCourses"

const navItems = [
  { name: "Courses", href: "/courses" },
  { name: "My Learning", href: "/my-learning" },
  { name: "Gamify", href: "/gamify" },
  { name: "Meet the Team", href: "/team" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])

  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { profile } = useUserProfile()
  const { courses } = useCourses()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = courses
        .filter(
          (course) =>
            course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.instructor.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .slice(0, 5)
      setSearchResults(filtered)
    } else {
      setSearchResults([])
    }
  }, [searchQuery, courses])

  const handleSignOut = async () => {
    await signOut()
    setShowUserMenu(false)
  }

  const handleSearchSelect = (courseId: string) => {
    setShowSearch(false)
    setSearchQuery("")
    router.push(`/courses#${courseId}`)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-white/90 border-b border-sage-200/50 shadow-lg shadow-sage-100/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-2xl font-poppins font-bold bg-gradient-to-r from-sage-600 via-lavender-600 to-sky-600 bg-clip-text text-transparent">
              SkillBridge
            </h1>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    pathname === item.href
                      ? "text-sage-700 bg-sage-100/50"
                      : "text-slate-600 hover:text-sage-700 hover:bg-sage-50/50"
                  }`}
                >
                  {item.name}
                  {pathname === item.href && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-sage-500 to-lavender-500 rounded-full"></div>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Search and Auth Section */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 text-slate-600 hover:text-sage-700 hover:bg-sage-50/50 rounded-lg transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>

              {showSearch && (
                <div className="absolute right-0 mt-2 w-80 bg-white/90 backdrop-blur-md border border-sage-200/50 rounded-lg shadow-lg p-4 animate-slide-in-bottom">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/50 border border-sage-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:border-sage-400 transition-all duration-300"
                      autoFocus
                    />
                    <svg
                      className="absolute right-3 top-2.5 w-4 h-4 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>

                  {searchResults.length > 0 && (
                    <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                      {searchResults.map((course) => (
                        <button
                          key={course.id}
                          onClick={() => handleSearchSelect(course.id)}
                          className="w-full text-left p-3 hover:bg-sage-50 rounded-lg transition-colors duration-200"
                        >
                          <div className="font-medium text-slate-800">{course.title}</div>
                          <div className="text-sm text-slate-600">
                            {course.category} • {course.instructor}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {searchQuery && searchResults.length === 0 && (
                    <div className="mt-3 text-center text-slate-500 py-4">No courses found for "{searchQuery}"</div>
                  )}

                  <div className="mt-3 pt-3 border-t border-sage-200">
                    <Link
                      href="/courses"
                      onClick={() => setShowSearch(false)}
                      className="block text-center text-sage-600 hover:text-sage-700 font-medium transition-colors"
                    >
                      View All Courses →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Contact/Support */}
            <Link
              href="/contact"
              className="p-2 text-slate-600 hover:text-sage-700 hover:bg-sage-50/50 rounded-lg transition-all duration-300"
              title="Contact Support"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm border border-sage-200/50 rounded-full px-4 py-2 hover:bg-white/80 transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-sage-400 to-lavender-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {profile?.name?.charAt(0) || user.email?.charAt(0) || "U"}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium text-slate-800">{profile?.name || "User"}</div>
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-md border border-sage-200/50 rounded-lg shadow-lg py-2 animate-slide-in-bottom">
                    <Link
                      href="/my-learning"
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-sage-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      My Learning
                    </Link>
                    <Link
                      href="/gamify"
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-sage-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Gamify
                    </Link>
                    <hr className="my-2 border-sage-200" />
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth"
                className="bg-gradient-to-r from-sage-500 to-lavender-500 hover:from-sage-600 hover:to-lavender-600 text-white font-medium py-2 px-4 rounded-full transition-all duration-300 hover:scale-105"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-600 hover:text-sage-700 p-2 rounded-lg hover:bg-sage-50/50 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden animate-slide-in-bottom">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/90 backdrop-blur-md rounded-lg mt-2 border border-sage-200/50">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === item.href
                      ? "text-sage-700 bg-sage-100/50"
                      : "text-slate-600 hover:text-sage-700 hover:bg-sage-50/50"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/contact"
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-sage-700 hover:bg-sage-50/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact Support
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
