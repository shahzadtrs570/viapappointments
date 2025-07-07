/*eslint-disable import/order*/
/*eslint-disable react/function-component-definition*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable  @typescript-eslint/consistent-type-imports*/

"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft, InfoIcon, FileTextIcon } from "lucide-react"
import { Card } from "@package/ui/card"
import { ThemeInitializer } from "./components/ThemeInitializer"

interface OnboardingLayoutProps {
  children: ReactNode
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ThemeInitializer />
      <header className="sticky top-0 z-50 w-full border-b bg-card">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-1">
              <ArrowLeft className="size-4" />
              <span>Back</span>
            </Link>
          </div>
          <div>
            <Link href="/" className="text-lg font-bold">
              Srenova
            </Link>
          </div>
          <div className="w-20" />
        </div>
      </header>
      <main className="container flex-1 py-6 md:py-10">
        <Card className="mx-auto w-full max-w-4xl p-6 shadow-sm">
          {children}
        </Card>
      </main>
      <footer className="border-t bg-card py-6">
        <div className="container flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Srenova. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <FileTextIcon className="size-4" />
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <InfoIcon className="size-4" />
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
