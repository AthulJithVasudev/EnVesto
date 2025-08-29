"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Phone, Briefcase, MapPin, IndianRupee, X, Clock, Calendar } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface DrawerProfileProps {
  isOpen: boolean
  onClose: () => void
}

const staggerDelay = 0.1
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 }
}

const DrawerProfile = ({ isOpen, onClose }: DrawerProfileProps) => {
  const { user, userData, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
      onClose()
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 400,
              damping: 40,
              mass: 1
            }}
            className="fixed left-0 top-0 h-full w-100 bg-white dark:bg-neutral-900 shadow-xl z-50"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <motion.div
                initial={fadeInUp.initial}
                animate={fadeInUp.animate}
                transition={{ delay: staggerDelay }}
                className="flex items-center justify-between p-4 border-b border-envesto-gray-100 dark:border-neutral-800"
              >
                <h2 className="text-xl font-bold text-envesto-navy dark:text-neutral-100">Profile</h2>
                <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close profile">
                  <X className="h-5 w-5" />
                </Button>
              </motion.div>

              {/* Profile Content */}
              <div className="flex-1 p-4 overflow-y-auto">
                <Card className="border-envesto-gray-100 dark:border-neutral-800 dark:bg-neutral-900">
                  <CardHeader className="text-center pb-2">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: staggerDelay * 2
                      }}
                      className="w-16 h-16 bg-envesto-teal rounded-full flex items-center justify-center mx-auto mb-2"
                    >
                      <User className="h-8 w-8 text-white" />
                    </motion.div>
                    <motion.div
                      initial={fadeInUp.initial}
                      animate={fadeInUp.animate}
                      transition={{ delay: staggerDelay * 3 }}
                    >
                      <CardTitle className="text-lg text-envesto-navy dark:text-neutral-100">
                        {userData?.name || userData?.displayName || user?.email?.split('@')[0] || "User Profile"}
                      </CardTitle>
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          delay: staggerDelay * 4,
                          type: "spring",
                          stiffness: 200
                        }}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"
                      >
                        Active Member
                      </motion.div>
                    </motion.div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Basic Info Section */}
                    <motion.div
                      initial={fadeInUp.initial}
                      animate={fadeInUp.animate}
                      transition={{ delay: staggerDelay * 5 }}
                      className="bg-envesto-gray-50 dark:bg-neutral-800 rounded-lg p-4"
                    >
                      <h3 className="text-sm font-semibold text-envesto-navy dark:text-neutral-100 mb-3 flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Basic Information
                      </h3>
                      <div className="space-y-3">
                        <motion.div
                          initial={fadeInUp.initial}
                          animate={fadeInUp.animate}
                          transition={{ delay: staggerDelay * 6 }}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-envesto-gray-500 dark:text-neutral-400" />
                            <span className="text-sm text-envesto-gray-600 dark:text-neutral-300">Email</span>
                          </div>
                          <span className="text-sm font-medium text-envesto-navy dark:text-neutral-100">{user?.email || 'Not added'}</span>
                        </motion.div>
                        <motion.div
                          initial={fadeInUp.initial}
                          animate={fadeInUp.animate}
                          transition={{ delay: staggerDelay * 7 }}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-envesto-gray-500 dark:text-neutral-400" />
                            <span className="text-sm text-envesto-gray-600 dark:text-neutral-300">Phone</span>
                          </div>
                          <span className="text-sm font-medium text-envesto-navy dark:text-neutral-100">
                            {userData?.phone || 'Not added'}
                          </span>
                        </motion.div>
                        <motion.div
                          initial={fadeInUp.initial}
                          animate={fadeInUp.animate}
                          transition={{ delay: staggerDelay * 8 }}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-envesto-gray-500 dark:text-neutral-400" />
                            <span className="text-sm text-envesto-gray-600 dark:text-neutral-300">Location</span>
                          </div>
                          <span className="text-sm font-medium text-envesto-navy dark:text-neutral-100">
                            {userData?.state || 'Not added'}
                          </span>
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Professional Info Section */}
                    <motion.div
                      initial={fadeInUp.initial}
                      animate={fadeInUp.animate}
                      transition={{ delay: staggerDelay * 9 }}
                      className="bg-envesto-gray-50 dark:bg-neutral-800 rounded-lg p-4"
                    >
                      <h3 className="text-sm font-semibold text-envesto-navy dark:text-neutral-100 mb-3 flex items-center">
                        <Briefcase className="h-4 w-4 mr-2" />
                        Professional Details
                      </h3>
                      <div className="space-y-3">
                        <motion.div
                          initial={fadeInUp.initial}
                          animate={fadeInUp.animate}
                          transition={{ delay: staggerDelay * 10 }}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm text-envesto-gray-600 dark:text-neutral-300">Occupation</span>
                          <span className="text-sm font-medium text-envesto-navy dark:text-neutral-100">
                            {userData?.job || 'Not added'}
                          </span>
                        </motion.div>
                        <motion.div
                          initial={fadeInUp.initial}
                          animate={fadeInUp.animate}
                          transition={{ delay: staggerDelay * 11 }}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm text-envesto-gray-600 dark:text-neutral-300">Monthly Income</span>
                          <span className="text-sm font-medium text-envesto-teal">
                            {userData?.avgMonthlyIncome 
                              ? `₹${userData.avgMonthlyIncome.toLocaleString()}`
                              : 'Not added'}
                          </span>
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Account Info Section */}
                    <motion.div
                      initial={fadeInUp.initial}
                      animate={fadeInUp.animate}
                      transition={{ delay: staggerDelay * 12 }}
                      className="bg-envesto-gray-50 dark:bg-neutral-800 rounded-lg p-4"
                    >
                      <h3 className="text-sm font-semibold text-envesto-navy dark:text-neutral-100 mb-3 flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Account Activity
                      </h3>
                      <div className="space-y-3">
                        <motion.div
                          initial={fadeInUp.initial}
                          animate={fadeInUp.animate}
                          transition={{ delay: staggerDelay * 13 }}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-envesto-gray-500 dark:text-neutral-400" />
                            <span className="text-sm text-envesto-gray-600 dark:text-neutral-300">Member since</span>
                          </div>
                          <span className="text-sm font-medium text-envesto-navy dark:text-neutral-100">
                            {userData?.createdAt 
                              ? new Date(userData.createdAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })
                              : 'N/A'}
                          </span>
                        </motion.div>
                        <motion.div
                          initial={fadeInUp.initial}
                          animate={fadeInUp.animate}
                          transition={{ delay: staggerDelay * 14 }}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-envesto-gray-500 dark:text-neutral-400" />
                            <span className="text-sm text-envesto-gray-600 dark:text-neutral-300">Last active</span>
                          </div>
                          <span className="text-sm font-medium text-envesto-navy dark:text-neutral-100">
                            {userData?.lastLogin
                              ? new Date(userData.lastLogin).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })
                              : 'N/A'}
                          </span>
                        </motion.div>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </div>

              {/* Logout Button */}
              <motion.div
                initial={fadeInUp.initial}
                animate={fadeInUp.animate}
                transition={{ delay: staggerDelay * 16 }}
                className="p-4 border-t border-envesto-gray-100 dark:border-neutral-800"
              >
                <Button onClick={handleLogout} variant="destructive" className="w-full">
                  Logout
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default DrawerProfile
