"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import LoadingScreen from "@/components/loading-screen"

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      // Redirect based on authentication status
      if (isAuthenticated) {
        router.push("/home")
      } else {
        router.push("/signup")
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [router, isAuthenticated])

  if (isLoading) {
    return <LoadingScreen />
  }

  return null
}
