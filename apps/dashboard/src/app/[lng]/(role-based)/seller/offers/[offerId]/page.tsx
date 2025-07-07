/*eslint-disable sort-imports*/
/*eslint-disable import/order*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable no-nested-ternary*/
/*eslint-disable react/jsx-max-depth*/

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@package/ui/card"
import {
  mockOffers,
  mockProperties,
  findContractByOfferId,
} from "@/mock-data/properties"
import { Badge } from "@package/ui/badge"
import { Button } from "@package/ui/button"
import { Separator } from "@package/ui/separator"
import type { OfferStatus } from "@/mock-data/types"
import { formatDistance } from "date-fns"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  DollarSign,
  FileText,
  Home,
  Percent,
  X,
} from "lucide-react"

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value)
}

const getOfferStatusColor = (status: OfferStatus) => {
  const mapping: Record<OfferStatus, string> = {
    DRAFT: "bg-gray-100 text-gray-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    ACCEPTED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    EXPIRED: "bg-gray-100 text-gray-800",
    WITHDRAWN: "bg-gray-100 text-gray-800",
  }
  return mapping[status] || "bg-gray-100 text-gray-800"
}

const getContractStatusColor = (
  status: "PENDING" | "COMPLETED" | "EXPIRED"
) => {
  const mapping: Record<"PENDING" | "COMPLETED" | "EXPIRED", string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    COMPLETED: "bg-green-100 text-green-800",
    EXPIRED: "bg-gray-100 text-gray-800",
  }
  return mapping[status] || "bg-gray-100 text-gray-800"
}

export default function OfferDetailsPage({
  params,
}: {
  params: { offerId: string }
}) {
  // In a real app, this would fetch from an API
  const offer = mockOffers.find((o) => o.id === params.offerId)
  const property = offer
    ? mockProperties.find((p) => p.id === offer.propertyId)
    : undefined
  const contract = offer ? findContractByOfferId(offer.id) : undefined

  if (!property || !offer) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Offer not found
          </CardContent>
        </Card>
      </div>
    )
  }

  const offerPercentage = Math.round(
    (offer.initialPaymentAmount / property.estimatedValue) * 100
  )

  return (
    <div className="container mx-auto space-y-6 py-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/seller/offers">
            <ArrowLeft className="mr-2 size-4" />
            Back to Offers
          </Link>
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <Badge className={getOfferStatusColor(offer.status)}>
          {offer.status === "PENDING" && <Clock className="mr-1 size-3" />}
          {offer.status === "ACCEPTED" && <Check className="mr-1 size-3" />}
          {offer.status === "REJECTED" && <X className="mr-1 size-3" />}
          {offer.status}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Offer Details</CardTitle>
            <CardDescription>
              Received{" "}
              {formatDistance(new Date(offer.createdAt), new Date(), {
                addSuffix: true,
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-2 flex items-center gap-2">
                  <Home className="size-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Property</span>
                </div>
                <div className="text-lg font-medium">
                  {property.address.streetLine1}
                </div>
                <div className="text-sm text-muted-foreground">
                  {property.address.city}, {property.address.state}{" "}
                  {property.address.postalCode}
                </div>
                <Button variant="link" className="mt-2 px-0" asChild>
                  <Link href={`/seller/properties/${property.id}`}>
                    View Property Details
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-2 flex items-center gap-2">
                    <DollarSign className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Initial Payment</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(offer.initialPaymentAmount)}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {offerPercentage}% of estimated value
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="mb-2 flex items-center gap-2">
                    <Calendar className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Monthly Payment</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(offer.monthlyPaymentAmount)}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Per month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="mb-2 flex items-center gap-2">
                    <Percent className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Indexation Rate</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {offer.indexationRate}%
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Annual increase
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="mb-2 flex items-center gap-2">
                    <FileText className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      Agreement Details
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Type:</span>{" "}
                      {offer.agreementType}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Occupancy:</span>{" "}
                      {offer.occupancyRight}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {offer.status === "PENDING" && (
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1">
                  <X className="mr-2 size-4" />
                  Reject Offer
                </Button>
                <Button className="flex-1">
                  <Check className="mr-2 size-4" />
                  Accept Offer
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contract Status</CardTitle>
            </CardHeader>
            <CardContent>
              {contract ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge className={getContractStatusColor(contract.status)}>
                      {contract.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">
                        Contract Number:
                      </span>{" "}
                      {contract.contractNumber}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Created:</span>{" "}
                      {formatDistance(
                        new Date(contract.createdAt),
                        new Date(),
                        { addSuffix: true }
                      )}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">
                        Last Updated:
                      </span>{" "}
                      {formatDistance(
                        new Date(contract.updatedAt),
                        new Date(),
                        { addSuffix: true }
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`size-2 rounded-full ${contract.signedBySellers ? "bg-green-500" : "bg-gray-300"}`}
                      />
                      <span className="text-sm">Signed by Seller</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`size-2 rounded-full ${contract.signedByBuyer ? "bg-green-500" : "bg-gray-300"}`}
                      />
                      <span className="text-sm">Signed by Buyer</span>
                    </div>
                  </div>

                  <Button className="w-full" asChild>
                    <Link href={`/seller/offers/${offer.id}/contract`}>
                      <FileText className="mr-2 size-4" />
                      View Contract
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="py-6 text-center">
                  <FileText className="mx-auto mb-4 size-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-medium">No Contract Yet</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    A contract will be generated once the offer is accepted
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-2">
                    <div className="mt-2 size-2 rounded-full bg-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Offer Received</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(offer.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                {offer.status !== "PENDING" && (
                  <div className="flex gap-4">
                    <div className="w-2">
                      <div className="mt-2 size-2 rounded-full bg-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Offer {offer.status.toLowerCase()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(offer.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
                {contract && (
                  <>
                    <div className="flex gap-4">
                      <div className="w-2">
                        <div className="mt-2 size-2 rounded-full bg-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Contract Generated
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(contract.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {contract.signedBySellers && (
                      <div className="flex gap-4">
                        <div className="w-2">
                          <div className="mt-2 size-2 rounded-full bg-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            Signed by Seller
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(contract.updatedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                    {contract.signedByBuyer && (
                      <div className="flex gap-4">
                        <div className="w-2">
                          <div className="mt-2 size-2 rounded-full bg-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Signed by Buyer</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(contract.updatedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
