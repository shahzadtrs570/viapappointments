"use client"

import { Button } from "@package/ui/button"
import { cn } from "@package/utils"

import { useAuth } from "@/hooks/useAuth"

import { useCheckout } from "../../_hooks/useCheckout"
import { useUpgrade } from "../../_hooks/useUpgrade"

type ChangePlanProps = {
  lookupKey: string
  className?: string
  children: React.ReactNode
}

export function UpgradePlanButton({
  lookupKey,
  className,
  children,
}: ChangePlanProps) {
  const { isSubscribed } = useAuth()
  const checkoutMutation = useCheckout()
  const upgradeMutation = useUpgrade()
  const isLoading = checkoutMutation.isPending || upgradeMutation.isPending

  async function handleButtonClick() {
    if (isSubscribed) {
      // Upgrade plan
      await upgradeMutation.mutateAsync({ lookupKey })
    } else {
      // Create new subscription
      await checkoutMutation.mutateAsync({ lookupKey })
    }
  }

  return (
    <Button
      className={cn("min-w-[193px] w-full", className)}
      disabled={isLoading}
      isLoading={isLoading}
      onClick={handleButtonClick}
    >
      {children}
    </Button>
  )
}
