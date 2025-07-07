"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@package/ui/card"
import { format } from "date-fns"

interface RecentSignup {
  id: string
  name: string
  email: string
  waitlistType: string
  createdAt: Date
}

interface RecentSignupsTableProps {
  signups: RecentSignup[]
}

export function RecentSignupsTable({ signups }: RecentSignupsTableProps) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Recent Signups</CardTitle>
      </CardHeader>
      <CardContent className="relative max-h-[400px] overflow-y-auto">
        <table className="w-full table-fixed caption-bottom text-sm">
          <thead className="sticky top-0 bg-background">
            <tr className="border-b transition-colors">
              <th className="h-12 w-[25%] px-4 text-left align-middle font-medium">
                Name
              </th>
              <th className="h-12 w-[35%] px-4 text-left align-middle font-medium">
                Email
              </th>
              <th className="h-12 w-1/5 px-4 text-left align-middle font-medium">
                Type
              </th>
              <th className="h-12 w-1/5 px-4 text-left align-middle font-medium">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {signups.map((signup) => (
              <tr
                key={signup.id}
                className="border-b transition-colors hover:bg-muted/50"
              >
                <td className="truncate p-4 align-middle" title={signup.name}>
                  {signup.name}
                </td>
                <td className="truncate p-4 align-middle" title={signup.email}>
                  {signup.email}
                </td>
                <td
                  className="truncate p-4 align-middle"
                  title={signup.waitlistType}
                >
                  {signup.waitlistType}
                </td>
                <td className="truncate p-4 align-middle">
                  {format(new Date(signup.createdAt), "MMM d, yyyy")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
