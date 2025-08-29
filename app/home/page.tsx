"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/header"
import { Calculator, Bot, TrendingUp, Shield, Clock, Target } from "lucide-react"
import { PageTransition } from "@/components/page-transition"
import { motion } from "framer-motion"

const staggerDelay = 0.1
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 }
}

interface NewsItem {
  title: string
  link: string
  pubDate: string
  source: string
}

export default function HomePage() {
  const router = useRouter()
  const { user, userData } = useAuth()
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])

  const handleExpenseCalculator = () => {
    router.push("/expense")
  }

  const handleEnvestoAI = () => {
    router.push("/ai")
  }

  const handleStocks = () => {
    router.push("/stocks")
  }

  const problemSolutions = [
    {
      icon: <TrendingUp className="h-8 w-8 text-envesto-teal" />,
      title: "Variable Income Management",
      description: "Track and plan your finances even with irregular gig work income patterns.",
    },
    {
      icon: <Shield className="h-8 w-8 text-envesto-teal" />,
      title: "Financial Security",
      description: "Build emergency funds and investment strategies tailored for gig workers.",
    },
    {
      icon: <Clock className="h-8 w-8 text-envesto-teal" />,
      title: "Real-time Expense Tracking",
      description: "Monitor your spending habits and get instant insights on your financial health.",
    },
    {
      icon: <Target className="h-8 w-8 text-envesto-teal" />,
      title: "Smart Investment Goals",
      description: "Set and achieve investment targets that align with your variable income schedule.",
    },
  ]

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/api/news")
        const data = await response.json()

        if (!data.contents) {
          throw new Error("No news data received")
        }

        const parser = new DOMParser()
        const xml = parser.parseFromString(data.contents, "text/xml")
        const items = xml.querySelectorAll("item")

        const parsedNews: NewsItem[] = Array.from(items).map((item) => ({
          title: item.querySelector("title")?.textContent || "No title",
          link: item.querySelector("link")?.textContent || "#",
          pubDate: item.querySelector("pubDate")?.textContent || "",
          source: "MarketWatch",
        }))

        setNewsItems(parsedNews.slice(0, 5))
      } catch (err) {
        console.error("Error fetching news:", err)
        setNewsItems([
          {
            title: "⚠️ Failed to load live news",
            link: "#",
            pubDate: new Date().toISOString(),
            source: "EnVesto",
          },
        ])
      }
    }

    fetchNews()
  }, [])

  return (
    <div className="min-h-screen bg-envesto-gray-50 dark:bg-neutral-800">
      <Header />

      <PageTransition>
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {(userData?.name || user?.displayName) && (
              <div className="mb-8 text-center">
                <p className="text-envesto-gray-600">Welcome back,</p>
                <h2 className="text-2xl font-semibold text-envesto-navy">
                  {userData?.name || user?.displayName?.split('@')[0]}!
                </h2>
              </div>
            )}
          </motion.div>

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-envesto-navy dark:text-neutral-100 mb-4">EnVesto</h1>
            <p className="text-xl md:text-2xl text-envesto-gray-600 dark:text-neutral-300 mb-8">Earn and Invest</p>

            {/* Company Mission */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-4xl mx-auto mb-12"
            >
              <p className="text-base md:text-lg text-envesto-gray-700 dark:text-neutral-300 leading-relaxed">
                Empowering gig workers and variable-income earners with smart financial tools. We understand the unique
                challenges of irregular income and provide personalized solutions to help you build wealth, manage
                expenses, and secure your financial future.
              </p>
            </motion.div>

            {/* Main CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Button
                onClick={handleExpenseCalculator}
                size="lg"
                className="bg-envesto-teal hover:bg-envesto-teal/90 text-white px-8 py-4 text-lg transition-all duration-200 hover:shadow-lg border-2 border-transparent dark:border-envesto-teal/70"
              >
                <Calculator className="mr-2 h-5 w-5" />
                Expense Calculator
              </Button>
              <Button
                onClick={handleEnvestoAI}
                size="lg"
                variant="outline"
                className="border-2 border-envesto-teal dark:border-envesto-teal text-envesto-teal hover:bg-envesto-teal hover:text-white px-8 py-4 text-lg bg-transparent transition-all duration-200 hover:shadow-lg"
              >
                <Bot className="mr-2 h-5 w-5" />
                EnVesto AI
              </Button>
              <Button
                onClick={handleStocks}
                size="lg"
                variant="outline"
                className="border-2 border-envesto-teal dark:border-envesto-teal text-envesto-teal hover:bg-envesto-teal hover:text-white px-8 py-4 text-lg bg-transparent transition-all duration-200 hover:shadow-lg"
              >
                Live Stocks
              </Button>
            </motion.div>
          </motion.div>

          {/* Problem-Solution Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {problemSolutions.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + (index * 0.1) }}
              >
                <Card
                  className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-envesto-gray-200 dark:border-neutral-700 dark:bg-neutral-900"
                >
                  <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-3">{item.icon}</div>
                    <CardTitle className="text-lg text-envesto-navy dark:text-neutral-100">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-envesto-gray-600 dark:text-neutral-400 leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Stock Market News */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16"
          >
            <div className="mb-6 text-center">
              <h2 className="text-2xl md:text-3xl font-semibold text-envesto-navy dark:text-neutral-100">Latest Market News</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.6 + (index * 0.08) }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-envesto-gray-200 dark:border-neutral-700 dark:bg-neutral-900">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base md:text-lg text-envesto-navy dark:text-neutral-100 line-clamp-2">
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {item.title}
                        </a>
                      </CardTitle>
                      <CardDescription className="text-envesto-gray-500 dark:text-neutral-400 text-sm">
                        {item.source} • {new Date(item.pubDate).toLocaleString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-envesto-teal hover:underline"
                      >
                        Read more
                      </a>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </main>
      </PageTransition>
    </div>
  )
}
