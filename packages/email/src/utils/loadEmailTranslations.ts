import fs from "fs"
import path from "path"

/**
 * Load translations for email templates
 * @param language Language code (en, fr, it)
 * @param namespace The translation file name without extension
 * @returns Translation object or null if not found
 */
export function loadEmailTranslations(
  language: string,
  namespace: string
): Record<string, string> {
  try {
    // Get the base directory of the email package using a more reliable approach
    const baseDir = path.join(
      process.cwd(),
      "..",
      "..",
      "packages",
      "email",
      "locales"
    )
    // Construct the path to the translation file
    const filePath = path.join(baseDir, language, `${namespace}.json`)

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      // If language file doesn't exist, try to fall back to English
      if (language !== "en") {
        return loadEmailTranslations("en", namespace)
      }
      // If English file doesn't exist either, return empty object
      return {}
    }

    // Read and parse the translation file
    const content = fs.readFileSync(filePath, "utf8")
    return JSON.parse(content)
  } catch (error) {
    console.error(
      `Error loading email translations for ${language}/${namespace}:`,
      error
    )

    // Try to fall back to English if another language failed
    if (language !== "en") {
      return loadEmailTranslations("en", namespace)
    }

    // Return empty object if all else fails
    return {}
  }
}
