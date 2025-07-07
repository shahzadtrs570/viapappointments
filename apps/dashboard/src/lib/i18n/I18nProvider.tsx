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
  const [i18nInstance] = useState(() => {
    const instance = createInstance()
    instance.use(initReactI18next).init({
      ...getOptions(lng, namespaces),
      lng: lng,
      ns: namespaces,
      resources: initialResources,
      react: {
        useSuspense: false,
      },
      initImmediate: true, // Synchronous initialization
    })
    return instance
  })

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>
}

// Export a dedicated hook for client components
export function useClientTranslation(ns?: string | string[]) {
  const { i18n, t } = useTranslationOrg(ns)

  if (!i18n.isInitialized) {
    // Return keys as fallback if not initialized (should not happen with sync init)
    return { t: (key: string) => key, i18n: i18n }
  }

  return { t, i18n }
}
