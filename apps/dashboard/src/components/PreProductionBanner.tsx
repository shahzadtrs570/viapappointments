"use client"

import { useEffect, useState } from "react"

import { Heart, Sparkles, TestTube, X, Zap } from "lucide-react"

import { useClientTranslation } from "@/lib/i18n/I18nProvider"

const BANNER_STORAGE_KEY = "preProductionBannerDismissed"

export function PreProductionBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useClientTranslation(["pre-production"])

  useEffect(() => {
    // Check if banner was previously dismissed
    const isDismissed = localStorage.getItem(BANNER_STORAGE_KEY)
    if (!isDismissed) {
      // Show modal after a slight delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem(BANNER_STORAGE_KEY, "true")
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border bg-background shadow-lg duration-300 animate-in fade-in-0 zoom-in-95">
        {/* Close button */}
        <button
          aria-label="Close dialog"
          className="absolute right-4 top-4 rounded-md p-1 transition-colors hover:bg-muted"
          onClick={handleClose}
        >
          <X className="size-4" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="size-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {t("pre-production:banner.title")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("pre-production:banner.subtitle")}
              </p>
            </div>
          </div>

          <p
            className="mb-6 text-muted-foreground"
            dangerouslySetInnerHTML={{
              __html: t("pre-production:banner.description"),
            }}
          />

          {/* Features */}
          <div className="mb-6 space-y-3">
            <div className="flex items-center gap-3 rounded-md bg-muted/50 p-3">
              <TestTube className="size-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium">
                  {t("pre-production:banner.features.safeEnvironment.title")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t(
                    "pre-production:banner.features.safeEnvironment.description"
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-md bg-muted/50 p-3">
              <Zap className="size-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium">
                  {t("pre-production:banner.features.fullAccess.title")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("pre-production:banner.features.fullAccess.description")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-md bg-muted/50 p-3">
              <Heart className="size-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium">
                  {t("pre-production:banner.features.helpImprove.title")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("pre-production:banner.features.helpImprove.description")}
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button
              className="w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              onClick={handleClose}
            >
              {t("pre-production:banner.buttons.startExploring")}
            </button>
            <p className="mt-2 text-xs text-muted-foreground">
              {t("pre-production:banner.buttons.closeMessage")}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
