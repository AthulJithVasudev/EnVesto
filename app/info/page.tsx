"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Puducherry",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep",
  "Andaman and Nicobar Islands",
]

interface FormData {
  name: string
  age: string
  email: string
  phone: string
  job: string
  avgMonthlyIncome: string
  state: string
}

interface FormErrors {
  name?: string
  age?: string
  email?: string
  phone?: string
  job?: string
  avgMonthlyIncome?: string
  state?: string
}

export default function InfoPage() {
  const { user, userData, updateProfile } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    name: userData?.name || "",
    age: userData?.age?.toString() || "",
    email: userData?.email || user?.email || "",
    phone: userData?.phone || "",
    job: userData?.job || "",
    avgMonthlyIncome: userData?.avgMonthlyIncome?.toString() || "",
    state: userData?.state || "",
  })

  const [errors, setErrors] = useState<FormErrors>({})

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    // Age validation
    if (!formData.age) {
      newErrors.age = "Age is required"
    } else {
      const ageNum = Number.parseInt(formData.age)
      if (isNaN(ageNum) || ageNum < 15 || ageNum > 100) {
        newErrors.age = "Age must be between 15 and 100"
      }
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required"
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Phone must be exactly 10 digits"
    }

    // Job validation
    if (!formData.job.trim()) {
      newErrors.job = "Job is required"
    }

    // Income validation
    if (!formData.avgMonthlyIncome) {
      newErrors.avgMonthlyIncome = "Average monthly income is required"
    } else {
      const incomeNum = Number.parseFloat(formData.avgMonthlyIncome)
      if (isNaN(incomeNum) || incomeNum <= 0) {
        newErrors.avgMonthlyIncome = "Income must be greater than 0"
      }
    }

    // State validation
    if (!formData.state) {
      newErrors.state = "State is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const [saveError, setSaveError] = useState<string | null>(null)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveError(null)
    if (!validateForm()) return

    setIsLoading(true)

    const profileData = {
      name: formData.name.trim(),
      age: Number.parseInt(formData.age),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      job: formData.job.trim(),
      avgMonthlyIncome: Number.parseFloat(formData.avgMonthlyIncome),
      state: formData.state,
    }

    try {
      await updateProfile(profileData)
      router.push("/home")
    } catch (error: any) {
      setSaveError(error?.message || "Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-envesto-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-envesto-navy">Complete Your Profile</CardTitle>
          <CardDescription className="text-envesto-gray-600">
            Help us personalize your EnVesto experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          {saveError && (
            <div className="mb-4 p-3 rounded-xl bg-red-100 text-red-700 text-center border border-red-300">
              {saveError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Name */}
              <div>
                <label className="block text-base font-medium text-envesto-gray-700 mb-2">Full Name</label>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`rounded-xl h-14 px-4 text-base bg-white border border-envesto-gray-200 focus:border-envesto-teal focus:ring-2 focus:ring-envesto-teal/20 transition ${errors.name ? "border-red-500" : ""}`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
              </div>

              {/* Age */}
              <div>
                <label className="block text-base font-medium text-envesto-gray-700 mb-2">Age</label>
                <Input
                  type="number"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  className={`rounded-xl h-14 px-4 text-base bg-white border border-envesto-gray-200 focus:border-envesto-teal focus:ring-2 focus:ring-envesto-teal/20 transition ${errors.age ? "border-red-500" : ""}`}
                  min="15"
                  max="100"
                />
                {errors.age && <p className="text-red-500 text-sm mt-2">{errors.age}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Phone */}
              <div>
                <label className="block text-base font-medium text-envesto-gray-700 mb-2">Phone Number</label>
                <Input
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={`rounded-xl h-14 px-4 text-base bg-white border border-envesto-gray-200 focus:border-envesto-teal focus:ring-2 focus:ring-envesto-teal/20 transition ${errors.phone ? "border-red-500" : ""}`}
                  maxLength={10}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-2">{errors.phone}</p>}
              </div>

              {/* Job */}
              <div>
                <label className="block text-base font-medium text-envesto-gray-700 mb-2">Job/Profession</label>
                <Input
                  type="text"
                  placeholder="e.g., Freelance Developer, Uber Driver"
                  value={formData.job}
                  onChange={(e) => handleInputChange("job", e.target.value)}
                  className={`rounded-xl h-14 px-4 text-base bg-white border border-envesto-gray-200 focus:border-envesto-teal focus:ring-2 focus:ring-envesto-teal/20 transition ${errors.job ? "border-red-500" : ""}`}
                />
                {errors.job && <p className="text-red-500 text-sm mt-2">{errors.job}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Average Monthly Income */}
              <div>
                <label className="block text-base font-medium text-envesto-gray-700 mb-2">Average Monthly Income (₹)</label>
                <Input
                  type="number"
                  placeholder="Enter amount in rupees"
                  value={formData.avgMonthlyIncome}
                  onChange={(e) => handleInputChange("avgMonthlyIncome", e.target.value)}
                  className={`rounded-xl h-14 px-4 text-base bg-white border border-envesto-gray-200 focus:border-envesto-teal focus:ring-2 focus:ring-envesto-teal/20 transition ${errors.avgMonthlyIncome ? "border-red-500" : ""}`}
                  min="1"
                  step="1"
                />
                {errors.avgMonthlyIncome && <p className="text-red-500 text-sm mt-2">{errors.avgMonthlyIncome}</p>}
              </div>

              {/* State */}
              <div>
                <label className="block text-base font-medium text-envesto-gray-700 mb-2">State</label>
                <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                <SelectTrigger className={`rounded-xl h-16 px-5 text-base bg-white border border-envesto-gray-200 focus:border-envesto-teal focus:ring-2 focus:ring-envesto-teal/20 transition ${errors.state ? "border-red-500" : ""}`} style={{ minHeight: '56px' }}>
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIAN_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.state && <p className="text-red-500 text-sm mt-2">{errors.state}</p>}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-envesto-teal hover:bg-envesto-teal/90 text-white py-4 rounded-xl text-lg font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Saving Profile..." : "Complete Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}