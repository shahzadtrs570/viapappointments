/* eslint-disable */
"use client"

import { ThemeProvider } from "@package/ui/theme-provider"
import { Toaster } from "@package/ui/toast"
import { SessionProvider, signOut, useSession } from "next-auth/react"
import { Provider as ReduxProvider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { useEffect } from "react"
import type { Session } from "next-auth"

import { TRPCReactProvider } from "@/lib/trpc/react"

import "@/app/globals.css"
import { persistor, store } from "./store"

import { UserbackProvider } from "@userback/react"

// Extend session type to include user id and allow string error
type ExtendedSession = Session & {
  error?: string
  user: Session["user"] & {
    id: string
  }
}

// Session error handler component that watches for authentication errors
function SessionErrorHandler({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()

  useEffect(() => {
    // If session has UserNotFoundError, sign out to clear cookies
    if ((session as ExtendedSession)?.error === "UserNotFoundError") {
      // console.log("User not found in database, signing out...")
      void signOut({ callbackUrl: "/" })
    }
  }, [session])

  return <>{children}</>
}

// UserbackWrapper component to handle user data
function UserbackWrapper({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()

  // Create userback options with session user data
  const userbackOptions = {
    user_data: session?.user
      ? {
          id: (session as ExtendedSession).user.id,
          info: {
            name: session.user.name || "",
            email: session.user.email || "",
          },
        }
      : null,
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
    <>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider
            disableTransitionOnChange
            enableSystem
            attribute="class"
            defaultTheme="light"
          >
            <SessionProvider>
              <SessionErrorHandler>
                <UserbackWrapper>
                  <TRPCReactProvider>{children}</TRPCReactProvider>
                </UserbackWrapper>
              </SessionErrorHandler>
            </SessionProvider>
          </ThemeProvider>
          <Toaster />
        </PersistGate>
      </ReduxProvider>
    </>
  )
}
