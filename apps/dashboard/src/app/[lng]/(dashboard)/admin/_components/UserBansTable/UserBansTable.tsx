"use client"

import { Button } from "@package/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@package/ui/card"
import { DataTable } from "@package/ui/data-table"

import type { Bans } from "../../_types"

import { userBanColumns } from "./userBansTableColumns"
import { useUsersTableActions } from "../../_hooks/useUsersTableActions"
import { BanUserDialog } from "../BanUserDialog/BanUserDialog"
import { UnbanUserDialog } from "../UnbanUserDialog/UnbanUserDialog"

type UserBansTableProps = {
  bans: Bans[]
  isBanned: boolean
  userId: string
  userEmail: string
}

export function UserBansTable({
  bans,
  isBanned,
  userEmail,
  userId,
}: UserBansTableProps) {
  const {
    form,
    isBanDialogOpen,
    isUnbanDialogOpen,
    setIsBanDialogOpen,
    setIsUnbanDialogOpen,
    handleBanStatusDialog,
  } = useUsersTableActions({ userIsBanned: isBanned })

  return (
    <>
      <Card>
        <CardHeader>
          <section className="flex items-center justify-between">
            <CardTitle>Bans</CardTitle>
            <Button onClick={handleBanStatusDialog}>
              {isBanned ? "Unban User" : "Ban User"}
            </Button>
          </section>
          <CardDescription>All bans this user has received.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columnToggle
            showPagination
            columns={userBanColumns}
            data={bans}
          />
        </CardContent>
      </Card>
      <BanUserDialog
        form={form}
        isDialogOpen={isBanDialogOpen}
        setIsDialogOpen={setIsBanDialogOpen}
        userEmail={userEmail}
        userId={userId}
      />
      <UnbanUserDialog
        form={form}
        isDialogOpen={isUnbanDialogOpen}
        setIsDialogOpen={setIsUnbanDialogOpen}
        userEmail={userEmail}
        userId={userId}
      />
    </>
  )
}
