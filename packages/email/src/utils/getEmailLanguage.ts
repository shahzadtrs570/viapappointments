// Supported languages
const SUPPORTED_LANGUAGES = ["en", "fr", "it"]
const DEFAULT_LANGUAGE = "en"

/**
 * Simple cookie parser
 */
function parseCookies(cookieString?: string): Record<string, string> {
  if (!cookieString) return {}

  return cookieString
    .split(";")
    .map((pair) => pair.trim().split("="))
    .reduce(
      (acc, [key, value]) => {
        if (key && value) acc[key] = value
        return acc
      },
      {} as Record<string, string>
    )
}

/**
 * Gets the preferred language for emails based on cookies
 * Checks both dashboard and marketing cookies
 */
export function getEmailLanguage(cookieString?: string): string {
  const cookies = parseCookies(cookieString)

  // Check for i18next cookie from either dashboard or marketing
  const dashboardLang = cookies["i18next-dashboard"]

  if (dashboardLang && SUPPORTED_LANGUAGES.includes(dashboardLang)) {
    return dashboardLang
  }

  return DEFAULT_LANGUAGE
}
