"use client"

import AuthForm from "@/components/auth-form"
import LoadingScreen from "@/components/loading-screen"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { registerUser } from "@/lib/firebase-auth"   // your auth functions

export default function SignupPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showLoading, setShowLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async (email: string, password: string) => {
    setLoading(true)
    setError("")
    try {
      await registerUser(email, password)
      setLoading(false)
      setShowLoading(true)
      router.push("/info")
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <>
      {showLoading && <LoadingScreen />}
      <AuthForm
        mode="signup"
        onSubmit={handleSignup}
        isLoading={loading}
        error={error}
      />
    </>
  )
}
