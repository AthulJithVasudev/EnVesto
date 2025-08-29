"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

type PricePoint = { time: string; price: number }

export default function StockChart({ symbol }: { symbol: string }) {
  const [data, setData] = useState<PricePoint[]>([])
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [prevPrice, setPrevPrice] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const res = await fetch(`/api/stocks/${encodeURIComponent(symbol)}`)
      const json = await res.json()
      if (!res.ok) {
        throw new Error(json?.error || "Failed to fetch")
      }
      const prices: PricePoint[] = json.prices || []
      setData(prices)
      setPrevPrice(currentPrice)
      setCurrentPrice(json.currentPrice ?? null)
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load chart data.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    timerRef.current = setInterval(fetchData, 60000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol])

  const priceColor = useMemo(() => {
    if (currentPrice == null || prevPrice == null) return "text-envesto-navy dark:text-neutral-100"
    if (currentPrice > prevPrice) return "text-green-600"
    if (currentPrice < prevPrice) return "text-red-600"
    return "text-envesto-navy dark:text-neutral-100"
  }, [currentPrice, prevPrice])

  return (
    <Card className="border-envesto-gray-200 dark:border-neutral-700 dark:bg-neutral-900">
      <CardHeader className="pb-2">
        <CardTitle className="text-envesto-navy dark:text-neutral-100">{symbol} Price Chart</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <div className="text-red-600 dark:text-red-400 mb-3">{error}</div>}
        <div className="mb-4">
          {isLoading ? (
            <div className="text-envesto-gray-600 dark:text-neutral-400">Loading price…</div>
          ) : (
            <div>
              <div className={`text-3xl font-semibold ${priceColor}`}>
                {currentPrice != null ? currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "--"}
              </div>
              <div className="text-sm text-envesto-gray-600 dark:text-neutral-400 mt-1">
                {lastUpdated ? `Last updated: ${lastUpdated}` : ''}
              </div>
            </div>
          )}
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <XAxis dataKey="time" hide tick={false} />
              <YAxis domain={["auto", "auto"]} tickFormatter={(v) => String(v)} width={50} />
              <Tooltip formatter={(value) => (typeof value === 'number' ? value.toFixed(2) : value)} />
              <Line type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={2} dot={false} isAnimationActive={!isLoading} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}


