"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir",
  "Ladakh", "Puducherry", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep", "Andaman and Nicobar Islands",
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
    email: user?.email || userData?.email || "",
    phone: userData?.phone || "",
    job: userData?.job || "",
    avgMonthlyIncome: userData?.avgMonthlyIncome?.toString() || "",
    state: userData?.state || "",
  })

  const [errors, setErrors] = useState<FormErrors>({})

  // 🔹 Validation Function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"

    const ageNum = parseInt(formData.age)
    if (!formData.age) newErrors.age = "Age is required"
    else if (isNaN(ageNum) || ageNum < 15 || ageNum > 100)
      newErrors.age = "Age must be between 15 and 100"

    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email"

    if (!formData.phone.trim()) newErrors.phone = "Phone is required"
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone must be 10 digits"

    if (!formData.job.trim()) newErrors.job = "Job is required"

    const incomeNum = parseFloat(formData.avgMonthlyIncome)
    if (!formData.avgMonthlyIncome) newErrors.avgMonthlyIncome = "Income is required"
    else if (isNaN(incomeNum) || incomeNum <= 0)
      newErrors.avgMonthlyIncome = "Income must be greater than 0"

    if (!formData.state) newErrors.state = "State is required"

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the highlighted errors")
    }

    return Object.keys(newErrors).length === 0
  }

  // 🔹 Input Change Handler
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  // 🔹 Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      await updateProfile({
        name: formData.name.trim(),
        age: parseInt(formData.age),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        job: formData.job.trim(),
        avgMonthlyIncome: parseFloat(formData.avgMonthlyIncome),
        state: formData.state,
      })

      toast.success("Profile updated successfully 🎉")
      router.push("/home")
    } catch (error: any) {
      toast.error(error?.message || "Failed to update profile. Try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-envesto-gray-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-3xl shadow-lg rounded-2xl border border-envesto-gray-200">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-4xl font-extrabold text-envesto-navy">
            Complete Your Profile
          </CardTitle>
          <CardDescription className="text-envesto-gray-600 text-lg">
            Help us personalize your EnVesto experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-medium mb-2">Full Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  className={`h-14 rounded-xl shadow-sm focus:ring-2 focus:ring-envesto-teal ${errors.name ? "border-red-500" : ""}`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-base font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                  className={`h-14 rounded-xl shadow-sm focus:ring-2 focus:ring-envesto-teal ${errors.email ? "border-red-500" : ""}`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
              </div>
            </div>

            {/* Age + Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-medium mb-2">Age</label>
                <Input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  placeholder="Enter your age"
                  className={`h-14 rounded-xl shadow-sm focus:ring-2 focus:ring-envesto-teal ${errors.age ? "border-red-500" : ""}`}
                />
                {errors.age && <p className="text-red-500 text-sm mt-2">{errors.age}</p>}
              </div>
              <div>
                <label className="block text-base font-medium mb-2">Phone Number</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="10-digit number"
                  maxLength={10}
                  className={`h-14 rounded-xl shadow-sm focus:ring-2 focus:ring-envesto-teal ${errors.phone ? "border-red-500" : ""}`}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-2">{errors.phone}</p>}
              </div>
            </div>

            {/* Job + Income */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-medium mb-2">Job / Profession</label>
                <Input
                  value={formData.job}
                  onChange={(e) => handleInputChange("job", e.target.value)}
                  placeholder="e.g. Freelancer"
                  className={`h-14 rounded-xl shadow-sm focus:ring-2 focus:ring-envesto-teal ${errors.job ? "border-red-500" : ""}`}
                />
                {errors.job && <p className="text-red-500 text-sm mt-2">{errors.job}</p>}
              </div>
              <div>
                <label className="block text-base font-medium mb-2">Monthly Income (₹)</label>
                <Input
                  type="number"
                  value={formData.avgMonthlyIncome}
                  onChange={(e) => handleInputChange("avgMonthlyIncome", e.target.value)}
                  placeholder="Enter amount"
                  className={`h-14 rounded-xl shadow-sm focus:ring-2 focus:ring-envesto-teal ${errors.avgMonthlyIncome ? "border-red-500" : ""}`}
                />
                {errors.avgMonthlyIncome && <p className="text-red-500 text-sm mt-2">{errors.avgMonthlyIncome}</p>}
              </div>
            </div>

            {/* State Dropdown */}
            <div>
              <label className="block text-base font-medium mb-2">State</label>
              <Select
                value={formData.state}
                onValueChange={(val) => handleInputChange("state", val)}
              >
                <SelectTrigger className={`h-14 rounded-xl shadow-sm focus:ring-2 focus:ring-envesto-teal ${errors.state ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select your state" />
                </SelectTrigger>
                <SelectContent>
                  {INDIAN_STATES.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.state && <p className="text-red-500 text-sm mt-2">{errors.state}</p>}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-14 bg-envesto-teal hover:bg-envesto-teal/90 text-white rounded-xl text-lg font-semibold shadow-md transition-all"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Complete Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
