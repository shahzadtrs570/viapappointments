"use client"

import { Button } from "@package/ui/button"
import { Spinner } from "@package/ui/spinner"

import { useCreateBillingPortalSession } from "../../_hooks/useCreateBillingPortalSession"

export function ManageSubscriptionButton() {
  const billingPortalSessionMutation = useCreateBillingPortalSession()

  async function handleButtonClick() {
    await billingPortalSessionMutation.mutateAsync()
  }

  return (
    <Button
      className="xs:min-w-[193px]"
      disabled={billingPortalSessionMutation.isPending}
      onClick={handleButtonClick}
    >
      {billingPortalSessionMutation.isPending && (
        <Spinner className="mr-1 size-6" />
      )}
      Manage Subscription
    </Button>
  )
}
