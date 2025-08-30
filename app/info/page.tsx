"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
function InfoPage() {
  const { user, userData, updateProfile } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana",
  "Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
  "Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu and Kashmir","Ladakh",
  "Puducherry","Chandigarh","Dadra and Nagar Haveli and Daman and Diu","Lakshadweep",
  "Andaman and Nicobar Islands",
]

  // Get email from userData, user, or query param
  const initialEmail = userData?.email || user?.email || searchParams.get("email") || ""

  const [formData, setFormData] = useState<FormData>({
    name: userData?.name || "",
    age: userData?.age?.toString() || "",
    email: initialEmail,
    phone: userData?.phone || "",
    job: userData?.job || "",
    avgMonthlyIncome: userData?.avgMonthlyIncome?.toString() || "",
    state: userData?.state || "",
  })

  const [errors, setErrors] = useState<FormErrors>({})

  // If email in query param changes, update formData.email (for client navigation)
  useEffect(() => {
    if (searchParams.get("email") && !formData.email) {
      setFormData((prev) => ({ ...prev, email: searchParams.get("email") || "" }))
    }
  }, [searchParams, formData.email])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.age) newErrors.age = "Age is required"
    else {
      const ageNum = Number.parseInt(formData.age)
      if (isNaN(ageNum) || ageNum < 15 || ageNum > 100) {
        newErrors.age = "Age must be between 15 and 100"
      }
    }

    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"

    if (!formData.phone.trim()) newErrors.phone = "Phone is required"
    else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ""))) newErrors.phone = "Phone must be 10 digits"

    if (!formData.job.trim()) newErrors.job = "Job is required"

    if (!formData.avgMonthlyIncome) newErrors.avgMonthlyIncome = "Average monthly income is required"
    else {
      const incomeNum = Number.parseFloat(formData.avgMonthlyIncome)
      if (isNaN(incomeNum) || incomeNum <= 0) newErrors.avgMonthlyIncome = "Income must be greater than 0"
    }

    if (!formData.state) newErrors.state = "State is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
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

    updateProfile(profileData)

    setTimeout(() => {
      setIsLoading(false)
      router.push("/login")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-envesto-gray-50 dark:bg-neutral-900 flex items-center justify-center p-4 transition-colors">
      <Card className="w-full max-w-2xl border border-envesto-gray-200 dark:border-neutral-700 dark:bg-neutral-800 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-envesto-navy dark:text-envesto-green">
            Complete Your Profile
          </CardTitle>
          <CardDescription className="text-envesto-gray-600 dark:text-neutral-300">
            Help us personalize your EnVesto experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-envesto-gray-700 dark:text-neutral-200 mb-1">Full Name</label>
                <Input type="text" placeholder="Enter your full name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} className={errors.name ? "border-red-500" : ""} />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-envesto-gray-700 dark:text-neutral-200 mb-1">Age</label>
                <Input type="number" placeholder="Enter your age" value={formData.age} onChange={(e) => handleInputChange("age", e.target.value)} className={errors.age ? "border-red-500" : ""} min="15" max="100" />
                {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-envesto-gray-700 dark:text-neutral-200 mb-1">Email</label>
                <Input type="email" placeholder="Enter your email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} className={errors.email ? "border-red-500" : ""} />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-envesto-gray-700 dark:text-neutral-200 mb-1">Phone Number</label>
                <Input type="tel" placeholder="Enter 10-digit phone number" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} className={errors.phone ? "border-red-500" : ""} maxLength={10} />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Job */}
              <div>
                <label className="block text-sm font-medium text-envesto-gray-700 dark:text-neutral-200 mb-1">Job/Profession</label>
                <Input type="text" placeholder="e.g., Freelance Developer, Uber Driver" value={formData.job} onChange={(e) => handleInputChange("job", e.target.value)} className={errors.job ? "border-red-500" : ""} />
                {errors.job && <p className="text-red-500 text-sm mt-1">{errors.job}</p>}
              </div>
              {/* Average Monthly Income */}
              <div>
                <label className="block text-sm font-medium text-envesto-gray-700 dark:text-neutral-200 mb-1">Average Monthly Income (₹)</label>
                <Input type="number" placeholder="Enter amount in rupees" value={formData.avgMonthlyIncome} onChange={(e) => handleInputChange("avgMonthlyIncome", e.target.value)} className={errors.avgMonthlyIncome ? "border-red-500" : ""} min="1" step="1" />
                {errors.avgMonthlyIncome && <p className="text-red-500 text-sm mt-1">{errors.avgMonthlyIncome}</p>}
              </div>
            </div>
            {/* State */}
            <div>
              <label className="block text-sm font-medium text-envesto-gray-700 dark:text-neutral-200 mb-1">State</label>
              <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                <SelectTrigger className={errors.state ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select your state" />
                </SelectTrigger>
                <SelectContent>
                  {INDIAN_STATES.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
            </div>
            <Button type="submit" className="w-full bg-envesto-teal hover:bg-envesto-teal/90 text-white py-3" disabled={isLoading}>
              {isLoading ? "Saving Profile..." : "Complete Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default InfoPage
 