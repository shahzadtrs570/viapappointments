import { Typography } from "@package/ui/typography"

import { UserProfileBody } from "../UserProfileBody/UserProfileBody"

type UserProfileContentProps = {
  userId: string
}

export function UserProfileContent({ userId }: UserProfileContentProps) {
  return (
    <section className="flex flex-col gap-8">
      <Typography variant="h1">User Info - Admin View</Typography>
      <UserProfileBody userId={userId} />
    </section>
  )
}
