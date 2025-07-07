import { useCallback } from "react"

import { isSubscribed } from "@package/utils"
import { signIn, signOut, useSession } from "next-auth/react"

import type { RouterOutputs } from "@package/api"

import { api } from "@/lib/trpc/react"

type UserInitializerProps = {
  initialUser?: RouterOutputs["user"]["getMe"]
}

export function useAuth({ initialUser }: UserInitializerProps = {}) {
  const { data: session, status } = useSession()
  const isAuthenticated = status === "authenticated"

  const userQuery = api.user.getMe.useQuery(undefined, {
    enabled: !!session,
    initialData: initialUser,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })

  const handleAuth = useCallback(async () => {
    if (isAuthenticated) {
      await signOut()
    } else {
      await signIn()
    }
  }, [isAuthenticated])

  return {
    isAuthenticated,
    isSubscribed: isSubscribed(userQuery.data?.subscription),
    userQuery,
    user: userQuery.data,
    handleAuth,
    signIn,
    signOut,
    refetchUser: userQuery.refetch,
  }
}
