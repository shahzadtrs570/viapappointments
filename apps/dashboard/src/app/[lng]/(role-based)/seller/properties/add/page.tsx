import { AddPropertyForm } from "@/components/forms/AddPropertyForm"

export default function AddPropertyPage() {
  return (
    <div className="container mx-auto space-y-6 py-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Property</h1>
        <p className="text-muted-foreground">
          Fill in the details below to list your property
        </p>
      </div>

      <AddPropertyForm />
    </div>
  )
}
