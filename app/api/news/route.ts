import { NextResponse } from "next/server"

export async function GET() {
  try {
    const rssUrl = "https://feeds.marketwatch.com/marketwatch/topstories/"
    const res = await fetch(rssUrl, { cache: "no-store" }) // disable caching

    if (!res.ok) throw new Error("Failed to fetch RSS feed")

    const xml = await res.text()
    return NextResponse.json({ contents: xml })
  } catch (err) {
    return NextResponse.json(
      { error: "Unable to load news" },
      { status: 500 }
    )
  }
}
