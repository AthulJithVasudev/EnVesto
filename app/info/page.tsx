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
  const { user, updateProfile } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    name: user?.name || "",
    age: user?.age?.toString() || "",
    email: user?.email || "",
    phone: user?.phone || "",
    job: user?.job || "",
    avgMonthlyIncome: user?.avgMonthlyIncome?.toString() || "",
    state: user?.state || "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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

    // TODO: save profile to Firebase
    console.log("Profile form data:", profileData)

    // Update profile in context
    updateProfile(profileData)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      router.push("/login")
    }, 1000)
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-envesto-gray-700 mb-1">Full Name</label>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-envesto-gray-700 mb-1">Age</label>
                <Input
                  type="number"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  className={errors.age ? "border-red-500" : ""}
                  min="15"
                  max="100"
                />
                {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-envesto-gray-700 mb-1">Email</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-envesto-gray-700 mb-1">Phone Number</label>
                <Input
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={errors.phone ? "border-red-500" : ""}
                  maxLength={10}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Job */}
              <div>
                <label className="block text-sm font-medium text-envesto-gray-700 mb-1">Job/Profession</label>
                <Input
                  type="text"
                  placeholder="e.g., Freelance Developer, Uber Driver"
                  value={formData.job}
                  onChange={(e) => handleInputChange("job", e.target.value)}
                  className={errors.job ? "border-red-500" : ""}
                />
                {errors.job && <p className="text-red-500 text-sm mt-1">{errors.job}</p>}
              </div>

              {/* Average Monthly Income */}
              <div>
                <label className="block text-sm font-medium text-envesto-gray-700 mb-1">
                  Average Monthly Income (₹)
                </label>
                <Input
                  type="number"
                  placeholder="Enter amount in rupees"
                  value={formData.avgMonthlyIncome}
                  onChange={(e) => handleInputChange("avgMonthlyIncome", e.target.value)}
                  className={errors.avgMonthlyIncome ? "border-red-500" : ""}
                  min="1"
                  step="1"
                />
                {errors.avgMonthlyIncome && <p className="text-red-500 text-sm mt-1">{errors.avgMonthlyIncome}</p>}
              </div>
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-envesto-gray-700 mb-1">State</label>
              <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                <SelectTrigger className={errors.state ? "border-red-500" : ""}>
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
              {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
            </div>

            <Button
              type="submit"
              className="w-full bg-envesto-teal hover:bg-envesto-teal/90 text-white py-3"
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
