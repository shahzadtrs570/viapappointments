import { api } from "@/lib/trpc/react"

export function useCheckout() {
  return api.payments.createCheckoutSession.useMutation({
    onSuccess: ({ url }) => {
      window.location.href = url
    },
  })
}
