/*eslint-disable import/order*/
"use client"

import { CommunicationCenter } from "@/components/family-supporter/communication/CommunicationCenter"
import { RoleBasedLayout } from "@/components/Layouts/RoleBasedLayout"

export default function FamilySupporterMessagesPage() {
  return (
    <RoleBasedLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-muted-foreground">
          Communicate with your loved ones and Srenova professionals.
        </p>

        <CommunicationCenter />
      </div>
    </RoleBasedLayout>
  )
}
