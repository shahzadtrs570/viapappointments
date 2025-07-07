/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCookiesFromContext } from "./getCookiesFromContext"
import { getEmailLanguage } from "./getEmailLanguage"
import { loadEmailTranslations } from "./loadEmailTranslations"

/**
 * Simple translation function for email templates
 * @param key Translation key
 * @param namespace Translation namespace/file
 * @param variables Variables to interpolate
 * @param cookieString Optional cookie string to determine language
 * @returns Translated string with variables interpolated
 */
export function translate(
  key: string,
  namespace: string,
  variables: Record<string, any> = {},
  cookieString?: string
): string {
  // Try to get cookies from context if not provided
  const cookies = cookieString || getCookiesFromContext()
  // Get the language from cookies or use default
  const language = getEmailLanguage(cookies)

  // Load translations for the namespace
  const translations = loadEmailTranslations(language, namespace)

  // Get the translation or fall back to the key itself
  let translation = translations[key] || key

  // Replace variables in the translation
  Object.entries(variables).forEach(([varName, value]) => {
    translation = translation.replace(
      new RegExp(`{{${varName}}}`, "g"),
      String(value)
    )
  })

  return translation
}

/**
 * Create a translator function for a specific namespace
 * @param namespace Translation namespace/file
 * @param cookieString Optional cookie string to determine language
 * @returns Translator function
 */
export function createTranslator(namespace: string, cookieString?: string) {
  return (key: string, variables: Record<string, any> = {}) => {
    return translate(key, namespace, variables, cookieString)
  }
}
