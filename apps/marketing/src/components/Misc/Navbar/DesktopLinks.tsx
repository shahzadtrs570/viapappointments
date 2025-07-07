/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { cn } from "@package/utils"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"

type LinksProps = {
  className?: string
  onLinkClick?: () => void
}

export function DesktopLinks({ className, onLinkClick }: LinksProps) {
  const currentUrl = usePathname()
  const params = useParams<{ lng: string }>()
  const { t } = useClientTranslation("navbar")
  const lng = params.lng || "en"

  // Get the base URL without the language prefix
  const getHref = (path: string) => `/${lng}${path}`

  const menuItems = [
    { href: getHref("/new"), text: "NEW" },
    { href: getHref("/used"), text: "USED" },
    { href: getHref("/research"), text: "RESEARCH" },
    { href: getHref("/find-dealer"), text: "FIND A VIP DEALER" },
  ]

  return (
    <section
      className={cn(
        "flex items-center justify-center gap-6",
        className
      )}
    >
      {menuItems.map((item) => {
        const isActive = currentUrl === item.href

        return (
          <Link
            key={item.text}
            href={item.href}
            className={cn(
              "text-sm font-medium text-gray-700 hover:text-gray-900 uppercase tracking-wide transition-colors",
              {
                "text-gray-900 font-bold": isActive,
              }
            )}
            onClick={onLinkClick}
          >
            {item.text}
          </Link>
        )
      })}
    </section>
  )
}
