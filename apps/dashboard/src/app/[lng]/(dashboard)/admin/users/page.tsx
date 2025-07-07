import type { Metadata } from "next"

import { AccessDenied, Authorization } from "@/components/Misc"
import { api } from "@/lib/trpc/server"

import { UsersContent } from "../_components/UsersContent/UsersContent"

export const metadata: Metadata = {
  title: "Admin - User Management",
  description: "Admin user management",
}

export default async function UsersPage() {
  const initialPaginatedUsers = await api.admin.users.list({
    page: 1,
    limit: 10,
  })

  return (
    <Authorization
      allowedRoles={["ADMIN"]}
      forbiddenFallback={<AccessDenied />}
    >
      <UsersContent initialPaginatedUsersData={initialPaginatedUsers} />
    </Authorization>
  )
}
