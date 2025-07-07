import { useCallback } from "react"

import { useToast } from "@package/ui/toast"

import { api } from "@/lib/trpc/react"

export function useImpersonateUser(userId: string) {
  const { toast } = useToast()

  const impersonateUserQuery = api.admin.users.impersonateById.useQuery(
    { userId },
    {
      enabled: false,
    }
  )

  const copyMagicLink = useCallback(async () => {
    try {
      const magicLink = await impersonateUserQuery.refetch()
      if (!magicLink.data) {
        throw new Error("No magic link found")
      }
      await navigator.clipboard.writeText(magicLink.data)
      toast({
        description: "Magic link copied to clipboard",
        variant: "success",
        title: "Success",
      })
    } catch (error) {
      /* empty */
    }
  }, [impersonateUserQuery, toast])

  return { impersonateUserQuery, copyMagicLink }
}
