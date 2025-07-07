import { Button } from "@package/ui/button"
import { PlusCircle } from "lucide-react"

import type { Property } from "./types"

import { PropertyStatusCard } from "./PropertyStatusCard"

interface PropertyListProps {
  properties: Property[]
  onAddProperty?: () => void
  onViewProperty?: (propertyId: string) => void
  onEditProperty?: (propertyId: string) => void
}

export function PropertyList({
  properties,
  onAddProperty,
  onViewProperty,
  onEditProperty,
}: PropertyListProps) {
  return (
    <div className="space-y-6">
      {properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
          <h3 className="mb-2 text-lg font-medium">No Properties Added</h3>
          <p className="mb-6 text-sm text-muted-foreground">
            You haven&apos;t added any properties yet. Add your first property
            to get started.
          </p>
          <Button onClick={onAddProperty}>
            <PlusCircle className="mr-2 size-4" />
            Add Your First Property
          </Button>
        </div>
      ) : (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium">
              Your Properties ({properties.length})
            </h3>
            <Button onClick={onAddProperty}>
              <PlusCircle className="mr-2 size-4" />
              Add Property
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {properties.map((property) => (
              <PropertyStatusCard
                key={property.id}
                property={property}
                onEdit={() => onEditProperty?.(property.id)}
                onView={() => onViewProperty?.(property.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
