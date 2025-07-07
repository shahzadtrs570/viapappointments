"use client"

import { useEffect } from "react"

import { Button } from "@package/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@package/ui/dropdown-menu"
import { Check, Globe } from "lucide-react"
import { useParams, usePathname, useRouter } from "next/navigation"

import { cookieName, fallbackLng, languages } from "@/lib/i18n/settings"

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()

  const currentLng = Array.isArray(params.lng)
    ? params.lng[0]
    : params.lng || fallbackLng

  // Function to set the cookie explicitly - useful for immediate UI updates if needed
  // and to ensure cookie is set if i18next-browser-languagedetector isn't handling it robustly enough
  const setLanguageCookie = (newLng: string) => {
    document.cookie = `${cookieName}=${newLng};path=/;max-age=31536000` // Expires in 1 year
  }

  const getLocalizedPath = (lng: string) => {
    if (!pathname) return "/"
    const segments = pathname.split("/")
    // If the first segment (after splitting) is a known language, replace it
    if (languages.includes(segments[1])) {
      segments[1] = lng
      return segments.join("/")
    }
    // If no language prefix is found, prepend the new language
    // This handles cases where the current path might be the root or missing locale
    return `/${lng}${pathname}`
  }

  const handleLanguageChange = (newLng: string) => {
    const newPath = getLocalizedPath(newLng)
    setLanguageCookie(newLng) // Set cookie before navigation
    router.push(newPath)
    // router.refresh(); // Optional: force a refresh if client-side transitions aren't picking up changes
  }

  // Ensure currentLng is valid, redirect to fallback if not (e.g. direct navigation to /xx/path)
  useEffect(() => {
    if (params.lng && !languages.includes(currentLng)) {
      console.warn(
        `Invalid language '${currentLng}' in URL. Redirecting to fallback '${fallbackLng}'.`
      )
      const newPath = getLocalizedPath(fallbackLng)
      setLanguageCookie(fallbackLng)
      router.replace(newPath) // Use replace to not add to history
    }
  }, [currentLng, params.lng, router, pathname, fallbackLng])

  if (!currentLng || !languages.includes(currentLng)) {
    // Still rendering briefly while redirecting or if currentLng is somehow invalid before effect runs
    return (
      <Button disabled size="icon" variant="outline">
        <Globe className="size-5" />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline">
          <Globe className="size-5" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lng) => {
          return (
            <DropdownMenuItem
              key={lng}
              onClick={() => handleLanguageChange(lng)}
            >
              <div className="flex w-full items-center justify-between">
                <span>{lng.toUpperCase()}</span>
                {lng === currentLng && <Check className="ml-2 size-4" />}
              </div>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
