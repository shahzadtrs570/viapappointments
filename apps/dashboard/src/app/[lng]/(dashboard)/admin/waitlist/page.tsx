"use client"

import { WaitlistTable } from "../_components/WaitlistTable/WaitlistTable"

export default function WaitlistPage() {
  return (
    <div className="container space-y-8 py-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Waitlist Management
        </h2>
        <p className="text-muted-foreground">
          View and manage waitlist entries for your product.
        </p>
      </div>

      <div>
        <WaitlistTable />
      </div>
    </div>
  )
}
