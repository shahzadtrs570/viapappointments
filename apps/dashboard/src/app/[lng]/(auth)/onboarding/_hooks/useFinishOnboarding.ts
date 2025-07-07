"use client"

import { useSession } from "next-auth/react"

import { api } from "@/lib/trpc/react"

export function useFinishOnboarding() {
  const { update } = useSession()

  return api.user.updateUserOnboarding.useMutation({
    onSuccess: async () => {
      await update()
      window.location.href = "/"
    },
  })
}
