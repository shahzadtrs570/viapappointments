import { createInstance } from "i18next"
import resourcesToBackend from "i18next-resources-to-backend"
import { initReactI18next } from "react-i18next/initReactI18next"

import type { i18n } from "i18next"

import { getOptions } from "./settings"

// Create one instance that will be reused
let i18nInstance: i18n | null = null

const initI18next = async (lng: string, ns: string | string[]) => {
  // Reuse instance if it exists
  if (i18nInstance) {
    // Just change language and add namespaces if needed
    await i18nInstance.changeLanguage(lng)

    // Make sure all requested namespaces are loaded
    if (Array.isArray(ns)) {
      await Promise.all(ns.map((n) => i18nInstance!.loadNamespaces(n)))
    } else {
      await i18nInstance.loadNamespaces(ns)
    }

    return i18nInstance
  }

  // Create new instance if it doesn't exist yet
  i18nInstance = createInstance()

  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`@/../../public/locales/${language}/${namespace}.json`)
      )
    )
    .init({
      ...getOptions(lng, ns),
      initImmediate: false, // This makes initialization synchronous
      preload: ["en", "fr", "it"], // Preload all languages
    })

  return i18nInstance
}

export async function useTranslation(
  lng: string,
  ns: string | string[] = "common",
  options: { keyPrefix?: string } = {}
) {
  const i18nextInstance = await initI18next(lng, ns)
  return {
    t: i18nextInstance.getFixedT(
      lng,
      Array.isArray(ns) ? ns[0] : ns,
      options.keyPrefix
    ),
    i18n: i18nextInstance,
  }
}
