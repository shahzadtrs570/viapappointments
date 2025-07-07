"use client"

import { useEffect, useState } from "react"

import i18next from "i18next"
import LanguageDetector from "i18next-browser-languagedetector" // If you want browser language detection
import resourcesToBackend from "i18next-resources-to-backend"
import {
  initReactI18next,
  useTranslation as useTranslationOrg,
} from "react-i18next"

import { cookieName, getOptions, languages } from "./settings"

/* eslint-disable @typescript-eslint/no-floating-promises, import/no-named-as-default-member */

const runsOnServerSide = typeof window === "undefined"

// Create a function to refresh language detection on page load
export function refreshLanguageOnLoad() {
  if (runsOnServerSide) return

  // Get browser language
  const browserLang = navigator.language

  // Use the same conversion logic as in detection config
  let normalizedLang = browserLang
  if (browserLang.startsWith("en-")) normalizedLang = "en"
  if (browserLang.startsWith("fr-")) normalizedLang = "fr"
  if (browserLang.startsWith("it-")) normalizedLang = "it"

  // Check if supported and different from current
  if (
    ["en", "fr", "it"].includes(normalizedLang) &&
    normalizedLang !== i18next.resolvedLanguage
  ) {
    // Clear the cookie to force fresh detection
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`

    // Change language
    i18next.changeLanguage(normalizedLang)
  }
}

i18next
  .use(initReactI18next)
  .use(LanguageDetector) // Optional: Add browser language detection
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`@/../../public/locales/${language}/${namespace}.json`)
    )
  )
  .init({
    ...getOptions(),
    lng: undefined, // Let detector handle initial language - IMPORTANT
    supportedLngs: ["en", "fr", "it"], // Add support for English, French, and Italian
    detection: {
      order: ["path", "cookie", "htmlTag", "localStorage", "subdomain"],
      caches: ["cookie"],
      lookupCookie: cookieName,
    },
    preload: runsOnServerSide ? languages : [], // Preload languages on server
  })

export function useTranslation(
  lng: string,
  ns: string | string[] = "common",
  options: { keyPrefix?: string } = {}
) {
  const ret = useTranslationOrg(ns, options)
  const { i18n } = ret

  // Select correct language based on URL path segment (lng)
  if (runsOnServerSide && lng && i18n.resolvedLanguage !== lng) {
    i18n.changeLanguage(lng)
  }

  // Handle language changes and resource loading on client
  const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage)

  useEffect(() => {
    if (activeLng === i18n.resolvedLanguage) return
    setActiveLng(i18n.resolvedLanguage)
  }, [activeLng, i18n.resolvedLanguage])

  useEffect(() => {
    if (!lng || i18n.resolvedLanguage === lng) return
    i18n.changeLanguage(lng)
  }, [lng, i18n])

  // Check browser language on each page load/refresh
  useEffect(() => {
    if (runsOnServerSide) return

    // Only runs once on page load/refresh
    refreshLanguageOnLoad()

    // Listen for browser language changes
    const handleLanguageChange = () => refreshLanguageOnLoad()
    window.addEventListener("languagechange", handleLanguageChange)

    return () => {
      window.removeEventListener("languagechange", handleLanguageChange)
    }
  }, [])

  return ret
}
