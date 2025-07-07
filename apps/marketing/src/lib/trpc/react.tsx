"use client"

import { useState } from "react"

import { useToast } from "@package/ui/toast"
import { featureFlags } from "@package/utils"
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import {
  httpBatchLink,
  loggerLink,
  unstable_httpBatchStreamLink,
} from "@trpc/client"
import { createTRPCReact } from "@trpc/react-query"
import superjson from "superjson"

import type { AppRouter } from "@package/api"

let clientQueryClientSingleton: QueryClient | undefined = undefined

export const api = createTRPCReact<AppRouter>()

export function TRPCReactProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()

  const getQueryClient = () => {
    if (typeof window === "undefined") {
      // Server: always make a new query client
      return createQueryClient()
    } else {
      // Browser: use singleton pattern to keep the same query client
      return (clientQueryClientSingleton ??= createQueryClient())
    }
  }

  const createQueryClient = () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          // With SSR, we usually want to set some default staleTime
          // above 0 to avoid refetching immediately on the client
          staleTime: Infinity,
          retry: 2,
        },
      },
      queryCache: new QueryCache({
        onError: (error) => {
          featureFlags.toast &&
            toast({
              variant: "destructive",
              title: "Oops, something went wrong!",
              description: error.message,
            })
        },
      }),
      mutationCache: new MutationCache({
        onError: (error) => {
          featureFlags.toast &&
            toast({
              variant: "destructive",
              title: "Oops, something went wrong!",
              description: error.message,
            })
        },
      }),
    })

  const queryClient = getQueryClient()

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NEXT_PUBLIC_APP_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        httpBatchLink({
          transformer: superjson,
          url: "/api/trpc",
        }),
        unstable_httpBatchStreamLink({
          transformer: superjson,
          url: getBaseUrl() + "/api/trpc",
          headers() {
            const headers = new Headers()
            headers.set("x-trpc-source", "nextjs-react")
            return headers
          },
        }),
      ],
    })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {children}
      </api.Provider>
    </QueryClientProvider>
  )
}

const getBaseUrl = () => {
  if (typeof window !== "undefined") return window.location.origin
  if (
    process.env.NEXT_PUBLIC_APP_URL &&
    process.env.NEXT_PUBLIC_APP_ENV === "production"
  )
    return process.env.NEXT_PUBLIC_APP_URL
  return "http://localhost:3001"
}
