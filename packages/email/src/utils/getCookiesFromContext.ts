/* eslint-disable @typescript-eslint/no-var-requires */

export function getCookiesFromContext(): string | undefined {
  try {
    // Try to import Next.js cookies helper
    // This will only work in a Next.js server context
    const { cookies } = require("next/headers")
    return cookies().toString()
  } catch (error) {
    // Not in a Next.js context or headers not available
    return undefined
  }
}
