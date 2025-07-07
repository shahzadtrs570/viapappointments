"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { languages } from "@/lib/i18n/settings"

// Language Switcher component
function LanguageSwitcher() {
  const params = useParams()
  const currentPath = usePathname()
  const [open, setOpen] = useState(false)
  const currentLng = params.lng as string

  const pathWithoutLang = currentPath.replace(`/${currentLng}`, "")

  return (
    <div className="relative">
      <button
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700"
        onClick={() => setOpen(!open)}
      >
        {currentLng.toUpperCase()}
        <svg
          className="ml-1 size-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M19 9l-7 7-7-7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-24 rounded-md bg-white shadow-lg">
          {languages.map((lng) => (
            <Link
              key={lng}
              href={`/${lng}${pathWithoutLang}`}
              className={`block px-4 py-2 text-sm hover:bg-gray-100 ${
                currentLng === lng ? "font-bold" : "font-normal"
              }`}
              onClick={() => setOpen(false)}
            >
              {lng.toUpperCase()}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export function Navbar() {
  const params = useParams()
  const lng = (params.lng as string) || "en"

  return (
    <nav className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={`/${lng}`} className="flex items-center">
              <Image
                src="/images/VIP-4.avif"
                alt="VIP Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Main Navigation */}
          <div className="hidden md:flex md:space-x-8">
            <Link
              href={`/${lng}/new`}
              className="text-base font-medium text-gray-700 hover:text-gray-900"
            >
              NEW
            </Link>
            <Link
              href={`/${lng}/used`}
              className="text-base font-medium text-gray-700 hover:text-gray-900"
            >
              USED
            </Link>
            <Link
              href={`/${lng}/research`}
              className="text-base font-medium text-gray-700 hover:text-gray-900"
            >
              RESEARCH
            </Link>
            <Link
              href={`/${lng}/find-dealer`}
              className="text-base font-medium text-gray-700 hover:text-gray-900"
            >
              FIND A VIP DEALER
            </Link>
          </div>

          {/* Right side - Language & Shop Now */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <Link
              href={`/${lng}/cars/shop`}
              className="rounded-full bg-red-500 px-6 py-2 text-sm font-semibold text-white hover:bg-red-600"
            >
              SHOP NOW
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
