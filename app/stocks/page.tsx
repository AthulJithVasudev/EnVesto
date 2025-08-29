"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import StockChart from "@/components/stock-chart"

export default function StocksPage() {
  const [symbolInput, setSymbolInput] = useState<string>("AAPL")
  const [symbol, setSymbol] = useState<string>("AAPL")
  const router = useRouter()

  const submit = () => {
    const cleaned = symbolInput.trim().toUpperCase()
    if (cleaned) setSymbol(cleaned)
  }

  return (
    <div className="min-h-screen bg-envesto-gray-50 dark:bg-neutral-800">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            onClick={() => router.push("/home")}
            className="border-envesto-teal text-envesto-teal hover:bg-envesto-teal hover:text-white"
          >
            Back Home
          </Button>
          <div />
        </div>
        <h1 className="text-2xl font-semibold text-envesto-navy dark:text-neutral-100 text-center mb-6">Live Stock Prices</h1>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center mb-6">
          <Select value={symbolInput} onValueChange={(v) => setSymbolInput(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Popular symbols" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Popular</SelectLabel>
                <SelectItem value="AAPL">AAPL</SelectItem>
                <SelectItem value="MSFT">MSFT</SelectItem>
                <SelectItem value="GOOGL">GOOGL</SelectItem>
                <SelectItem value="AMZN">AMZN</SelectItem>
                <SelectItem value="TSLA">TSLA</SelectItem>
                <SelectItem value="NVDA">NVDA</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input
            value={symbolInput}
            onChange={(e) => setSymbolInput(e.target.value)}
            placeholder="Enter symbol e.g. AAPL, TSLA"
            className="max-w-xs bg-white dark:bg-neutral-900 dark:text-neutral-100"
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit()
            }}
          />
          <Button onClick={submit} className="bg-envesto-teal hover:bg-envesto-teal/90 text-white">Update</Button>
        </div>

        <StockChart symbol={symbol} />
      </main>
    </div>
  )
}


