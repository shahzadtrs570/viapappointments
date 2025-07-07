"use client"

import { Button } from "@package/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { LanguageSwitcher } from "@/components/Misc/LanguageSwitcher"
import { MobileSheet } from "@/components/Misc/Navbar/MobileSheet"
import { DesktopLinks } from "./DesktopLinks"

export function Navbar() {
  const { lng } = useParams()

  return (
    <section className="sticky top-0 z-[51] h-16 bg-white shadow">
      <header className="mx-auto h-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-full items-center justify-between gap-4">
          {/* Logo */}
          <Link className="flex items-center" href={`/${lng}`}>
            <Image
              src="/images/brand/VIP-4.avif"
              alt="VIP Logo"
              width={100}
              height={35}
              className="h-8 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden flex-1 justify-center lg:flex">
            <DesktopLinks />
          </nav>

          {/* Right Side - Language & Shop Now */}
          <div className="hidden items-center gap-3 lg:flex">
            <LanguageSwitcher />
            <Button
              asChild
              className="rounded-full bg-red-500 px-5 py-1.5 text-sm font-semibold text-white hover:bg-red-600 uppercase tracking-wider"
            >
              <Link href={`/${lng}/cars/shop`}>
                SHOP NOW →
              </Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <MobileSheet />
        </div>
      </header>
    </section>
  )
}

/* eslint-disable @typescript-eslint/no-unused-vars */
