"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface AuthFormProps {
  mode: "login" | "signup"
  onSubmit: (email: string, password: string) => Promise<void>
  isLoading: boolean
  error?: string
}

export default function AuthForm({ mode, onSubmit, isLoading, error }: AuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (mode === "signup" && password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    await onSubmit(email, password)
  }

  const isSignup = mode === "signup"

  return (
    <div className="min-h-screen bg-envesto-gray-50 dark:bg-neutral-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md dark:bg-neutral-900 dark:border-neutral-700">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-envesto-navy dark:text-neutral-100">EnVesto</CardTitle>
          <CardDescription className="text-envesto-gray-600 dark:text-neutral-300">
            Earn and Invest - {isSignup ? "Create your account" : "Welcome back"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                          <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${errors.email ? "border-red-500" : ""} dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-700`}
            />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
                          <Input
              type="password"
              placeholder={isSignup ? "Password (min 8 characters)" : "Password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${errors.password ? "border-red-500" : ""} dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-700`}
            />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
                {error}
              </div>
            )}
            
            <Button
              type="submit"
              className="w-full bg-envesto-teal hover:bg-envesto-teal/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? (isSignup ? "Creating Account..." : "Signing In...") : isSignup ? "Sign Up" : "Login"}
            </Button>
          </form>

          <div className="text-center mt-4">
            <p className="text-envesto-gray-600 dark:text-neutral-300">
              {isSignup ? "Already have an account? " : "Don't have an account? "}
              <Link href={isSignup ? "/login" : "/signup"} className="text-envesto-teal hover:underline">
                {isSignup ? "Login here" : "Sign up here"}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}