/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, no-console */
import { createInstance } from "i18next"
import resourcesToBackend from "i18next-resources-to-backend"

import type { Resource } from "i18next"

import { getOptions, languages } from "./settings"

// Initialize a server-side i18next instance
const initI18next = async (
  lng: string,
  ns: string | string[]
): Promise<any> => {
  const i18nInstance = createInstance()
  await i18nInstance
    .use(
      resourcesToBackend(async (language: string, namespace: string) => {
        // Adjusted path for dashboard app
        try {
          // Path relative to apps/dashboard/src/lib/i18n
          return import(`../../../public/locales/${language}/${namespace}.json`)
        } catch (error) {
          console.error(
            `[Server Translation Load Error] Failed: ${language}/${namespace}`,
            error
          )
          return {}
        }
      })
    )
    .init(getOptions(lng, ns))
  return i18nInstance
}

// Utility function to get initial resources for the client provider
export async function getInitialResources(
  lng: string,
  ns: string | string[] = ["common"]
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
