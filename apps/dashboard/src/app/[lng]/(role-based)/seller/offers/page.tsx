/*eslint-disable react/jsx-max-depth*/
/*eslint-disable import/order*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/function-component-definition*/

"use client"
import { Card, CardContent } from "@package/ui/card"
import { mockOffers, mockProperties } from "@/mock-data/properties"
import { Badge } from "@package/ui/badge"
import { Button } from "@package/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@package/ui/tabs"
import type { OfferStatus } from "@/mock-data/types"
import Link from "next/link"
import { Home } from "lucide-react"

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value)
}

const getStatusColor = (status: OfferStatus) => {
  const colors: Record<OfferStatus, string> = {
    DRAFT: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    ACCEPTED: "bg-green-100 text-green-800 hover:bg-green-200",
    REJECTED: "bg-red-100 text-red-800 hover:bg-red-200",
    WITHDRAWN: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    EXPIRED: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  }
  return colors[status]
}

export default function OffersPage() {
  // In a real app, this would fetch from an API
  const offers = mockOffers
  const properties = mockProperties

  const pendingOffers = offers.filter((offer) => offer.status === "PENDING")
  const activeOffers = offers.filter((offer) => offer.status === "ACCEPTED")
  const pastOffers = offers.filter((offer) =>
    ["REJECTED", "EXPIRED"].includes(offer.status)
  )

  const OfferCard = ({ offer }: { offer: (typeof offers)[0] }) => {
    const property = properties.find((p) => p.id === offer.propertyId)
    if (!property) return null

    const offerPercentage = Math.round(
      (offer.initialPaymentAmount / property.estimatedValue) * 100
    )

    return (
      <Card className="overflow-hidden">
        <CardContent className="space-y-6 p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold">
                  {formatCurrency(offer.initialPaymentAmount)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Monthly payment: {formatCurrency(offer.monthlyPaymentAmount)}{" "}
                  (indexed at {offer.indexationRate}%)
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Home className="size-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{property.address.streetLine1}</p>
                  <p className="text-muted-foreground">
                    {property.address.city}, {property.address.state}{" "}
                    {property.address.postalCode}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge className={getStatusColor(offer.status)}>
                {offer.status === "ACCEPTED" ? "✓ Accepted" : offer.status}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Offer vs. Estimated Value
            </p>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-blue-100">
              <div
                className="absolute left-0 top-0 h-full bg-blue-500"
                style={{ width: `${offerPercentage}%` }}
              />
            </div>
            <p className="text-right text-sm">{offerPercentage}%</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Agreement Type</p>
              <p className="font-medium">{offer.agreementType}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Occupancy Rights</p>
              <p className="font-medium">{offer.occupancyRight}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Offer Date</p>
              <p className="font-medium">
                {new Date(offer.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Expires</p>
              <p className="font-medium">
                {new Date(offer.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" asChild>
              <Link href={`/seller/offers/${offer.id}`}>View Details</Link>
            </Button>
            {offer.status === "ACCEPTED" && (
              <Button variant="default" className="flex-1" asChild>
                <Link href={`/seller/offers/${offer.id}/contract`}>
                  View Contract
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto space-y-8 py-6">
      <div>
        <h1 className="text-3xl font-bold">Offer Management</h1>
        <p className="text-muted-foreground">
          Review and manage offers for your properties
        </p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pending ({pendingOffers.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({activeOffers.length})
          </TabsTrigger>
          <TabsTrigger value="past">Past ({pastOffers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <div className="grid gap-6">
            {pendingOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
            {pendingOffers.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No pending offers at the moment
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          <div className="grid gap-6">
            {activeOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
            {activeOffers.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No active offers at the moment
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          <div className="grid gap-6">
            {pastOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
            {pastOffers.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No past offers to display
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
