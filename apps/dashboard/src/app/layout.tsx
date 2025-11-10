import { cn } from "@package/utils"
import { Inter } from "next/font/google"

import type { Metadata } from "next"

import { Providers } from "./providers"

import "@package/tailwind-config/styles.css"
import "./globals.css"

const defaultUrl = process.env.NEXT_PUBLIC_APP_URL!

// Define Inter font instance
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  // Add a default title for your site, which will be used as a fallback for pages without their own title set
  title: {
    template: "%s | Srenova",
    default: "Srenova",
  },
  description:
    "Connect property owners with investment opportunities for equity release.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
