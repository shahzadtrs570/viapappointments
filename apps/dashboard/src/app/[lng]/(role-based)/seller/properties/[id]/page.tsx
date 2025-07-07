/*eslint-disable react/function-component-definition*/
/*eslint-disable import/order*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable sort-imports*/
/*eslint-disable react/no-unescaped-entities*/

"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@package/ui/card"
import {
  mockProperties,
  mockPropertyDocuments,
  mockOffers,
  mockValuations,
} from "@/mock-data/properties"
import { Badge } from "@package/ui/badge"
import { Button } from "@package/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@package/ui/tabs"
import type { PropertyDocumentType, OfferStatus } from "@/mock-data/types"
import { PlaceholderImage } from "@/components/ui/PlaceholderImage"
import {
  FileText,
  Edit,
  Trash,
  Upload,
  Check,
  X,
  Clock,
  Home,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Banknote,
  Star,
} from "lucide-react"
import { formatDistance } from "date-fns"
import Link from "next/link"
import { notFound } from "next/navigation"
import { PropertyActions } from "@/components/seller/property/PropertyActions"

// Helper functions
const formatPropertyType = (type: string) => {
  return type.charAt(0) + type.slice(1).toLowerCase().replace("_", " ")
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value)
}

const formatCondition = (condition: string) => {
  return condition.charAt(0) + condition.slice(1).toLowerCase()
}

const formatDocumentType = (type: PropertyDocumentType) => {
  return type
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ")
}

const getOfferStatusColor: Record<OfferStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  ACCEPTED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  EXPIRED: "bg-gray-100 text-gray-800",
  WITHDRAWN: "bg-gray-100 text-gray-800",
}

export default function PropertyDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  // Find property by full ID (e.g., "property-1")
  const property = mockProperties.find((p) => p.id === params.id)

  const documents = mockPropertyDocuments.filter(
    (d) => d.propertyId === params.id
  )
  const offers = mockOffers.filter((o) => o.propertyId === params.id)
  const valuation = mockValuations.find((v) => v.propertyId === params.id)

  if (!property) {
    notFound()
  }

  return (
    <div className="container mx-auto space-y-6 py-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{property.address.streetLine1}</h1>
          <p className="text-muted-foreground">
            {property.address.city}, {property.address.postalCode}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/seller/properties/${property.id}/edit`}>
              <Edit className="mr-2 size-4" />
              Edit Property
            </Link>
          </Button>
          <Button variant="destructive">
            <Trash className="mr-2 size-4" />
            Delete
          </Button>
        </div>
      </div>

      <PropertyActions
        propertyId={property.id}
        ownership={100}
        registrationDate={new Date(property.createdAt)}
      />

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2">
          <div className="relative h-[400px]">
            <PlaceholderImage
              alt={`${property.address.streetLine1}, ${property.address.city}`}
              text={`${formatPropertyType(property.propertyType)} - ${property.address.city}`}
              fill
              className="object-cover"
            />
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Home className="size-4 text-muted-foreground" />
                  <span className="text-sm">
                    {formatPropertyType(property.propertyType)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="size-4 text-muted-foreground" />
                  <span className="text-sm">
                    {formatCondition(property.condition)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Bed className="size-4 text-muted-foreground" />
                  <span className="text-sm">
                    {property.bedroomCount} Bedrooms
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="size-4 text-muted-foreground" />
                  <span className="text-sm">
                    {property.bathroomCount} Bathrooms
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Maximize className="size-4 text-muted-foreground" />
                  <span className="text-sm">{property.totalAreaSqM} m²</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-muted-foreground" />
                  <span className="text-sm">{property.address.city}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Valuation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Estimated Value
                  </span>
                  <span className="text-lg font-semibold">
                    {formatCurrency(property.estimatedValue)}
                  </span>
                </div>
                {valuation && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Market Value
                      </span>
                      <span className="text-lg font-semibold">
                        {formatCurrency(valuation.marketValue)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Occupied Value
                      </span>
                      <span className="text-lg font-semibold">
                        {formatCurrency(valuation.occupiedValue)}
                      </span>
                    </div>
                    {valuation.notes && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {valuation.notes}
                      </p>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="documents" className="w-full">
        <TabsList>
          <TabsTrigger value="documents">
            Documents ({documents.length})
          </TabsTrigger>
          <TabsTrigger value="offers">Offers ({offers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle>Property Documents</CardTitle>
                <CardDescription>
                  Manage your property documentation
                </CardDescription>
              </div>
              <Button>
                <Upload className="mr-2 size-4" />
                Upload Document
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded bg-primary/10 p-2">
                        <FileText className="size-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {formatDocumentType(
                            doc.documentType as PropertyDocumentType
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {doc.filename}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Uploaded{" "}
                          {formatDistance(new Date(doc.createdAt), new Date(), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={doc.verified ? "default" : "secondary"}>
                        {doc.verified ? "Verified" : "Pending"}
                      </Badge>
                      <Button variant="ghost" size="sm" asChild>
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
                {documents.length === 0 && (
                  <div className="py-8 text-center">
                    <FileText className="mx-auto mb-4 size-12 text-muted-foreground" />
                    <h3 className="mb-2 text-lg font-medium">
                      No Documents Yet
                    </h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Upload property documents to get started
                    </p>
                    <Button>
                      <Upload className="mr-2 size-4" />
                      Upload First Document
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Offers Received</CardTitle>
              <CardDescription>
                View and manage offers for this property
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {offers.map((offer) => (
                  <Card key={offer.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="mb-2 flex items-center gap-2">
                            <Badge
                              className={getOfferStatusColor[offer.status]}
                            >
                              {offer.status === "PENDING" && (
                                <Clock className="mr-1 size-3" />
                              )}
                              {offer.status === "ACCEPTED" && (
                                <Check className="mr-1 size-3" />
                              )}
                              {offer.status === "REJECTED" && (
                                <X className="mr-1 size-3" />
                              )}
                              {offer.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Received{" "}
                              {formatDistance(
                                new Date(offer.createdAt),
                                new Date(),
                                { addSuffix: true }
                              )}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <p className="text-2xl font-semibold">
                              {formatCurrency(offer.initialPaymentAmount)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Monthly Payment:{" "}
                              {formatCurrency(offer.monthlyPaymentAmount)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Indexation Rate: {offer.indexationRate}%
                            </p>
                          </div>
                        </div>
                        {offer.status === "PENDING" && (
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <X className="mr-2 size-4" />
                              Reject
                            </Button>
                            <Button size="sm">
                              <Check className="mr-2 size-4" />
                              Accept
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {offers.length === 0 && (
                  <div className="py-8 text-center">
                    <Banknote className="mx-auto mb-4 size-12 text-muted-foreground" />
                    <h3 className="mb-2 text-lg font-medium">No Offers Yet</h3>
                    <p className="text-sm text-muted-foreground">
                      When you receive offers, they will appear here
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
