import { useCallback, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { banSchema } from "@package/validations"
import { useForm } from "react-hook-form"

import type { BanSchema } from "@package/validations"

type UseUsersTableActionsProps = {
  userIsBanned: boolean
}

export function useUsersTableActions({
  userIsBanned,
}: UseUsersTableActionsProps) {
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false)
  const [isUnbanDialogOpen, setIsUnbanDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const form = useForm<BanSchema>({
    resolver: zodResolver(banSchema),
    defaultValues: {
      reason: "",
    },
  })

  const handleBanStatusDialog = useCallback(() => {
    if (userIsBanned) {
      setIsUnbanDialogOpen(true)
    } else {
      setIsBanDialogOpen(true)
    }
  }, [userIsBanned])

  return {
    isBanDialogOpen,
    isUnbanDialogOpen,
    isDeleteDialogOpen,
    form,
    handleBanStatusDialog,
    setIsBanDialogOpen,
    setIsUnbanDialogOpen,
    setIsDeleteDialogOpen,
  }
}
