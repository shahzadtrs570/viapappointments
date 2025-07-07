import type { Metadata } from "next"

import { api } from "@/lib/trpc/server"

import { PropertiesContent } from "./_components/PropertiesContent/PropertiesContent"

export const metadata: Metadata = {
  title: "Admin - Property Management",
  description: "Admin property management",
}

export default async function AdminPropertiesPage() {
  const initialPaginatedPropertiesData = await api.admin.properties.list({
    page: 1,
    limit: 10,
  })

  return (
    <div className="container px-0">
      <PropertiesContent
        initialPaginatedPropertiesData={initialPaginatedPropertiesData}
      />
    </div>
  )
}
