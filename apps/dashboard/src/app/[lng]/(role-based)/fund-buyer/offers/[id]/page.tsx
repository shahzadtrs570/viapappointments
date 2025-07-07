/*eslint-disable react/jsx-sort-props*/
/*eslint-disable @typescript-eslint/no-explicit-any*/
/*eslint-disable import/order*/
/*eslint-disable @typescript-eslint/no-unnecessary-condition*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable sort-imports*/

"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@package/ui/card"
import { Button } from "@package/ui/button"
import { Badge } from "@package/ui/badge"
import { Separator } from "@package/ui/separator"
import {
  ArrowLeft,
  Building2,
  Banknote,
  Calendar,
  FileText,
  Percent,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MapPin,
  BedDouble,
  Bath,
  History,
  Square,
} from "lucide-react"
import Link from "next/link"
import {
  mockBuyBoxOffers,
  findBuyBoxById,
  findPropertiesByBuyBoxId,
  findContractsByBuyBoxOfferId,
} from "@/mock-data"
import type { MockBuyBoxOffer, OfferStatus } from "@/mock-data/types"

export default function OfferDetailsPage() {
  const router = useRouter()
  const { id } = useParams()
  const [offer, setOffer] = useState<MockBuyBoxOffer | null>(null)
  const [buyBox, setBuyBox] = useState<any>(null)
  const [properties, setProperties] = useState<any[]>([])
  const [contract, setContract] = useState<any>(null)

  useEffect(() => {
    if (id) {
      const currentOffer = mockBuyBoxOffers.find((o) => o.id === id)
      if (currentOffer) {
        setOffer(currentOffer)
        const relatedBuyBox = findBuyBoxById(currentOffer.buyBoxId)
        if (relatedBuyBox) {
          setBuyBox(relatedBuyBox)
          const buyBoxProperties = findPropertiesByBuyBoxId(relatedBuyBox.id)
          setProperties(buyBoxProperties)
        }
        const offerContract = findContractsByBuyBoxOfferId(currentOffer.id)[0]
        if (offerContract) {
          setContract(offerContract)
        }
      }
    }
  }, [id])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getStatusIcon = (status: OfferStatus) => {
    switch (status) {
      case "ACCEPTED":
        return <CheckCircle2 className="size-4 text-emerald-500" />
      case "REJECTED":
        return <XCircle className="size-4 text-red-500" />
      case "PENDING":
        return <Clock className="size-4 text-amber-500" />
      case "EXPIRED":
        return <AlertCircle className="size-4 text-slate-500" />
      default:
        return <AlertCircle className="size-4 text-slate-500" />
    }
  }

  const getStatusColor = (status: OfferStatus) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-emerald-100 text-emerald-700"
      case "REJECTED":
        return "bg-red-100 text-red-700"
      case "PENDING":
        return "bg-amber-100 text-amber-700"
      case "EXPIRED":
        return "bg-slate-100 text-slate-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  if (!offer || !buyBox) {
    return (
      <div className="container mx-auto py-6">
        <p>Offer not found.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-8 py-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">Offer Details</h1>
            <Badge variant="secondary" className={getStatusColor(offer.status)}>
              <span className="flex items-center gap-1">
                {getStatusIcon(offer.status)}
                {offer.status}
              </span>
            </Badge>
          </div>
          <p className="text-muted-foreground">Offer for {buyBox.name}</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 size-4" />
          Back to Offers
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Offer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Initial Payment</p>
              <p className="flex items-center gap-2 text-2xl font-bold">
                <Banknote className="size-5 text-muted-foreground" />
                {formatCurrency(offer.initialPaymentAmount)}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Monthly Payment</p>
              <p className="flex items-center gap-2 text-2xl font-bold">
                <Banknote className="size-5 text-muted-foreground" />
                {formatCurrency(offer.totalMonthlyPaymentAmount)}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Indexation Rate</p>
              <p className="flex items-center gap-2 text-2xl font-bold">
                <Percent className="size-5 text-muted-foreground" />
                {offer.averageIndexationRate}%
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="size-4" />
                <span>Timeline</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <History className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Offer Created</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(offer.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                {offer.updatedAt !== offer.createdAt && (
                  <div className="flex items-center gap-2">
                    <History className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(offer.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Buy Box Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold">
                {formatCurrency(buyBox.totalValue)}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Properties</p>
              <div className="grid gap-4">
                {properties.map((property) => (
                  <div key={property.id} className="rounded-lg border p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">
                          {property.address.streetLine1}
                        </h4>
                        <p className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="size-3" />
                          {property.address.city}
                        </p>
                      </div>
                      <Badge variant="secondary">{property.propertyType}</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center gap-1">
                        <BedDouble className="size-4 text-muted-foreground" />
                        <span className="text-sm">{property.bedroomCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="size-4 text-muted-foreground" />
                        <span className="text-sm">
                          {property.bathroomCount}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Square className="size-4 text-muted-foreground" />
                        <span className="text-sm">
                          {property.totalAreaSqM}m²
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {contract && (
        <Card>
          <CardHeader>
            <CardTitle>Contract Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Contract Number</p>
                <p className="font-medium">{contract.contractNumber}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant="secondary">{contract.status}</Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Signatures</p>
                <div className="flex gap-4">
                  <Badge
                    variant={contract.signedByBuyer ? "default" : "secondary"}
                  >
                    Buyer {contract.signedByBuyer ? "✓" : "Pending"}
                  </Badge>
                  <Badge
                    variant={contract.signedBySellers ? "default" : "secondary"}
                  >
                    Sellers {contract.signedBySellers ? "✓" : "Pending"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={`/fund-buyer/offers/${offer.id}/contract`}
                  className="flex items-center gap-2"
                >
                  <FileText className="size-4" />
                  View Full Contract
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end gap-4">
        <Button variant="outline" asChild>
          <Link
            href={`/fund-buyer/buy-boxes/${buyBox.id}`}
            className="flex items-center gap-2"
          >
            <Building2 className="size-4" />
            View Buy Box
          </Link>
        </Button>
        {offer.status === "ACCEPTED" && !contract && (
          <Button variant="default" asChild>
            <Link
              href={`/fund-buyer/offers/${offer.id}/contract/create`}
              className="flex items-center gap-2"
            >
              <FileText className="size-4" />
              Generate Contract
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
