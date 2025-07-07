import type { Metadata } from "next"

import { AccessDenied, Authorization } from "@/components/Misc"

import { UserProfileContent } from "../../_components/UserProfileContent/UserProfileContent"

export const metadata: Metadata = {
  title: "User Info",
  description: "User Info Page",
}

type UserProfileProps = {
  params: { userId: string }
}

export default function UserProfilePage({ params }: UserProfileProps) {
  return (
    <Authorization
      allowedRoles={["ADMIN"]}
      forbiddenFallback={<AccessDenied />}
    >
      <UserProfileContent userId={params.userId} />
    </Authorization>
  )
}
