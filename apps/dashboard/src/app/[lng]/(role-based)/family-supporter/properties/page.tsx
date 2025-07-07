"use client"

import { PropertyTracker } from "@/components/family-supporter/property/PropertyTracker"
import { RoleBasedLayout } from "@/components/Layouts/RoleBasedLayout"

export default function FamilySupporterPropertiesPage() {
  return (
    <RoleBasedLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
        <p className="text-muted-foreground">
          {`Track and monitor the progress of your loved ones' properties.`}
        </p>

        <PropertyTracker />
      </div>
    </RoleBasedLayout>
  )
}
