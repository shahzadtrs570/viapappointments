import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@package/ui/card"
import { DataTable } from "@package/ui/data-table"

import type { PerformedUnBans } from "../../_types"

import { userPerformedUnbanColumns } from "./userPerformedUnbansTableColumns"

type UserPerformedUnbansTableProps = {
  performedUnbans: PerformedUnBans[]
}

export function UserPerformedUnbansTable({
  performedUnbans,
}: UserPerformedUnbansTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performed Unbans</CardTitle>
        <CardDescription>Unbans performed by this user.</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          columnToggle
          showPagination
          columns={userPerformedUnbanColumns}
          data={performedUnbans}
        />
      </CardContent>
    </Card>
  )
}
