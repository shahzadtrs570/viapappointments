import { api } from "@/lib/trpc/react"

export function useCreateBillingPortalSession() {
  return api.payments.createBillingPortalSession.useMutation({
    onSuccess: ({ url }) => {
      window.location.href = url
    },
  })
}
