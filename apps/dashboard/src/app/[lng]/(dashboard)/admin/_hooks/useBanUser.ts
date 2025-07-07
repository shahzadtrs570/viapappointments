import { useToast } from "@package/ui/toast"

import { useAuth } from "@/hooks/useAuth"
import { api } from "@/lib/trpc/react"

import { useAdminContext } from "../_contexts/adminContext"

export function useBanUser() {
  const utils = api.useUtils()
  const { toast } = useToast()
  const { user } = useAuth()
  const { pagination } = useAdminContext()

  return api.admin.users.banById.useMutation({
    onSuccess: async (data) => {
      await utils.admin.users.list.invalidate({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      })
      await utils.admin.users.getById.invalidate({ userId: data.id })
      await utils.admin.users.getById.invalidate({ userId: user?.id })
      toast({
        description: "User banned",
        variant: "success",
        title: "Success",
      })
    },
  })
}
