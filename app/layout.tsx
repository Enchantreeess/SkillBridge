import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import ClientLayout from "./components/ClientLayout"
import PageTransition from "./components/PageTransition"
import { SupabaseProvider } from "./components/SupabaseProvider"
import SupabaseStatus from "./components/SupabaseStatus"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "SkillBridge - Microlearning Platform",
  description: "Bridge the gap between curiosity and mastery",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-inter bg-gradient-to-br from-sage-50 via-lavender-50 to-sky-50 min-h-screen">
        <SupabaseProvider>
          <SupabaseStatus />
          <ClientLayout>
            <Navbar />
            <PageTransition>
              <main className="pt-20">{children}</main>
            </PageTransition>
            <Footer />
          </ClientLayout>
        </SupabaseProvider>
      </body>
    </html>
  )
}
