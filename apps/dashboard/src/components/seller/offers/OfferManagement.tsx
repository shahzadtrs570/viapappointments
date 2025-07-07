/*eslint-disable import/order*/
/*eslint-disable react/function-component-definition*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable @typescript-eslint/consistent-type-imports*/
/*eslint-disable @typescript-eslint/no-unnecessary-condition*/

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@package/ui/card"
import {
  mockOffers,
  mockProperties,
  mockSellerProperties,
} from "@/mock-data/properties"
import { Button } from "@package/ui/button"
import { Badge } from "@package/ui/badge"
import { Progress } from "@package/ui/progress"
import { Check, Clock, HelpCircle, X } from "lucide-react"
import { OfferStatus, AgreementType, OccupancyRight } from "@/mock-data/types"

// Helper functions for formatting
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

const formatOfferStatus = (status: OfferStatus) => {
  const mapping: Record<
    OfferStatus,
    { label: string; color: string; icon: JSX.Element }
  > = {
    DRAFT: {
      label: "Draft",
      color: "bg-gray-100 text-gray-800 border-gray-200",
      icon: <HelpCircle className="mr-1 size-3" />,
    },
    PENDING: {
      label: "Pending",
      color: "bg-blue-50 text-blue-700 border-blue-200",
      icon: <Clock className="mr-1 size-3" />,
    },
    ACCEPTED: {
      label: "Accepted",
      color: "bg-green-50 text-green-700 border-green-200",
      icon: <Check className="mr-1 size-3" />,
    },
    REJECTED: {
      label: "Rejected",
      color: "bg-red-50 text-red-700 border-red-200",
      icon: <X className="mr-1 size-3" />,
    },
    EXPIRED: {
      label: "Expired",
      color: "bg-amber-50 text-amber-700 border-amber-200",
      icon: <Clock className="mr-1 size-3" />,
    },
    WITHDRAWN: {
      label: "Withdrawn",
      color: "bg-purple-50 text-purple-700 border-purple-200",
      icon: <X className="mr-1 size-3" />,
    },
  }

  return mapping[status] || { label: status, color: "", icon: null }
}

const formatAgreementType = (type: AgreementType) => {
  const mapping: Record<AgreementType, string> = {
    STANDARD: "Standard Agreement",
    CUSTOM: "Custom Agreement",
  }
  return mapping[type] || type
}

const formatOccupancyRight = (right: OccupancyRight) => {
  const mapping: Record<OccupancyRight, string> = {
    FULL: "Full Occupancy Rights",
    PARTIAL: "Partial Occupancy Rights",
    NONE: "No Occupancy Rights",
  }
  return mapping[right] || right
}

export function OfferManagement() {
  // In a real application, this would fetch the seller's profile, property, and offers from the API
  // For now, we're using mock data
  const sellerProperty = mockSellerProperties[0]
  const property = mockProperties.find(
    (p) => p.id === sellerProperty.propertyId
  )

  if (!property) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Property Not Found</CardTitle>
          <CardDescription>
            No property information is available. Please contact support.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  // Filter offers for this property
  const propertyOffers = mockOffers.filter(
    (offer) => offer.propertyId === property.id
  )

  // Calculate highest offer
  const highestOffer =
    propertyOffers.length > 0
      ? propertyOffers.reduce((prev, current) =>
          prev.initialPaymentAmount > current.initialPaymentAmount
            ? prev
            : current
        )
      : null

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Offer Management</CardTitle>
          <CardDescription>
            Review and manage offers for your property
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col items-start justify-between sm:flex-row sm:items-center">
            <div>
              <h3 className="text-lg font-semibold">
                {property.address.streetLine1}
              </h3>
              <p className="text-sm text-muted-foreground">
                {property.address.city}, {property.address.postalCode}
              </p>
            </div>
            <div className="mt-2 sm:mt-0">
              <Badge className="border-primary/20 bg-primary/10 text-primary">
                Estimated Value: {formatCurrency(property.estimatedValue)}
              </Badge>
            </div>
          </div>

          {propertyOffers.length === 0 ? (
            <div className="rounded-lg border bg-gray-50 p-6 text-center">
              <p className="mb-2 text-muted-foreground">
                No offers received yet for your property.
              </p>
              <p className="text-sm">
                {`We'll notify you as soon as offers are available.`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {propertyOffers.map((offer) => {
                const statusInfo = formatOfferStatus(offer.status)
                const isHighestOffer =
                  highestOffer && offer.id === highestOffer.id
                const percentOfAsking = Math.round(
                  (offer.initialPaymentAmount / property.estimatedValue) * 100
                )

                return (
                  <Card
                    key={offer.id}
                    className={`overflow-hidden ${isHighestOffer ? "border-primary/30 bg-primary/5" : ""}`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {formatCurrency(offer.initialPaymentAmount)}
                            {isHighestOffer && (
                              <Badge className="ml-2 border-primary/20 bg-primary/10 text-primary">
                                Highest Offer
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription>
                            Monthly payment:{" "}
                            {formatCurrency(offer.monthlyPaymentAmount)}
                            {offer.indexationRate > 0 &&
                              ` (indexed at ${offer.indexationRate}%)`}
                          </CardDescription>
                        </div>
                        <Badge
                          variant="outline"
                          className={`flex items-center ${statusInfo.color}`}
                        >
                          {statusInfo.icon}
                          {statusInfo.label}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="pb-2">
                      <div className="mb-2">
                        <div className="mb-1 flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Offer vs. Estimated Value
                          </span>
                          <span className="font-medium">
                            {percentOfAsking}%
                          </span>
                        </div>
                        <Progress value={percentOfAsking} className="h-2" />
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-1 text-sm md:grid-cols-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Agreement Type
                          </span>
                          <span>
                            {formatAgreementType(offer.agreementType)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Occupancy Rights
                          </span>
                          <span>
                            {formatOccupancyRight(offer.occupancyRight)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Offer Date
                          </span>
                          <span>{formatDate(offer.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Expires</span>
                          <span>{formatDate(offer.updatedAt)}</span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="flex flex-wrap gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        View Details
                      </Button>
                      {offer.status === "PENDING" && (
                        <>
                          <Button
                            size="sm"
                            variant="default"
                            className="flex-1"
                          >
                            Accept Offer
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            Decline
                          </Button>
                        </>
                      )}
                      {offer.status === "ACCEPTED" && (
                        <Button size="sm" variant="default" className="flex-1">
                          View Contract
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
