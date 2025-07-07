/* eslint-disable max-lines */
/* eslint-disable max-depth */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/require-await */

import * as cheerio from "cheerio"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { shouldCrawlUrl } from "./config"
import versionData from "../../../../public/version.json"

// Cache configuration
const LLMS_CACHE_PREFIX =
  process.env.NEXT_PUBLIC_LLMS_CACHE_PREFIX || "llms_content"
const CACHE_DURATION = 24 * 60 * 60 * 1000

// Feature flag for caching (default to true in production, false in development)
const ENABLE_CACHE = true

// In-memory cache map
type CacheEntry = {
  content: string
  version: string
  timestamp: string
  cachedAt: number
}

const contentCache = new Map<string, CacheEntry>()

// Add timeout configuration
const FETCH_TIMEOUT = 30000 // 30 seconds
const MAX_RETRIES = 2 // Number of retries for failed fetches

// Helper function to get base URL based on environment
function getBaseUrl(domain: string): string {
  const isLocalhost =
    domain.includes("localhost") || domain.includes("127.0.0.1")
  const protocol = isLocalhost ? "http" : "https"
  return `${protocol}://${domain}`
}

// Helper function to get cache key
function getCacheKey(domain: string, path: string): string {
  const env = process.env.NODE_ENV || "development"
  return `${LLMS_CACHE_PREFIX}:${env}:${domain}:${path}`
}

// Helper function to check if cache is valid
function isCacheValid(cacheEntry: CacheEntry): boolean {
  // If caching is disabled, always return false
  if (!ENABLE_CACHE) {
    return false
  }

  // Check if the version matches
  if (cacheEntry.version !== versionData.version) {
    return false
  }

  // Check if the deployment timestamp is newer
  if (new Date(cacheEntry.timestamp) < new Date(versionData.timestamp)) {
    return false
  }

  // Check if the cache has expired
  const age = Date.now() - cacheEntry.cachedAt
  if (age > CACHE_DURATION) {
    return false
  }

  return true
}

// Helper function to clean text content
function cleanText(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .replace(/\n+/g, "\n")
    .replace(/[^\x20-\x7E]/g, "") // Remove non-ASCII characters
    .replace(/\s+/g, " ") // Additional pass to clean up any remaining whitespace
    .trim()
}

// Helper function to extract text content from HTML
function extractTextContent(element: cheerio.Cheerio): string {
  return cleanText(element.clone().children().remove().end().text())
}

// Helper function to get absolute URL
function getAbsoluteUrl(baseUrl: string, path: string): string {
  try {
    const url = new URL(path, baseUrl)
    // Remove trailing slashes, hash fragments, and UTM parameters for consistency
    return url
      .toString()
      .replace(/\/$/, "")
      .replace(/#.*$/, "")
      .replace(/[?&]utm_[^&]*(&)?/g, "$1")
      .replace(/\?$/, "")
  } catch {
    return path
  }
}

// Helper function to extract meta tags
function extractMetaTags($: cheerio.Root): string {
  const metaTags: Record<string, string> = {}

  // Extract title first
  const title = $("title").text()
  if (title) {
    metaTags["title"] = cleanText(title)
  }

  // Extract description next
  const description = $('meta[name="description"]').attr("content")
  if (description) {
    metaTags["description"] = cleanText(description)
  }

  // Extract canonical URL
  const canonical = $('link[rel="canonical"]').attr("href")
  if (canonical) {
    metaTags["canonical"] = canonical
  }

  // Extract other meta tags
  $("meta").each((_, meta) => {
    const name = $(meta).attr("name") || $(meta).attr("property")
    const content = $(meta).attr("content")
    if (name && content) {
      const cleanContent = cleanText(content)
      if (name.startsWith("og:")) {
        metaTags[`OpenGraph ${name.slice(3)}`] = cleanContent
      } else if (name.startsWith("twitter:")) {
        metaTags[`Twitter ${name.slice(8)}`] = cleanContent
      } else if (!["viewport", "format-detection"].includes(name)) {
        // Skip technical meta tags
        metaTags[name] = cleanContent
      }
    }
  })

  // Format meta tags in a consistent order
  const order: Record<string, number> = {
    title: 1,
    description: 2,
    canonical: 3,
  }
  return Object.entries(metaTags)
    .sort(([a], [b]) => {
      // Custom sort order: title, description, canonical, then alphabetical
      return (order[a] || 4) - (order[b] || 4) || a.localeCompare(b)
    })
    .map(([name, content]) => `${name}: ${content}`)
    .join("\n")
}

// Helper function to extract main content
function extractMainContent($: cheerio.Root, baseUrl: string): string {
  let content = ""
  const processedHeadings = new Set<string>()

  $("main, article, section, .content, #content").each((_, section) => {
    const headings = $(section).find("h1, h2, h3, h4, h5, h6")
    if (headings.length > 0) {
      headings.each((_, heading) => {
        const $heading = $(heading)
        const tagName = $heading.prop("tagName")?.toLowerCase() || ""
        const level = tagName ? parseInt(tagName[1]) : 1
        const title = cleanText($heading.text())

        // Skip duplicate headings
        const headingKey = `${level}:${title}`
        if (title && !processedHeadings.has(headingKey)) {
          processedHeadings.add(headingKey)
          content += `${"#".repeat(level)} ${title}\n\n`

          // Get content until next heading
          let nextElement = $heading.next()
          let paragraphContent = ""

          while (
            nextElement.length &&
            !nextElement.is("h1, h2, h3, h4, h5, h6")
          ) {
            if (nextElement.is("p, ul, ol, pre, blockquote")) {
              const text = extractTextContent(nextElement)
              if (text) {
                paragraphContent += `${text}\n\n`
              }
            } else if (nextElement.is("a")) {
              const href = nextElement.attr("href")
              const text = cleanText(nextElement.text())
              if (href && text) {
                paragraphContent += `[${text}](${getAbsoluteUrl(baseUrl, href)})\n\n`
              }
            }
            nextElement = nextElement.next()
          }

          if (paragraphContent) {
            content += paragraphContent
          }
        }
      })
    }
  })

  return content
}

// Helper function to extract navigation links
function extractNavLinks($: cheerio.Root, url: string): string[] {
  const navLinks = new Map<string, string>()

  // Find all navigation elements and their links
  $("nav a, header a, .navigation a, .menu a").each((_, link) => {
    const $link = $(link)
    const href = $link.attr("href")
    if (!href) return

    // Skip anchor links, javascript: links, and external links
    if (href.startsWith("#") || href.startsWith("javascript:")) return
    if (href.startsWith("http") && !href.includes(new URL(url).hostname)) return

    const text = cleanText($link.text())
    if (!text) return // Skip empty text

    const absoluteUrl = getAbsoluteUrl(url, href)

    // Only add if we don't already have this URL or if the new text is "better"
    if (
      !navLinks.has(absoluteUrl) ||
      text.length > navLinks.get(absoluteUrl)!.length
    ) {
      navLinks.set(absoluteUrl, text)
    }
  })

  // Convert Map to array of formatted links
  return Array.from(navLinks).map(([href, text]) => `- [${text}](${href})`)
}

// Helper function to extract cookie and privacy content
function extractCookieContent($: cheerio.Root): string {
  let content = ""

  // Look for cookie consent elements
  $(
    '[class*="cookie"], [id*="cookie"], [class*="consent"], [id*="consent"], [class*="privacy"], [id*="privacy"]'
  ).each((_, element) => {
    const text = cleanText($(element).text())
    if (text && text.toLowerCase().includes("cookie")) {
      content += `${text}\n\n`
    }
  })

  return content
}

// Helper function to extract forms
function extractForms($: cheerio.Root, url: string): string {
  let content = ""

  $("form").each((_, form) => {
    const $form = $(form)
    const action = $form.attr("action")
    const method = $form.attr("method")?.toUpperCase() || "GET"

    content += `### Form (${method}${action ? ` → ${getAbsoluteUrl(url, action)}` : ""})\n\n`

    $form.find("input, select, textarea").each((_, field) => {
      const $field = $(field)
      const type = $field.attr("type") || $field.prop("tagName").toLowerCase()
      const name = $field.attr("name")
      const placeholder = $field.attr("placeholder")

      if (name) {
        content += `- ${type}${placeholder ? ` (${placeholder})` : ""}: ${name}\n`
      }
    })

    content += "\n"
  })

  return content
}

// Add retry helper function
async function fetchWithRetry(
  url: string,
  retries = MAX_RETRIES
): Promise<string> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT)

    const response = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 0 }, // Disable Next.js cache for these requests
    })
    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.text()
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait 1 second before retry
      return fetchWithRetry(url, retries - 1)
    }
    throw error
  }
}

// Helper function to crawl a single page
async function crawlPage(
  url: string,
  html: string
): Promise<[string, Set<string>]> {
  try {
    // First check if this page should be crawled
    if (!shouldCrawlUrl(url)) {
      return ["", new Set()] // Return empty content and no links if page should be skipped
    }

    const $ = cheerio.load(html)
    let content = `\n# Page: ${url}\n\n`

    // Extract meta information
    const metaTags = extractMetaTags($)
    if (metaTags) {
      content += `## Meta Information\n\n${metaTags}\n\n`
    }

    // Extract cookie and privacy content (if any)
    const cookieContent = extractCookieContent($)
    if (cookieContent) {
      content += `## Cookie & Privacy Information\n\n${cookieContent}\n`
    }

    // Extract main content first (most important)
    const mainContent = extractMainContent($, url)
    if (mainContent) {
      content += `## Main Content\n\n${mainContent}\n`
    }

    // Handle images (deduplicated and with proper alt text)
    const images = new Set<string>()
    $("img").each((_, img) => {
      const $img = $(img)
      const alt = cleanText($img.attr("alt") || "")
      const src = $img.attr("src")
      if (src) {
        const imgUrl = getAbsoluteUrl(url, src)
        if (!images.has(imgUrl)) {
          images.add(imgUrl)
          content += `![${alt}](${imgUrl})\n\n`
        }
      }
    })

    // Extract navigation links (deduplicated)
    const navLinks = extractNavLinks($, url)
    if (navLinks.length > 0) {
      content += `## Navigation\n\n${navLinks.join("\n")}\n\n`
    }

    // Extract forms (if any)
    const formContent = extractForms($, url)
    if (formContent) {
      content += `## Forms\n\n${formContent}\n`
    }

    // Extract footer content
    $("footer").each((_, footer) => {
      const footerText = extractTextContent($(footer))
      if (footerText) {
        content += `## Footer\n\n${footerText}\n\n`
      }
    })

    // Extract structured data (if any)
    $('script[type="application/ld+json"]').each((_, script) => {
      try {
        const jsonLD = JSON.parse($(script).html() || "{}")
        if (Object.keys(jsonLD).length > 0) {
          content += `## Structured Data\n\n\`\`\`json\n${JSON.stringify(jsonLD, null, 2)}\n\`\`\`\n\n`
        }
      } catch {
        // Ignore invalid JSON
      }
    })

    // When gathering internal links, filter based on feature flags
    const internalLinks = new Set<string>()
    $("a").each((_, link) => {
      const href = $(link).attr("href")
      if (href) {
        try {
          const linkUrl = new URL(href, url)
          if (linkUrl.hostname === new URL(url).hostname) {
            const cleanUrl = getAbsoluteUrl(url, href)
            if (
              !cleanUrl.includes("/api/") &&
              !cleanUrl.includes("/cdn-cgi/") &&
              shouldCrawlUrl(cleanUrl)
            ) {
              internalLinks.add(cleanUrl)
            }
          }
        } catch {
          // Ignore invalid URLs
        }
      }
    })

    return [content, internalLinks]
  } catch (error) {
    console.error(`Error crawling ${url}:`, error)
    return [`\n# Error: ${url}\n\nFailed to crawl page\n\n`, new Set()]
  }
}

export async function GET(request: Request) {
  const headersList = headers()
  const domain = headersList.get("host") as string
  const baseUrl = getBaseUrl(domain)

  // Get the request path to differentiate between /api/llms and /llms.txt
  const path = new URL(request.url).pathname
  const cacheKey = getCacheKey(domain, path)

  try {
    // Check in-memory cache first (if enabled)
    if (ENABLE_CACHE) {
      const cachedData = contentCache.get(cacheKey)
      if (cachedData && isCacheValid(cachedData)) {
        return new NextResponse(cachedData.content, {
          headers: {
            "Content-Type": "text/plain",
            "X-Cache": "HIT",
            "X-Cache-Version": cachedData.version,
            "X-Cache-Time": new Date(cachedData.cachedAt).toISOString(),
            "X-Deploy-Time": cachedData.timestamp,
            "X-Cache-Enabled": "true",
          },
        })
      }
    } else {
      console.error("[LLMs] Caching disabled, skipping cache check")
    }

    // Start with the homepage
    const crawledPages = new Set<string>()
    const pagesToCrawl = new Set([baseUrl])
    let content = `# ${domain} llms.txt

`

    // Crawl pages (limit to 50 pages to prevent infinite crawling)
    const maxPages = 50
    while (pagesToCrawl.size > 0 && crawledPages.size < maxPages) {
      const url = pagesToCrawl.values().next().value
      if (!url) break

      pagesToCrawl.delete(url)

      if (!crawledPages.has(url) && shouldCrawlUrl(url)) {
        crawledPages.add(url)

        try {
          const html = await fetchWithRetry(url)

          // Process the page and get new links
          const [pageContent, internalLinks] = await crawlPage(url, html)
          if (pageContent) {
            content += pageContent
          }

          // Add new links to crawl queue
          internalLinks.forEach((link) => {
            if (!crawledPages.has(link)) {
              pagesToCrawl.add(link)
            }
          })
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error"
          console.error(`[LLMs] Failed to crawl ${url}:`, errorMessage)
          content += `\n# Error crawling ${url}: ${errorMessage}\n\n`

          // If it's a timeout or network error, maybe the server is busy
          if (
            error instanceof Error &&
            (error.name === "AbortError" ||
              error.message.includes("fetch failed"))
          ) {
            content += `# Note: This might be temporary. Please try again later.\n\n`
          }
        }
      }
    }

    // Update in-memory cache if enabled
    if (ENABLE_CACHE) {
      contentCache.set(cacheKey, {
        content,
        version: versionData.version,
        timestamp: versionData.timestamp,
        cachedAt: Date.now(),
      })
    }

    const headers = {
      "Content-Type": "text/plain",
      "X-Cache": "MISS",
      "X-Cache-Version": versionData.version,
      "X-Cache-Time": new Date().toISOString(),
      "X-Deploy-Time": versionData.timestamp,
      "X-Cache-Enabled": ENABLE_CACHE.toString(),
    }

    // If this is the /llms.txt route, add cache control headers
    if (path === "/llms.txt") {
      Object.assign(headers, {
        "Cache-Control": "public, max-age=3600, must-revalidate",
        "Last-Modified": new Date(versionData.timestamp).toUTCString(),
      })
    }

    return new NextResponse(content, { headers })
  } catch (error) {
    console.error(`[LLMs] Error crawling website (${path}):`, error)
    return new NextResponse("Error crawling website content", {
      status: 500,
      headers: {
        "X-Cache": "ERROR",
        "X-Cache-Version": versionData.version,
        "X-Deploy-Time": versionData.timestamp,
        "X-Cache-Enabled": ENABLE_CACHE.toString(),
        "X-Error": error instanceof Error ? error.message : "Unknown error",
      },
    })
  }
}

export async function POST() {
  try {
    if (!ENABLE_CACHE) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Cache is disabled",
          version: versionData.version,
          timestamp: versionData.timestamp,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            "X-Cache-Enabled": "false",
          },
        }
      )
    }

    // Clear the entire cache
    const oldSize = contentCache.size
    contentCache.clear()

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: `Cleared ${oldSize} cache entries`,
        version: versionData.version,
        timestamp: versionData.timestamp,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "X-Cache-Enabled": "true",
        },
      }
    )
  } catch (error) {
    console.error("[LLMs] Error clearing cache:", error)
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        version: versionData.version,
        timestamp: versionData.timestamp,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "X-Cache-Enabled": ENABLE_CACHE.toString(),
        },
      }
    )
  }
}
