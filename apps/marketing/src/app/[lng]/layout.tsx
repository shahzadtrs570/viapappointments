import "../globals.css"

import { dir } from "i18next"
import { Inter } from "next/font/google"

import type { Metadata, Viewport } from "next"

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Toaster } from "@/components/ui/toaster"
import { useTranslation } from "@/lib/i18n"
import { getInitialResources } from "@/lib/i18n/getInitialResources"
import { I18nProvider } from "@/lib/i18n/I18nProvider"
// Import the TRPC Provider (moved up)
import { TRPCReactProvider } from "@/lib/trpc/react"

import { languages } from "../../lib/i18n/settings"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

/* eslint-disable @typescript-eslint/require-await, react-hooks/rules-of-hooks */
// Function to generate static paths for supported languages
export async function generateStaticParams() {
  return languages.map((lng: string) => ({ lng }))
}

const defaultUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"

// Generate metadata dynamically based on language
export async function generateMetadata({
  params: { lng },
}: {
  params: { lng: string }
}): Promise<Metadata> {
  // Get translations, explicitly loading common, navbar, and footer
  const { t } = await useTranslation(lng, ["common", "navbar", "footer"])

  return {
    metadataBase: new URL(defaultUrl),
    title: {
      template: `%s | ${t("title", "Check The Lot")}`,
      default: t("title", "Check The Lot | AI-Powered Marketplace"),
    },
    description: t(
      "description",
      "Discover your next dream purchase with AI-powered search. Browse vehicles, homes, boats, and more in one intelligent marketplace."
    ),
    icons: {
      icon: "/icon.png",
    },
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

// Update RootLayout props to accept language parameter
interface RootLayoutProps {
  children: React.ReactNode
  params: {
    lng: string
  }
}

export default async function RootLayout({
  children,
  params: { lng },
}: RootLayoutProps) {
  // Define namespaces needed for initial client load
  const namespaces = [
    "common",
    "navbar",
    "footer",
    "landing",
    "eligibility",
    "benefits",
    "callToAction",
    "hero",
    "howItWorks",
    "testimonials",
    "trustIndicators",
    "viagerExplainer",
    "calculator",
    "whatIsSrenova",
    "features",
    "faq",
    "valueProposition",
  ]
  // Load initial resources on the server
  const initialResources = await getInitialResources(lng, namespaces)

  return (
    <html
      key={lng}
      suppressHydrationWarning
      className={`${inter.variable}`}
      dir={dir(lng)}
      lang={lng}
    >
      <body suppressHydrationWarning>
        {/* Wrap with TRPC Provider */}
        <TRPCReactProvider>
          <I18nProvider
            initialResources={initialResources}
            lng={lng}
            namespaces={namespaces}
          >
            <Header />
            <main>{children}</main>
            <Footer />
            <Toaster />
          </I18nProvider>
        </TRPCReactProvider>
      </body>
    </html>
  )
}
