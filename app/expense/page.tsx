"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/header"
import ExpenseTable from "@/components/expense-table"
import { ArrowLeft, TrendingDown, TrendingUp, Percent, Trash2 } from "lucide-react"
import { PageTransition } from "@/components/page-transition"
import { motion } from "framer-motion"
import { ExpenseList, getExpenseLists, deleteExpenseList } from "@/lib/expense"
import { format } from "date-fns"

const staggerDelay = 0.1
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 }
}

export default function ExpensePage() {
  const [totalExpense, setTotalExpense] = useState<number | null>(null)
  const [showSummary, setShowSummary] = useState(false)
  const [expenseLists, setExpenseLists] = useState<ExpenseList[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user, userData } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const loadExpenseLists = async () => {
      if (!user) {
        setIsLoading(false)
        router.push('/login')
        return;
      }

      setIsLoading(true);
      try {
        const lists = await getExpenseLists(user.uid)
        setExpenseLists(lists)
      } catch (error: any) {
        console.error('Failed to load expense lists:', error)
        if (typeof error === 'object' && error !== null && 'message' in error) {
          if (error.message.includes('Permission denied') || 
              error.message.includes('PERMISSION_DENIED')) {
            router.push('/login')
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadExpenseLists()
  }, [user, router])

  // Use user's actual income or fallback to 20000
  const avgMonthlyIncome = userData?.avgMonthlyIncome || 20000

  const handleCalculate = (total: number) => {
    setTotalExpense(total)
    setShowSummary(true)
  }

  const expensePercentage = totalExpense ? (totalExpense / avgMonthlyIncome) * 100 : 0
  const remainingMoney = avgMonthlyIncome - (totalExpense || 0)
  const isNegative = remainingMoney < 0

  const handleBackToHome = () => {
    router.push("/home")
  }

  return (
    <div className="min-h-screen bg-envesto-gray-50 dark:bg-neutral-800">
      <Header />
      <PageTransition>
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Page Header */}
          <motion.div 
            initial={fadeInUp.initial}
            animate={fadeInUp.animate}
            transition={{ delay: staggerDelay }}
            className="flex items-center gap-4 mb-8"
          >
            <Button variant="ghost" onClick={handleBackToHome} className="text-envesto-gray-600 dark:text-neutral-300 hover:text-envesto-navy dark:hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-3xl font-bold text-envesto-navy dark:text-neutral-100">Expense Calculator</h1>
          </motion.div>

          {/* Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Expense Table Column */}
            <motion.div 
              initial={fadeInUp.initial}
              animate={fadeInUp.animate}
              transition={{ delay: staggerDelay * 2 }}
              className="lg:col-span-2"
            >
              <ExpenseTable onCalculate={handleCalculate} />

              {/* Saved Expense Lists */}
              {!isLoading && expenseLists.length > 0 && (
                <motion.div
                  initial={fadeInUp.initial}
                  animate={fadeInUp.animate}
                  transition={{ delay: staggerDelay * 3 }}
                  className="mt-8"
                >
                  <Card className="dark:bg-neutral-900 dark:border-neutral-700">
                    <CardHeader>
                      <CardTitle className="text-envesto-navy dark:text-neutral-100">Saved Expense Lists</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {expenseLists.map((list) => (
                          <Card key={list.id} className="p-4 dark:bg-neutral-900 dark:border-neutral-700">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm text-envesto-gray-600 dark:text-neutral-400">
                                  {format(list.timestamp, 'PPp')}
                                </p>
                                <p className="text-lg font-semibold text-envesto-navy dark:text-neutral-100 mt-1">
                                  Total: ₹{list.totalAmount.toFixed(2)}
                                </p>
                                <div className="mt-2 space-y-1">
                                  {list.items.map((item, index) => (
                                    <p key={index} className="text-sm text-envesto-gray-600 dark:text-neutral-400">
                                      {item.name} (₹{item.price} × {item.quantity})
                                    </p>
                                  ))}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  if (user) {
                                    deleteExpenseList(user.uid, list.id)
                                      .then(() => {
                                        setExpenseLists(lists => 
                                          lists.filter(l => l.id !== list.id)
                                        )
                                      })
                                      .catch(console.error)
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-envesto-gray-600 dark:text-neutral-400 hover:text-red-500" />
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>

            {/* Summary Column */}
            <motion.div
              initial={fadeInUp.initial}
              animate={fadeInUp.animate}
              transition={{ delay: staggerDelay * 3 }}
              className="space-y-4"
            >
              {showSummary ? (
                <motion.div
                  initial={fadeInUp.initial}
                  animate={fadeInUp.animate}
                  transition={{ delay: staggerDelay * 4 }}
                >
                  <Card className="sticky top-4 border-envesto-gray-200 dark:border-neutral-700 dark:bg-neutral-900">
                    <CardHeader>
                      <CardTitle className="text-envesto-navy dark:text-neutral-100">Expense Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <p className="text-sm text-envesto-gray-600 dark:text-neutral-400">Total Expenses</p>
                        <p className="text-2xl font-bold text-envesto-navy dark:text-neutral-100">₹{totalExpense?.toFixed(2) || '0.00'}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-envesto-gray-600 dark:text-neutral-400">Monthly Income</p>
                        <p className="text-2xl font-bold text-envesto-teal">₹{avgMonthlyIncome.toFixed(2)}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-envesto-gray-600 dark:text-neutral-400">Expense Percentage</p>
                        <div className="flex items-center gap-2">
                          <Percent className="h-5 w-5 text-envesto-gray-400" />
                          <p className="text-xl font-bold text-envesto-navy dark:text-neutral-100">{expensePercentage.toFixed(1)}%</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-envesto-gray-600 dark:text-neutral-400">Remaining Amount</p>
                        <div className="flex items-center gap-2">
                          {isNegative ? (
                            <TrendingDown className="h-5 w-5 text-red-500" />
                          ) : (
                            <TrendingUp className="h-5 w-5 text-green-500" />
                          )}
                          <p className={`text-xl font-bold ${isNegative ? 'text-red-500' : 'text-green-500'}`}>
                            ₹{Math.abs(remainingMoney).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Financial Advice */}
                      <div className="p-4 bg-envesto-teal/10 dark:bg-envesto-teal/20 rounded-lg border border-envesto-teal/20">
                        <h4 className="font-semibold text-envesto-navy dark:text-neutral-100 mb-2">💡 Financial Tip</h4>
                        <p className="text-sm text-envesto-gray-700 dark:text-neutral-200 leading-relaxed">
                          {expensePercentage > 80
                            ? "Consider reducing expenses or finding additional income sources."
                            : expensePercentage > 50
                              ? "You're spending a significant portion of your income. Consider budgeting."
                              : "Great job! You're maintaining healthy spending habits."}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  initial={fadeInUp.initial}
                  animate={fadeInUp.animate}
                  transition={{ delay: staggerDelay * 4 }}
                >
                  <Card className="sticky top-4 border-envesto-gray-200 dark:border-neutral-700 dark:bg-neutral-900">
                    <CardHeader>
                      <CardTitle className="text-envesto-navy dark:text-neutral-100">Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-envesto-gray-500 dark:text-neutral-400">
                        <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="leading-relaxed">
                          Add expense items and click "Calculate Total" to see your summary.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          </div>
        </main>
      </PageTransition>
    </div>
  )
}
