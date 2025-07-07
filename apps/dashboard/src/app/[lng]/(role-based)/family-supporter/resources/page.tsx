"use client"

import { ResourceLibrary } from "@/components/family-supporter/resources/ResourceLibrary"
import { RoleBasedLayout } from "@/components/Layouts/RoleBasedLayout"

export default function FamilySupporterResourcesPage() {
  return (
    <RoleBasedLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Resources</h1>
        <p className="text-muted-foreground">
          Access guides, checklists, and tools to help support your loved ones.
        </p>

        <ResourceLibrary />
      </div>
    </RoleBasedLayout>
  )
}
