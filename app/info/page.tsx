"use client"

import type React from "react"
import { useState, Suspense } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FormData {
  name: string
  age: string
  phone: string
  job: string
  avgMonthlyIncome: string
  state: string
}

interface FormErrors {
  name?: string
  age?: string
  phone?: string
  job?: string
  avgMonthlyIncome?: string
  state?: string
}

function InfoForm() {
  const { userData, updateProfile } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const INDIAN_STATES = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana",
    "Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
    "Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
    "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu and Kashmir","Ladakh",
    "Puducherry","Chandigarh","Dadra and Nagar Haveli and Daman and Diu","Lakshadweep",
    "Andaman and Nicobar Islands",
  ]

  const [formData, setFormData] = useState<FormData>({
    name: userData?.name || "",
    age: userData?.age?.toString() || "",
    phone: userData?.phone || "",
    job: userData?.job || "",
    avgMonthlyIncome: userData?.avgMonthlyIncome?.toString() || "",
    state: userData?.state || "",
  })

  const [errors, setErrors] = useState<FormErrors>({})

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.age) newErrors.age = "Age is required"
    else {
      const ageNum = Number.parseInt(formData.age)
      if (isNaN(ageNum) || ageNum < 15 || ageNum > 100) newErrors.age = "Age must be between 15 and 100"
    }

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
    if (field === "phone") value = value.replace(/\D/g, "").slice(0, 10)
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
      phone: formData.phone.trim(),
      job: formData.job.trim(),
      avgMonthlyIncome: Number.parseFloat(formData.avgMonthlyIncome),
      state: formData.state,
    }

    try {
      await updateProfile(profileData)
      router.push("/login")
    } catch (error) {
      console.error("Failed to update profile", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <Card className="w-full max-w-2xl border border-gray-200 shadow-md rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Complete Your Profile</CardTitle>
          <CardDescription className="text-gray-500">Help us personalize your EnVesto experience</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium mb-2">Full Name</label>
                <Input placeholder="Enter your full name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block font-medium mb-2">Age</label>
                <Input type="number" placeholder="Enter your age" value={formData.age} onChange={(e) => handleInputChange("age", e.target.value)} />
                {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
              </div>
              <div>
                <label className="block font-medium mb-2">Phone Number</label>
                <Input placeholder="Enter 10-digit phone number" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block font-medium mb-2">Job/Profession</label>
                <Input placeholder="e.g., Freelance Developer, Uber Driver" value={formData.job} onChange={(e) => handleInputChange("job", e.target.value)} />
                {errors.job && <p className="text-red-500 text-sm mt-1">{errors.job}</p>}
              </div>
              <div>
                <label className="block font-medium mb-2">Average Monthly Income (₹)</label>
                <Input type="number" placeholder="Enter amount in rupees" value={formData.avgMonthlyIncome} onChange={(e) => handleInputChange("avgMonthlyIncome", e.target.value)} />
                {errors.avgMonthlyIncome && <p className="text-red-500 text-sm mt-1">{errors.avgMonthlyIncome}</p>}
              </div>
              <div>
                <label className="block font-medium mb-2">State</label>
                <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                  <SelectTrigger>
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
            </div>
            <Button type="submit" disabled={isLoading} className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl">
              {isLoading ? "Saving Profile..." : "Complete Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function InfoPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      <InfoForm />
    </Suspense>
  )
}
