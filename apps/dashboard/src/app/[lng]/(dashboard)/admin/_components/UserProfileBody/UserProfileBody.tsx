import { api } from "@/lib/trpc/server"

import { UserAccountInfo } from "../UserAccountInfo/UserAccountInfo"
import { UserBansTable } from "../UserBansTable/UserBansTable"
import { UserBillingInfo } from "../UserBillingInfo/UserBillingInfo"
import { UserDeleteZone } from "../UserDeleteZone/UserDeleteZone"
import { UserPerformedBansTable } from "../UserPerformedBansTable/UserPerformedBansTable"
import { UserPerformedUnbansTable } from "../UserPerformedUnbansTable/UserPerformedUnbansTable"
import { UserProfileHeader } from "../UserProfileHeader/UserProfileHeader"
import { UserRoleManagement } from "../UserRoleManagement/UserRoleManagement"

type UserProfileBodyProps = {
  userId: string
}

export async function UserProfileBody({ userId }: UserProfileBodyProps) {
  const user = await api.admin.users.getById({ userId })

  return (
    <section className="flex flex-col gap-4">
      <UserProfileHeader user={user} />
      <UserAccountInfo user={user} />
      <UserRoleManagement
        currentRole={user.role}
        userEmail={user.email!}
        userId={user.id}
      />
      {user.subscription && (
        <UserBillingInfo subscription={user.subscription} />
      )}
      <UserBansTable
        bans={user.bans}
        isBanned={user.isBanned}
        userEmail={user.email!}
        userId={user.id}
      />
      {user.performedBans.length > 0 && (
        <UserPerformedBansTable performedBans={user.performedBans} />
      )}
      {user.performedUnbans.length > 0 && (
        <UserPerformedUnbansTable performedUnbans={user.performedUnbans} />
      )}
      <UserDeleteZone userEmail={user.email!} userId={user.id} />
    </section>
  )
}
