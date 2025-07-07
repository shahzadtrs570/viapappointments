"use client"

import { useState } from "react"

import { Button } from "@package/ui/button"
import { Card, CardHeader, CardTitle } from "@package/ui/card"

// import { DeleteUserDialog } from "@/app/(dashboard)/admin/_components/DeleteUserDialog/DeleteUserDialog"
import { DeleteUserDialog } from "../DeleteUserDialog/DeleteUserDialog"

type UserDeleteZoneProps = {
  userId: string
  userEmail: string
}

export function UserDeleteZone({ userEmail, userId }: UserDeleteZoneProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Danger Zone</CardTitle>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Delete User
          </Button>
        </CardHeader>
      </Card>
      <DeleteUserDialog
        isDialogOpen={isDeleteDialogOpen}
        setIsDialogOpen={setIsDeleteDialogOpen}
        userEmail={userEmail}
        userId={userId}
      />
    </>
  )
}
