/*eslint-disable react/jsx-sort-props*/
/*eslint-disable import/order*/
/*eslint-disable @typescript-eslint/no-explicit-any*/
/*eslint-disable sort-imports*/

"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@package/ui/card"
import { Button } from "@package/ui/button"
import { Badge } from "@package/ui/badge"
import { Separator } from "@package/ui/separator"
import { Checkbox } from "@package/ui/checkbox"
import { ArrowLeft, FileText, AlertCircle } from "lucide-react"
import {
  mockBuyBoxOffers,
  findBuyBoxById,
  findPropertiesByBuyBoxId,
} from "@/mock-data"

export default function ContractGenerationPage() {
  const router = useRouter()
  const { id } = useParams()
  const [offer, setOffer] = useState<any>(null)
  const [buyBox, setBuyBox] = useState<any>(null)
  const [properties, setProperties] = useState<any[]>([])
  const [termsAccepted, setTermsAccepted] = useState(false)

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

  const handleGenerateContract = () => {
    // In a real application, this would make an API call to generate the contract
    router.push(`/fund-buyer/offers/${id}/contract`)
  }

  if (!offer || !buyBox) {
    return (
      <div className="container mx-auto py-6">
        <p>Offer not found or not eligible for contract generation.</p>
      </div>
    )
  }

  if (offer.status !== "ACCEPTED") {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4 text-center">
              <AlertCircle className="mx-auto size-12 text-amber-500" />
              <h2 className="text-2xl font-semibold">
                Contract Cannot Be Generated
              </h2>
              <p className="text-muted-foreground">
                A contract can only be generated for accepted offers. Current
                offer status is {offer.status.toLowerCase()}.
              </p>
              <Button variant="outline" onClick={() => router.back()}>
                Back to Offer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-8 py-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Generate Contract</h1>
          <p className="text-muted-foreground">
            Review and generate contract for {buyBox.name}
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 size-4" />
          Back to Offer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contract Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Initial Payment</p>
              <p className="text-2xl font-bold">
                {formatCurrency(offer.initialPaymentAmount)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Monthly Payment</p>
              <p className="text-2xl font-bold">
                {formatCurrency(offer.totalMonthlyPaymentAmount)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Indexation Rate</p>
              <p className="text-2xl font-bold">
                {offer.averageIndexationRate}%
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Properties Included</h3>
            <div className="grid gap-4">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <h4 className="font-medium">
                      {property.address.streetLine1}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {property.address.city}, {property.address.postcode}
                    </p>
                  </div>
                  <Badge variant="secondary">{property.propertyType}</Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Terms & Conditions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose max-w-none">
            <h3>Contract Terms</h3>
            <p>
              By generating this contract, you agree to the following terms:
            </p>
            <ul>
              <li>
                All property details and financial terms stated above are
                accurate and final.
              </li>
              <li>
                The contract will be legally binding once signed by all parties.
              </li>
              <li>
                Any modifications to the contract terms must be agreed upon by
                all parties.
              </li>
              <li>
                The contract is subject to local property laws and regulations.
              </li>
            </ul>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) =>
                setTermsAccepted(checked as boolean)
              }
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I have read and agree to the contract terms and conditions
            </label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          size="lg"
          disabled={!termsAccepted}
          onClick={handleGenerateContract}
        >
          <FileText className="mr-2 size-4" />
          Generate Contract
        </Button>
      </div>
    </div>
  )
}
