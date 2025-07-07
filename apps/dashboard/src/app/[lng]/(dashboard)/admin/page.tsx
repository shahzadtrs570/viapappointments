import { subtractDays } from "@package/utils"

import type { Metadata } from "next"

import { AccessDenied, Authorization } from "@/components/Misc"
import { api } from "@/lib/trpc/server"

import { AdminContent } from "./_components/AdminContent/AdminContent"

export const metadata: Metadata = {
  title: "Admin",
  description: "Admin",
}

export default async function OverviewPage() {
  const initialUserStatistics = await api.admin.statistics.users({
    from: subtractDays(7),
    to: new Date(),
  })
  const initialSubscriptionStatistics =
    await api.admin.statistics.subscriptions()

  return (
    <Authorization
      allowedRoles={["ADMIN"]}
      forbiddenFallback={<AccessDenied />}
    >
      <AdminContent
        initialData={{
          userStatistics: initialUserStatistics,
          subscriptionStatistics: initialSubscriptionStatistics,
        }}
      />
    </Authorization>
  )
}
