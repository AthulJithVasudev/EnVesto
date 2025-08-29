"use client"

import { useState } from "react"
import { ShoppingCart, User, Moon, Sun } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import DrawerProfile from "./drawer-profile"
import { useTheme } from "next-themes"

export default function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const handleCartClick = () => {
    router.push("/expense")
  }

  return (
    <>
      <header className="flex items-center justify-between p-4 bg-white dark:bg-neutral-900 shadow-sm border-b border-envesto-gray-100 dark:border-neutral-800">
        {/* Profile Icon - Left */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDrawerOpen(true)}
          className="rounded-full w-10 h-10 bg-envesto-gray-100 hover:bg-envesto-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors"
          aria-label="Open profile menu"
        >
          <User className="h-5 w-5 text-envesto-gray-600 dark:text-neutral-300" />
        </Button>

        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
          <a href="/home" className="flex items-center gap-2">
            <img src="/logo_1.svg" alt="EnVesto Logo" className="h-8 w-8" />
            <h1 className="text-lg font-bold text-envesto-navy dark:text-white">EnVesto</h1>
          </a>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full w-10 h-10 bg-envesto-gray-100 hover:bg-envesto-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors"
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 text-envesto-gray-600 dark:hidden" />
            <Moon className="h-5 w-5 text-neutral-300 hidden dark:block" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCartClick}
            className="rounded-full w-10 h-10 bg-envesto-gray-100 hover:bg-envesto-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors"
            aria-label="Go to expense calculator"
          >
            <ShoppingCart className="h-5 w-5 text-envesto-gray-600 dark:text-neutral-300" />
          </Button>
        </div>
      </header>

      {/* Profile Drawer */}
      <DrawerProfile isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  )
}
