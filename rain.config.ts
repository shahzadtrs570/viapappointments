/**
 * SEO Configuration for Rain SaaS Template
 * This file serves as a central place for all SEO-related settings including:
 * - Search engine crawling rules
 * - Sitemap generation settings
 * - Robots.txt configuration
 * - Feature flag integration
 * - Site metadata
 */

import { featureFlags } from "./packages/utils/src/constants/featureFlags"

// Type for feature flag keys to ensure type safety
type FeatureFlagKey = keyof typeof featureFlags

// Core configuration types
/**
 * Defines rules for URL crawling
 * Used to control which paths are crawlable based on either
 * boolean values or feature flags
 */
export interface CrawlRule {
  path: string // URL path to check
  enabled: boolean | FeatureFlagKey // Can be either boolean or a feature flag
}

/**
 * Basic site information used for SEO metadata
 * Includes required fields for site identity and optional social links
 */
export interface SiteConfig {
  name: string // Site name for meta tags
  description: string // Site description for meta tags
  domain: string // Site domain for canonical URLs
  author: string // Author for meta tags
  // Optional social links for social meta tags
  github?: string
  twitter?: string
  linkedin?: string
}

/**
 * Configuration for web crawlers
 * Controls how search engines and bots can crawl your site
 */
export interface CrawlerConfig {
  rules: CrawlRule[] // List of path-specific crawling rules
  allowAIBots: boolean // Master switch for AI bot access
  excludedPaths: string[] // Global paths to exclude from crawling
}

/**
 * Sitemap configuration for XML sitemap generation
 * Controls update frequencies and SEO priorities for different page types
 */
export interface SitemapConfig {
  // How often different types of pages are updated
  changeFrequencies: {
    home: "daily" | "weekly" | "monthly" // Homepage update frequency
    blog: "daily" | "weekly" | "monthly" // Blog posts update frequency
    docs: "daily" | "weekly" | "monthly" // Documentation update frequency
    legal: "daily" | "weekly" | "monthly" // Legal pages update frequency
    other: "daily" | "weekly" | "monthly" // Other pages update frequency
  }
  // SEO priorities for different page types (0.0 to 1.0)
  priorities: {
    home: number // Homepage (typically 1.0)
    blog: number // Blog posts (typically 0.8)
    docs: number // Documentation (typically 0.9)
    legal: number // Legal pages (typically 0.5)
    other: number // Other pages (typically 0.6)
  }
  // Core pages configuration with their specific settings
  corePages: Array<{
    path: string
    changeFrequency: "daily" | "weekly" | "monthly"
    priority: number
  }>
}

/**
 * Robots.txt configuration
 * Controls how different bots can access your site
 */
export interface RobotsConfig {
  defaultPolicy: {
    allow: string[] // Paths that can be crawled
    disallow: string[] // Paths that should not be crawled
  }
  aiBotsPolicy: {
    userAgents: string[] // List of AI bot user agents to control
    allow: string[] // Paths AI bots can access
    disallow: string[] // Paths AI bots cannot access
  }
}

/**
 * Email validation configuration
 * Controls which email addresses and domains are allowed or blocked
 */
export interface EmailValidationConfig {
  allowedDomains: string[] // List of allowed email domains
  allowedEmails: string[] // List of specific allowed email addresses
  disallowedDomains: string[] // List of blocked email domains
  disallowedEmails: string[] // List of specific blocked email addresses
  enforceAllowList: boolean // If true, only allowed domains/emails can sign up
}

// Main configuration object
const config = {
  /**
   * Basic site information and metadata
   * Used for SEO meta tags and site identity
   */
  site: {
    name: "VIP Appointments",
    description: "VIP Appointments",
    domain: process.env.NEXT_PUBLIC_APP_URL || "localhost:3000",
    author: "Shahzad Safdar",
    github: "https://github.com/yourusername",
    twitter: "https://twitter.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
  } as SiteConfig,

  flags: {
    showRecommendedSolicitors: false,
  },

  company: {
    users: [
      {
        email: "shahzadbusiness96@gmail.com",
      },
    ],
    domains: [
      {
        domain: "vipappointments.com",
      },
      
    ],
  },

  /**
   * Email validation configuration
   * Controls which email addresses can register/sign in
   */
  emailValidation: {
    // Allowed email domains
    allowedDomains: [
      // Development and preview domains
      "localhost:3000",
      
    ],

    // Specific allowed email addresses
    allowedEmails: [
      // Team members
      "shahzadbusiness96@gmail.com",

      // Add more team members or beta testers here
    ],

    // Blocked domains (e.g. competitors or spam domains)
    disallowedDomains: ["competitor.com", "spam-domain.com"],

    // Blocked specific email addresses
    disallowedEmails: ["spam@gmail.com", "unwanted@gmail.com"],

    // If true, only emails from allowedDomains and allowedEmails can sign up
    enforceAllowList: false,
  } as EmailValidationConfig,

  /**
   * Crawler configuration
   * Controls which parts of your site can be crawled
   */
  crawler: {
    rules: [
      // Feature flag controlled sections (if enabled, they will be included in the sitemap and robots.txt)
      { path: "/blog", enabled: false }, // Enable blog visibility
      { path: "/docs", enabled: false }, // Enable docs visibility
      { path: "/waitlist", enabled: false }, // Enable waitlist visibility
      { path: "/surveys", enabled: false }, // Enable surveys visibility
      { path: "/", enabled: true }, // Explicitly enable root path

      // Protected sections (always disabled for crawling)
      { path: "/signin", enabled: false },
      { path: "/signup", enabled: false },
      { path: "/dashboard", enabled: false },
      { path: "/admin", enabled: false },
      { path: "/api", enabled: false },
    ],
    allowAIBots: false, // Global switch for AI bot access
    excludedPaths: [
      "/_next/*", // Next.js system files
      "/*.json", // JSON data files
      "/cdn-cgi/*", // Cloudflare system files
      "/*?preview=*", // Preview pages
      "/*?draft=*", // Draft content
      "/reset-password", // Authentication pages
      "/verify-email", // Authentication pages
    ],
  } as CrawlerConfig,

  /**
   * Sitemap configuration
   * Controls XML sitemap generation
   */
  sitemap: {
    // Update frequencies for different content types
    changeFrequencies: {
      home: "daily", // Homepage updates frequently
      blog: "weekly", // Blog content updates weekly
      docs: "weekly", // Documentation updates weekly
      legal: "monthly", // Legal pages rarely change
      other: "monthly", // Other pages update monthly
    },
    // SEO priorities (0.0 to 1.0)
    priorities: {
      home: 1.0, // Homepage (highest priority)
      blog: 0.8, // Blog posts (high priority)
      docs: 0.9, // Documentation (very high priority)
      legal: 0.5, // Legal pages (lower priority)
      other: 0.6, // Other pages (medium priority)
    },
    // Core pages with their specific configurations that are always by default included in the sitemap if they are enabled in the crawler config
    corePages: [
      { path: "/", changeFrequency: "daily", priority: 1.0 }, // Homepage
      { path: "/contact", changeFrequency: "monthly", priority: 0.7 }, // Contact page
      { path: "/about", changeFrequency: "monthly", priority: 0.6 }, // About page
    ],
  } as SitemapConfig,

  /**
   * Robots.txt configuration
   * Controls bot access to your site
   */
  robots: {
    defaultPolicy: {
      allow: [], // Allow marketing site paths
      disallow: [
        // Protect sensitive paths
        "/*",
      ],
    },
    aiBotsPolicy: {
      userAgents: ["GPTBot", "CCBot", "ChatGPT-User"], // Known AI bot user agents
      allow: [], // No specific allows for AI bots
      disallow: ["/*"], // Block all paths for AI bots by default
    },
  } as RobotsConfig,
}

/**
 * Helper function to determine if a URL should be crawled
 * @param url - The URL to check
 * @returns boolean - Whether the URL should be crawled
 */
export function shouldCrawlUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    const path = urlObj.pathname

    // First check excluded paths
    for (const excludedPath of config.crawler.excludedPaths) {
      if (excludedPath.endsWith("*")) {
        // Handle wildcard paths
        if (path.startsWith(excludedPath.slice(0, -1))) return false
      } else if (path === excludedPath) {
        // Handle exact matches
        return false
      }
    }

    // Then check crawler rules
    for (const rule of config.crawler.rules) {
      if (path.startsWith(rule.path)) {
        // Handle boolean rules
        if (typeof rule.enabled === "boolean") {
          return rule.enabled
        }
        // Handle feature flag controlled paths
        const flagValue = featureFlags[rule.enabled]
        return typeof flagValue === "boolean" ? flagValue : false
      }
    }

    return true // Allow by default if no rules match
  } catch {
    return true // Allow if URL parsing fails
  }
}

export default config
