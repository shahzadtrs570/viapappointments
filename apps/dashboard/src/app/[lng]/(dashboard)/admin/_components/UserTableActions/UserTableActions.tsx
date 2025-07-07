"use client"

import { Button } from "@package/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@package/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"

import type { FullUser } from "@package/auth/types"

import { useImpersonateUser } from "../../_hooks/useImpersonateUser"

type UserTableActionsProps = {
  user: FullUser
  onBanUserActionClick: () => void
  onDeleteUserActionClick: () => void
}

export function UserTableActions({
  user,
  onBanUserActionClick,
  onDeleteUserActionClick,
}: UserTableActionsProps) {
  const router = useRouter()
  const { copyMagicLink } = useImpersonateUser(user.id)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-8 p-0" variant="ghost">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => router.push(`/admin/users/${user.id}`)}
        >
          View user
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyMagicLink}>
          Impersonate user
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive"
          onClick={onBanUserActionClick}
        >
          {user.isBanned ? "Unban" : "Ban"} user
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive"
          onClick={onDeleteUserActionClick}
        >
          Delete user
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
