import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@package/ui/card"
import { DataTable } from "@package/ui/data-table"

import type { PerformedBans } from "../../_types"

import { userPerformedBanColumns } from "./userPerformedBansTableColumns"

type UserPerformedBansTableProps = {
  performedBans: PerformedBans[]
}

export function UserPerformedBansTable({
  performedBans,
}: UserPerformedBansTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performed Bans</CardTitle>
        <CardDescription>Bans performed by this user.</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          columnToggle
          showPagination
          columns={userPerformedBanColumns}
          data={performedBans}
        />
      </CardContent>
    </Card>
  )
}
