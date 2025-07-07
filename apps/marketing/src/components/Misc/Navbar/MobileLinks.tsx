/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { Button } from "@package/ui/button"
import { cn } from "@package/utils"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"

type LinksProps = {
  onLinkClick?: () => void
}

export function MobileLinks({ onLinkClick }: LinksProps) {
  const params = useParams<{ lng: string }>()
  const currentUrl = usePathname()
  const { t } = useClientTranslation("navbar")
  const lng = params.lng || "en"

  // Get the base URL with language prefix
  const getHref = (path: string) => `/${lng}${path}`

  const menuItems = [
    { href: getHref("/new"), text: "NEW" },
    { href: getHref("/used"), text: "USED" },
    { href: getHref("/research"), text: "RESEARCH" },
    { href: getHref("/find-dealer"), text: "FIND A VIP DEALER" },
  ]

  return (
    <nav className="flex flex-col bg-white px-4 py-4">
      <div className="flex flex-col gap-3">
        {menuItems.map((item) => {
          const isActive = currentUrl === item.href

          return (
            <Link
              key={item.text}
              href={item.href}
              className={cn(
                "text-sm font-medium text-gray-700 hover:text-gray-900 uppercase tracking-wide py-2",
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
      </div>

      <div className="mt-4 flex">
        <Button
          asChild
          className="w-full rounded-full bg-red-500 px-5 py-1.5 text-sm font-semibold text-white hover:bg-red-600 uppercase tracking-wide"
        >
          <Link href={getHref("/cars/shop")} onClick={onLinkClick}>
            SHOP NOW →
          </Link>
        </Button>
      </div>
    </nav>
  )
}
