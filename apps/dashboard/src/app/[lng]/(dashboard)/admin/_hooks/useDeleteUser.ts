import type React from "react"
import { useCallback, useMemo } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@package/ui/toast"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { api } from "@/lib/trpc/react"

import { useAdminContext } from "../_contexts/adminContext"

type UseDeleteUserProps = {
  userId: string
  userEmail: string
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function useDeleteUser({
  userId,
  userEmail,
  setIsDialogOpen,
}: UseDeleteUserProps) {
  const utils = api.useUtils()
  const { toast } = useToast()
  const { pagination } = useAdminContext()

  const deleteUserMutation = api.admin.users.deleteById.useMutation({
    onSuccess: async (data) => {
      await utils.admin.users.list.invalidate({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      })
      await utils.admin.users.getById.invalidate({ userId: data.id })
      toast({
        description: "User deleted.",
        variant: "success",
        title: "Success",
      })
    },
  })

  const deleteUserSchema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .min(1, "Email is required")
          .refine(
            (value) => value === userEmail,
            "Email must match the user's email"
          ),
      }),
    [userEmail]
  )

  const form = useForm<z.infer<typeof deleteUserSchema>>({
    resolver: zodResolver(deleteUserSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = useCallback(async () => {
    await deleteUserMutation.mutateAsync(
      { userId },
      {
        onSuccess: () => {
          setIsDialogOpen(false)
          form.reset()
        },
      }
    )
  }, [deleteUserMutation, form, setIsDialogOpen, userId])

  return { form, onSubmit, deleteUserMutation }
}
