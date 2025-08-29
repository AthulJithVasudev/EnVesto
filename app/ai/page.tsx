"use client"

import { useRouter } from "next/navigation"
import Header from "@/components/header"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageTransition } from "@/components/page-transition"
import { motion } from "framer-motion"

export default function AIPage() {
  const router = useRouter()
  const handleBackToHome = () => router.push("/home")

  return (
    <div className="min-h-screen bg-envesto-gray-50 flex flex-col">
      <Header />

      <PageTransition>
        <main className="container mx-auto px-4 py-8 flex flex-col flex-1">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-between mb-6 w-full"
          >
            <Button
              variant="ghost"
              onClick={handleBackToHome}
              className="text-envesto-gray-600 hover:text-envesto-navy"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <a href="/home" className="mx-auto">
              <h1 className="text-3xl font-bold text-envesto-navy">EnVesto AI</h1>
            </a>
            {/* Add an empty div to balance the layout */}
            <div className="w-[106px]"></div>
          </motion.div>

          {/* Full Chat Section */}
          <div className="flex-1 rounded-2xl overflow-hidden shadow-lg border border-envesto-gray-200">
            <iframe
              src="https://cdn.botpress.cloud/webchat/v3.2/shareable.html?configUrl=https://files.bpcontent.cloud/2025/08/26/13/20250826133651-4JSQGH2N.json"
              className="w-full h-[80vh]"
              style={{ border: "none" }}
              title="EnVesto AI Chatbot"
            />
          </div>
        </main>
      </PageTransition>
    </div>
  )
}
