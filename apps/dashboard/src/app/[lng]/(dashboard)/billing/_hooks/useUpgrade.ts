import { api } from "@/lib/trpc/react"

export function useUpgrade() {
  return api.payments.upgradeSubscriptionPlan.useMutation({
    onSuccess: ({ url }) => {
      window.location.href = url
    },
  })
}
