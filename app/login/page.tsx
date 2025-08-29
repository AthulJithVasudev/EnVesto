"use client"

import AuthForm from "@/components/auth-form"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signInUser } from "@/lib/firebase-auth"
import LoadingScreen from "@/components/loading-screen"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showLoading, setShowLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (email: string, password: string) => {
    setLoading(true)
    setError("")
    try {
      await signInUser(email, password)
      setLoading(false)
      setShowLoading(true)
      router.push("/home")
    } catch (err: any) {
      setError(err.message)
      alert(`❌ Login failed: ${err.message}`)   // <-- alert for errors
      setLoading(false)
    }
  }

  return (
    <>
      {showLoading && <LoadingScreen />}
      <AuthForm
        mode="login"
        onSubmit={handleLogin}
        isLoading={loading}
        error={error}
      />
    </>
  )
}
