/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { ThemeProvider } from "@package/ui/theme-provider"
import { Toaster } from "@package/ui/toast"
import { UserbackProvider } from "@userback/react"
import { RootProvider } from "fumadocs-ui/provider"

import { TRPCReactProvider } from "@/lib/trpc/react"

/**
 * UserbackWrapper for Marketing App
 *
 * This is a simplified version of the UserbackWrapper used in the dashboard app.
 * For the marketing site, we:
 * 1. Don't require user authentication
 * 2. Use minimal user data tracking
 * 3. Focus on collecting general feedback rather than user-specific issues
 *
 * The wrapper still maintains compatibility with the dashboard implementation
 * but with empty defaults for user data as most visitors will be anonymous.
 */
function UserbackWrapper({ children }: { children: React.ReactNode }) {
  // For marketing site, we use minimal user data
  // Most visitors will be anonymous, so we default to a generic ID
  const userbackOptions = {
    user_data: {
      // Use a generic ID for anonymous visitors to prevent warnings
      id: "anonymous-visitor",
      info: {
        // Marketing site typically doesn't need user details
        name: "Anonymous",
        email: "",
      },
    },
    // Disable warnings about missing user ID
    disable_warnings: true,
  } as any

  if (process.env.NEXT_PUBLIC_USERBACK === "true") {
    return (
      <UserbackProvider
        options={userbackOptions}
        token={process.env.NEXT_PUBLIC_USERBACK_TOKEN || ""}
      >
        {children}
      </UserbackProvider>
    )
  }

  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TRPCReactProvider>
      <ThemeProvider
        disableTransitionOnChange
        enableSystem
        attribute="class"
        defaultTheme="light"
      >
        <RootProvider>
          <UserbackWrapper>{children}</UserbackWrapper>
        </RootProvider>
      </ThemeProvider>
      <Toaster />
    </TRPCReactProvider>
  )
}
