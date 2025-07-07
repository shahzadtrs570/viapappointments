import { api } from "@/lib/trpc/react"

export function useUserProfile(userId: string) {
  return api.admin.users.getById.useQuery({ userId })
}
