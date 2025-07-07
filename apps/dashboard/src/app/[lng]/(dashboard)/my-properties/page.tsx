import type { Metadata } from "next"

import { AccessDenied, Authorization } from "@/components/Misc"
import { api } from "@/lib/trpc/server"

import { PropertiesContent } from "./_components/PropertiesContent/PropertiesContent"

export const metadata: Metadata = {
  title: "My Properties",
  description: "View and manage your properties",
}

// Set more specific caching options for this page
// Use force-dynamic to ensure fresh data but with appropriate cache control
export const dynamic = "force-dynamic"
export const revalidate = 300 // Revalidate every 5 minutes

export default async function MyPropertiesPage({
  searchParams,
}: {
  searchParams?: { page?: string; limit?: string }
}) {
  // Get pagination params from URL if available
  const page = searchParams?.page ? parseInt(searchParams.page, 10) : 1
  const limit = searchParams?.limit ? parseInt(searchParams.limit, 10) : 10

  // Fetch initial data only once for server rendering
  const initialPaginatedPropertiesData = await api.property.myProperties.list({
    page,
    limit,
  })

  return (
    <Authorization
      allowedRoles={["ADMIN"]}
      forbiddenFallback={<AccessDenied />}
    >
      <div className="container px-0">
        <PropertiesContent
          initialPaginatedPropertiesData={initialPaginatedPropertiesData}
        />
      </div>
    </Authorization>
  )
}
