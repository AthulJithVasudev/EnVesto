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
    <div className="min-h-screen bg-envesto-gray-50 dark:bg-neutral-900 flex flex-col">
      <Header />

      <PageTransition>
        <main className="container mx-auto px-4 py-10 flex flex-col flex-1">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-between mb-8 w-full"
          >
            <Button
              variant="ghost"
              onClick={handleBackToHome}
              className="text-envesto-gray-600 dark:text-gray-300 hover:text-envesto-navy dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>

            {/* Title */}
            <h1
              className="text-3xl font-extrabold tracking-tight mx-auto 
                         text-envesto-white:text-envesto-green"
            >
              EnVesto AI
            </h1>

            <div className="w-[120px]"></div>
          </motion.div>

          {/* Chat Section */}
          <div
            className="flex-1 rounded-2xl overflow-hidden shadow-2xl 
                       border border-envesto-gray-200 dark:border-neutral-700 
                       bg-white dark:bg-gradient-to-b 
                       dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900"
          >
            <iframe
              src="https://cdn.botpress.cloud/webchat/v3.2/shareable.html?configUrl=https://files.bpcontent.cloud/2025/08/26/13/20250826133651-4JSQGH2N.json"
              className="w-full h-[80vh] rounded-2xl"
              style={{ border: "none" }}
              title="EnVesto AI Chatbot"
            />
          </div>
        </main>
      </PageTransition>
    </div>
  )
}
