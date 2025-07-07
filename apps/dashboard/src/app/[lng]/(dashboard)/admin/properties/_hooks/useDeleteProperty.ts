import type React from "react"
import { useCallback } from "react"

import { useToast } from "@package/ui/toast"

import { api } from "@/lib/trpc/react"

import { useAdminContext } from "../../_contexts/adminContext"

type UseDeletePropertyProps = {
  propertyId: string
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function useDeleteProperty({
  propertyId,
  setIsDialogOpen,
}: UseDeletePropertyProps) {
  const utils = api.useUtils()
  const { toast } = useToast()
  const { pagination } = useAdminContext()

  const deletePropertyMutation = api.admin.properties.deleteById.useMutation({
    onSuccess: async () => {
      await utils.admin.properties.list.invalidate({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      })
      toast({
        description: "Property deleted.",
        variant: "success",
        title: "Success",
      })
    },
  })

  const onSubmit = useCallback(async () => {
    await deletePropertyMutation.mutateAsync(
      { propertyId },
      {
        onSuccess: () => {
          setIsDialogOpen(false)
        },
      }
    )
  }, [deletePropertyMutation, propertyId, setIsDialogOpen])

  return { onSubmit, deletePropertyMutation }
}
