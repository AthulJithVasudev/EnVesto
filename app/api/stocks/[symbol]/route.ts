export async function GET(
  _req: Request,
  { params }: { params: { symbol: string } }
) {
  const symbol = params.symbol?.toUpperCase()
  if (!symbol) {
    return new Response(JSON.stringify({ error: "Missing symbol" }), { status: 400 })
  }

  const apiKey = process.env.ALPHA_VANTAGE_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Server misconfigured" }), { status: 500 })
  }

  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${encodeURIComponent(
    symbol
  )}&interval=5min&apikey=${apiKey}`

  try {
    const res = await fetch(url, { next: { revalidate: 60 } })
    if (!res.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch data" }), { status: 502 })
    }
    const json = await res.json()

    if (json?.Note) {
      return new Response(
        JSON.stringify({ error: "Rate limit reached. Please try again in a minute." }),
        { status: 429 }
      )
    }
    if (json?.["Error Message"]) {
      return new Response(
        JSON.stringify({ error: "Invalid symbol or provider error." }),
        { status: 400 }
      )
    }

    const series = json["Time Series (5min)"]
    if (!series || typeof series !== "object") {
      return new Response(JSON.stringify({ error: "No intraday data available." }), { status: 502 })
    }

    const entries = Object.entries(series) as [string, any][]
    const points = entries
      .map(([time, ohlc]) => ({
        time,
        price: Number(ohlc["4. close"]) || Number(ohlc["4. close"]) || 0,
      }))
      .filter((p) => !Number.isNaN(p.price))
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())

    const latest = points[points.length - 1]
    const currentPrice = latest?.price ?? null

    return new Response(
      JSON.stringify({ symbol, currentPrice, prices: points }),
      { headers: { "content-type": "application/json" } }
    )
  } catch (e) {
    return new Response(JSON.stringify({ error: "Unexpected error" }), { status: 500 })
  }
}


