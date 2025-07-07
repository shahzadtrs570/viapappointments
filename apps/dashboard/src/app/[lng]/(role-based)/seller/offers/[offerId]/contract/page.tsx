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
  mockContracts,
} from "@/mock-data/properties"
import { Badge } from "@package/ui/badge"
import { Button } from "@package/ui/button"
import { Separator } from "@package/ui/separator"
import { formatDistance } from "date-fns"
import Link from "next/link"
import { ArrowLeft, Check, Printer, Download } from "lucide-react"

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

// Helper function to find contract by offer ID
const findContractByOfferId = (offerId: string) => {
  return mockContracts.find((c) => c.offerId === offerId)
}

export default function ContractPage({
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

  if (!property || !offer || !contract) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Contract not found
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/seller/offers/${offer.id}`}>
              <ArrowLeft className="mr-2 size-4" />
              Back to Offer
            </Link>
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Badge className={getContractStatusColor(contract.status)}>
            {contract.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 size-4" />
            Print Contract
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 size-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Contract Details</CardTitle>
            <CardDescription>
              Contract #{contract.contractNumber} • Generated{" "}
              {formatDistance(new Date(contract.createdAt), new Date(), {
                addSuffix: true,
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="prose max-w-none">
              <h2>Property Purchase Agreement</h2>
              <p>
                {`This Property Purchase Agreement (the "Agreement") is made and
                entered into on{" "}
                ${new Date(contract.createdAt).toLocaleDateString()} by and
                between:`}
              </p>

              <h3>1. Parties</h3>
              <p>
                <strong>Seller:</strong> [Seller Name]
                <br />
                <strong>Buyer:</strong> [Buyer Name]
              </p>

              <h3>2. Property</h3>
              <p>
                The property subject to this agreement is located at:
                <br />
                {property.address.streetLine1}
                <br />
                {property.address.city}, {property.address.state}{" "}
                {property.address.postalCode}
                <br />
                {property.address.country}
              </p>

              <h3>3. Purchase Price and Payment Terms</h3>
              <p>
                3.1. The total purchase price for the Property is £
                {offer.initialPaymentAmount.toLocaleString()}.
              </p>
              <p>
                3.2. Monthly payments of £
                {offer.monthlyPaymentAmount.toLocaleString()} shall be made by
                the Buyer.
              </p>
              <p>
                3.3. An annual indexation rate of {offer.indexationRate}% shall
                be applied to the monthly payments.
              </p>

              <h3>4. Agreement Type</h3>
              <p>
                This agreement is structured as a{" "}
                {offer.agreementType.toLowerCase()} with{" "}
                {offer.occupancyRight.toLowerCase()} occupancy rights.
              </p>

              <h3>5. Terms and Conditions</h3>
              <p>
                5.1. The Buyer agrees to maintain the Property in good
                condition.
              </p>
              <p>
                5.2. The Seller warrants that they have full right and authority
                to sell the Property.
              </p>
              <p>
                5.3. Any modifications to the Property must be approved in
                writing by the Seller.
              </p>

              <h3>6. Signatures</h3>
              <div className="mt-8 grid grid-cols-2 gap-8">
                <div>
                  <p className="font-medium">Seller</p>
                  {contract.signedBySellers ? (
                    <div className="mt-2 rounded border p-4">
                      <div className="flex items-center gap-2 text-green-600">
                        <Check className="size-4" />
                        <span className="text-sm font-medium">
                          Signed Electronically
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {new Date(contract.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <Button className="mt-2">Sign Contract</Button>
                  )}
                </div>
                <div>
                  <p className="font-medium">Buyer</p>
                  {contract.signedByBuyer ? (
                    <div className="mt-2 rounded border p-4">
                      <div className="flex items-center gap-2 text-green-600">
                        <Check className="size-4" />
                        <span className="text-sm font-medium">
                          Signed Electronically
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {new Date(contract.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-2 rounded border bg-gray-50 p-4">
                      <p className="text-sm text-muted-foreground">
                        Awaiting buyer signature
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contract Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">
                      Contract Number:
                    </span>{" "}
                    {contract.contractNumber}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Created:</span>{" "}
                    {formatDistance(new Date(contract.createdAt), new Date(), {
                      addSuffix: true,
                    })}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Last Updated:</span>{" "}
                    {formatDistance(new Date(contract.updatedAt), new Date(), {
                      addSuffix: true,
                    })}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Signatures Required</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`size-2 rounded-full ${contract.signedBySellers ? "bg-green-500" : "bg-gray-300"}`}
                        />
                        <span className="text-sm">Seller</span>
                      </div>
                      {!contract.signedBySellers && (
                        <Button size="sm">Sign Now</Button>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`size-2 rounded-full ${contract.signedByBuyer ? "bg-green-500" : "bg-gray-300"}`}
                        />
                        <span className="text-sm">Buyer</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Pending
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Contract Actions</h4>
                  <div className="space-y-2">
                    <Button className="w-full" variant="outline">
                      <Printer className="mr-2 size-4" />
                      Print Contract
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Download className="mr-2 size-4" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  If you have any questions about the contract or need
                  assistance, our support team is here to help.
                </p>
                <Button className="w-full" variant="outline">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
