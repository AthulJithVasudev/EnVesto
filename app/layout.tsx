import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/contexts/auth-context"
import "./globals.css"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "EnVesto - Earn and Invest",
  description: "Financial planning for gig workers and variable income earners",
  generator: "v0.app",
  icons: {
    icon: "/logo_1.svg",
    apple: "/logo_1.svg",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${inter.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            {children}
            <Footer />
          </AuthProvider>
        </ThemeProvider>
        <Toaster richColors /> {/* ✅ Toast container */}
      </body>
    </html>
  )
}
