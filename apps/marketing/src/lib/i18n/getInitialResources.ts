/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, no-console */
import { createInstance } from "i18next"
import resourcesToBackend from "i18next-resources-to-backend"

import type { Resource } from "i18next"

import { defaultNS, getOptions, languages } from "./settings"

// Initialize a server-side i18next instance
const initI18next = async (
  lng: string,
  ns: string | string[]
): Promise<any> => {
  const i18nInstance = createInstance()
  await i18nInstance
    .use(
      resourcesToBackend(async (language: string, namespace: string) => {
        // Dynamically import the JSON files based on language and namespace
        // Assumes JSON files are in public/locales/[lng]/[ns].json
        try {
          return import(`../../../public/locales/${language}/${namespace}.json`)
        } catch (error) {
          console.error(
            `Failed to load server-side translation: ${language}/${namespace}`,
            error
          )
          // Return empty object or handle error as appropriate
          return {}
        }
      })
    )
    .init(getOptions(lng, ns)) // Use getOptions for consistency
  return i18nInstance
}

// Utility function to get initial resources for the client provider
export async function getInitialResources(
  lng: string,
  ns: string | string[] = ["common"] // Default to 'common' namespace
): Promise<Resource> {
  const i18nInstance = await initI18next(lng, ns)
  // Extract the loaded resources
  const resources = languages.reduce((acc, language) => {
    acc[language] = {}
    ;(Array.isArray(ns) ? ns : [ns]).forEach((namespace) => {
      acc[language][namespace] =
        i18nInstance.getResourceBundle(language, namespace) || {}
    })
    return acc
  }, {} as Resource)

  return resources
}

// Re-export language settings if needed elsewhere
// No need to re-export if already imported above
