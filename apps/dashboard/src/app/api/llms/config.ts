import { featureFlags } from "@/../../packages/utils/src/constants/featureFlags"

type FeatureFlagKey = keyof typeof featureFlags

// Interface for URL crawling rules
interface CrawlRule {
  path: string
  enabled: boolean | FeatureFlagKey
}

// Configuration for URL crawling
export const crawlRules: CrawlRule[] = [
  { path: "/blog", enabled: featureFlags.blog }, // Uses feature flag
  { path: "/docs", enabled: featureFlags.docs }, // Uses feature flag
  { path: "/pricing", enabled: false }, // Never crawl
  { path: "/signin", enabled: false }, // Never crawl
  { path: "/signup", enabled: false }, // Never crawl
  // Add more rules here as needed
  // Example: { path: '/some-path', featureFlag: 'someFeature' }
]

// Helper function to check if a URL should be crawled based on feature flags or explicit settings
export function shouldCrawlUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    const path = urlObj.pathname

    // Check each rule against the path
    for (const rule of crawlRules) {
      if (path.startsWith(rule.path)) {
        // If it's a boolean, use it directly
        if (typeof rule.enabled === "boolean") {
          return rule.enabled
        }
      }
    }

    return true // If no rules match, allow crawling by default
  } catch {
    return true // If URL parsing fails, allow crawling by default
  }
}
