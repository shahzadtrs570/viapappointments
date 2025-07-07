/*eslint-disable react/jsx-sort-props*/
/*eslint-disable import/order*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable @typescript-eslint/no-explicit-any*/
/*eslint-disable @typescript-eslint/no-unnecessary-condition*/
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
  CheckCircle2,
  AlertCircle,
  Download,
  Printer,
} from "lucide-react"
import { mockBuyBoxOffers, findContractsByBuyBoxOfferId } from "@/mock-data"

export default function ContractViewPage() {
  const router = useRouter()
  const { id } = useParams()
  const [contract, setContract] = useState<any>(null)
  const [offer, setOffer] = useState<any>(null)

  useEffect(() => {
    if (id) {
      const currentOffer = mockBuyBoxOffers.find((o) => o.id === id)
      if (currentOffer) {
        setOffer(currentOffer)
        const offerContract = findContractsByBuyBoxOfferId(currentOffer.id)[0]
        if (offerContract) {
          setContract(offerContract)
        }
      }
    }
  }, [id])

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  if (!contract || !offer) {
    return (
      <div className="container mx-auto py-6">
        <p>Contract not found.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-8 py-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Contract Details</h1>
          <p className="text-muted-foreground">
            Contract #{contract.contractNumber}
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 size-4" />
            Back to Offer
          </Button>
          <Button variant="outline">
            <Download className="mr-2 size-4" />
            Download PDF
          </Button>
          <Button variant="outline">
            <Printer className="mr-2 size-4" />
            Print
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contract Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Contract Created</p>
              <p className="font-medium">{formatDate(contract.createdAt)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-medium">{formatDate(contract.updatedAt)}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Signatures Required</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-medium">Fund Buyer</h4>
                  <Badge
                    variant={contract.signedByBuyer ? "default" : "secondary"}
                  >
                    {contract.signedByBuyer ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="size-4" />
                        Signed
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <AlertCircle className="size-4" />
                        Pending
                      </span>
                    )}
                  </Badge>
                </div>
                {contract.signedByBuyer && (
                  <div className="text-sm text-muted-foreground">
                    Signed on {formatDate(contract.buyerSignedAt)}
                  </div>
                )}
                {!contract.signedByBuyer && (
                  <Button className="mt-2 w-full">Sign Contract</Button>
                )}
              </div>

              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-medium">Property Sellers</h4>
                  <Badge
                    variant={contract.signedBySellers ? "default" : "secondary"}
                  >
                    {contract.signedBySellers ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="size-4" />
                        All Signed
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <AlertCircle className="size-4" />
                        Awaiting Signatures
                      </span>
                    )}
                  </Badge>
                </div>
                {contract.signedBySellers && (
                  <div className="text-sm text-muted-foreground">
                    All sellers signed by {formatDate(contract.sellersSignedAt)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contract Terms</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <div className="space-y-6">
            <section>
              <h3>1. Parties</h3>
              <p>This Contract of Sale is made between:</p>
              <ul>
                <li>
                  <strong>Buyer:</strong> {contract.buyerName}
                </li>
                <li>
                  <strong>Sellers:</strong> {contract.sellerNames.join(", ")}
                </li>
              </ul>
            </section>

            <section>
              <h3>2. Property Details</h3>
              <p>The properties included in this contract are:</p>
              <ul>
                {contract.propertyAddresses.map(
                  (address: string, index: number) => (
                    <li key={index}>{address}</li>
                  )
                )}
              </ul>
            </section>

            <section>
              <h3>3. Financial Terms</h3>
              <ul>
                <li>
                  <strong>Initial Payment:</strong> £
                  {offer.initialPaymentAmount.toLocaleString()}
                </li>
                <li>
                  <strong>Monthly Payment:</strong> £
                  {offer.totalMonthlyPaymentAmount.toLocaleString()}
                </li>
                <li>
                  <strong>Indexation Rate:</strong>{" "}
                  {offer.averageIndexationRate}%
                </li>
              </ul>
            </section>

            <section>
              <h3>4. Terms and Conditions</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: contract.termsAndConditions,
                }}
              />
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
