import { createInstance } from "i18next"
import resourcesToBackend from "i18next-resources-to-backend"
import { initReactI18next } from "react-i18next/initReactI18next"

import type { i18n } from "i18next"

import { getOptions } from "./settings"

// Create one instance that will be reused for server components
let i18nInstance: i18n | null = null

const initI18next = async (lng: string, ns: string | string[]) => {
  if (i18nInstance) {
    await i18nInstance.changeLanguage(lng)
    if (Array.isArray(ns)) {
      await Promise.all(ns.map((n) => i18nInstance!.loadNamespaces(n)))
    } else {
      await i18nInstance.loadNamespaces(ns)
    }
    return i18nInstance
  }

  i18nInstance = createInstance()
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          // Adjusted path for dashboard app
          import(`../../../public/locales/${language}/${namespace}.json`)
      )
    )
    .init({
      ...getOptions(lng, ns),
      // Important for server-side rendering
      initImmediate: false,
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
