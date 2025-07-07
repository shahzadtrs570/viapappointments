"use client"

import { Typography } from "@package/ui/typography"

import { useAuth } from "@/hooks/useAuth"

import { ManageSubscriptionButton } from "../ManageSubscriptionButton/ManageSubscriptionButton"

export function Header() {
  const { user } = useAuth()

  return (
    <header className="mb-6 w-full space-y-2">
      <section className="flex w-full items-center justify-between">
        <Typography variant="h1">Billing</Typography>
        {user?.subscription?.customerId !== "trialing-lemon-squeezy" && (
          <ManageSubscriptionButton />
        )}
      </section>
      <Typography variant="body">
        Manage your subscription and billing information.
      </Typography>
    </header>
  )
}
