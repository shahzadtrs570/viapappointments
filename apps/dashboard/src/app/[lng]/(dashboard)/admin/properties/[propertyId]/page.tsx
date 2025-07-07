/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from "next"

import { api } from "@/lib/trpc/server"

import { PropertyDetailContent } from "../_components/PropertyDetailContent/PropertyDetailContent"

export const metadata: Metadata = {
  title: "Admin - Property Details",
  description: "View and manage property details",
}

export default async function AdminPropertyDetailPage({
  params,
}: {
  params: { propertyId: string }
}) {
  const propertyData = await api.admin.properties.getById({
    propertyId: params.propertyId,
  })

  const augmentedPropertyData = {
    ...propertyData,
    valuations: [],
    offers: [],
    sellerProperties: propertyData.sellerProperties.map((sp: any) => ({
      ...sp,
      seller: {
        ...sp.seller,
        user: {} as any,
      },
    })),
    sellers: propertyData.sellerProperties.map((sp: any) => ({
      id: sp.seller.id,
      userId: sp.seller.userId,
      firstName: sp.seller.firstName,
      lastName: sp.seller.lastName,
      dateOfBirth: sp.seller.dateOfBirth,
      generalHealth: sp.seller.generalHealth,
      financialPriority: sp.seller.financialPriority,
      willStayInProperty: sp.seller.willStayInProperty,
      ownershipPercentage: sp.ownershipPercentage,
      createdAt: sp.seller.createdAt,
      updatedAt: sp.seller.updatedAt,
    })),
    documents: [],
  }

  return (
    <div className="container px-0">
      <PropertyDetailContent propertyData={augmentedPropertyData as any} />
    </div>
  )
}
