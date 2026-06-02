import { NextRequest, NextResponse } from 'next/server'
import { detectSourceType } from '@/lib/utils'

function extractOgTag(html: string, property: string): string | null {
  const match = html.match(
    new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']+)["']`, 'i')
  ) || html.match(
    new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*property=["']${property}["']`, 'i')
  )
  return match ? match[1] : null
}

function cleanText(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

// Try to extract a restaurant name from a caption/title string
// Looks for "@restaurant" mentions, location tags, or first meaningful line
function guessNameFromText(text: string): string | null {
  // Instagram location tag pattern: often "Username at Place Name"
  const atPattern = text.match(/\bat\s+([A-Z][^.\n@#]{3,40})/i)
  if (atPattern) return cleanText(atPattern[1])

  // @mention that could be a restaurant handle
  const handlePattern = text.match(/@([a-z0-9._]{3,30})/i)
  if (handlePattern) return cleanText(handlePattern[1].replace(/_/g, ' '))

  return null
}

export async function POST(request: NextRequest) {
  const { url } = await request.json()

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  const source_type = detectSourceType(url)

  // Try to fetch OpenGraph metadata from the URL
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        Accept: 'text/html,application/xhtml+xml',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) {
      // Blocked or login page — return partial result for manual fallback
      return NextResponse.json({
        success: false,
        source_type,
        message: 'Could not fetch page automatically. Please paste the caption below.',
      })
    }

    const html = await response.text()

    // Detect login/blocked pages (Instagram, TikTok often redirect to login)
    const isBlocked =
      html.includes('login') && html.includes('password') ||
      html.includes('Log in to continue') ||
      html.includes('Sign up to see') ||
      html.length < 2000

    if (isBlocked) {
      return NextResponse.json({
        success: false,
        source_type,
        message: 'Page requires login. Please paste the caption below.',
      })
    }

    const title = extractOgTag(html, 'og:title') || extractOgTag(html, 'twitter:title')
    const description = extractOgTag(html, 'og:description') || extractOgTag(html, 'twitter:description')

    const rawText = [title, description].filter(Boolean).join(' ')
    const guessedName = title ? guessNameFromText(cleanText(title)) : null

    return NextResponse.json({
      success: true,
      source_type,
      name: guessedName,
      raw: rawText ? cleanText(rawText) : null,
    })
  } catch {
    return NextResponse.json({
      success: false,
      source_type,
      message: 'Could not reach the URL. Please paste the caption below.',
    })
  }
}
