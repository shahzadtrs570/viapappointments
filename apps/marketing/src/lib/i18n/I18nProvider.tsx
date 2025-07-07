"use client"

import type { ReactNode } from "react"
import { useState } from "react"

import { createInstance } from "i18next"
import {
  I18nextProvider,
  initReactI18next,
  useTranslation as useTranslationOrg,
} from "react-i18next"

import type { Resource } from "i18next"

import { getOptions } from "./settings"

/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-floating-promises */

// No global init needed here anymore if each provider has its own instance

interface I18nProviderProps {
  children: ReactNode
  lng: string
  initialResources: Resource
  namespaces: string[]
}

export function I18nProvider({
  children,
  lng,
  initialResources,
  namespaces,
}: I18nProviderProps) {
  // Create and initialize i18n instance only once using useState initializer
  const [i18nInstance] = useState(() => {
    const instance = createInstance()
    instance.use(initReactI18next).init({
      ...getOptions(lng, namespaces), // Base options
      lng: lng, // Initial language
      ns: namespaces, // Initial namespaces
      resources: initialResources, // Initial resources
      react: {
        useSuspense: false, // Keep if needed
      },
      // Ensure init runs synchronously
      initImmediate: true, // Explicitly true (default, but good for clarity)
    })
    return instance
  })

  // Provide this specific, initialized instance
  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>
}

// useClientTranslation hook remains the same, uses context
export function useClientTranslation(ns?: string | string[]) {
  const { i18n, t } = useTranslationOrg(ns)

  // Check if the instance from context is initialized
  // It should be due to sync init in provider
  if (!i18n.isInitialized) {
    // console.warn(`i18n instance from context not initialized for NS: ${ns}`);
    // Return keys as fallback during this unlikely state
    return { t: (key: string) => key, i18n: i18n }
  }

  return { t, i18n }
}
