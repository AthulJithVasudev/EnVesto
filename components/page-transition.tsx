"use client"

import { motion } from "framer-motion"

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: "-100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "-100%" }}
      transition={{ 
        type: "spring",
        stiffness: 400,
        damping: 40,
        mass: 1
      }}
    >
      {children}
    </motion.div>
  )
}
