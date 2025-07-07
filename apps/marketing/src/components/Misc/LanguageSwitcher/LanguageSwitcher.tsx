"use client"

import { useCallback } from "react"

import { Button } from "@package/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@package/ui/dropdown-menu"
import { GlobeIcon } from "lucide-react"
import { useParams, usePathname, useRouter } from "next/navigation"

import { useClientTranslation } from "@/lib/i18n/I18nProvider"
import { languages } from "@/lib/i18n/settings"

export function LanguageSwitcher() {
  const { t } = useClientTranslation()
  const params = useParams<{ lng: string }>()
  const currentLng = params.lng || "en"
  const pathname = usePathname()
  const router = useRouter()

  const getLanguageLabel = useCallback((code: string) => {
    switch (code) {
      case "en":
        return "English"
      case "fr":
        return "Français"
      case "it":
        return "Italiano"
      default:
        return code
    }
  }, [])

  const handleLanguageChange = useCallback(
    (lng: string) => {
      if (lng === currentLng) return

      const path = pathname.replace(`/${currentLng}`, `/${lng}`)
      router.push(path)
    },
    [pathname, currentLng, router]
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <GlobeIcon className="size-5" />
          <span suppressHydrationWarning className="sr-only">
            {t("language")}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lng) => (
          <DropdownMenuItem
            key={lng}
            className={lng === currentLng ? "font-bold" : ""}
            onClick={() => handleLanguageChange(lng)}
          >
            {getLanguageLabel(lng)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
