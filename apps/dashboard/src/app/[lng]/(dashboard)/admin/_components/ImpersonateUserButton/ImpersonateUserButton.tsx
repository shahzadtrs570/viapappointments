"use client"

import { Button } from "@package/ui/button"

import { useImpersonateUser } from "../../_hooks/useImpersonateUser"

type ImpersonateUserButtonProps = {
  userId: string
}

export function ImpersonateUserButton({ userId }: ImpersonateUserButtonProps) {
  const { copyMagicLink } = useImpersonateUser(userId)

  return (
    <Button
      className="mx-auto flex w-full max-w-[250px] items-center gap-2 lg:max-w-full"
      onClick={copyMagicLink}
    >
      Impersonate User
    </Button>
  )
}
