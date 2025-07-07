/*eslint-disable import/order*/
/*eslint-disable react/function-component-definition*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable @typescript-eslint/consistent-type-imports*/
/*eslint-disable @typescript-eslint/no-unnecessary-condition*/
/*eslint-disable @typescript-eslint/no-unused-vars*/
/*eslint-disable import/named*/

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@package/ui/card"
import {
  mockPropertyDocuments,
  mockProperties,
  mockSellerProperties,
} from "@/mock-data/properties"
import { Button } from "@package/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@package/ui/tabs"
import { Badge } from "@package/ui/badge"
import { CheckCircle2, File, FileText, Upload } from "lucide-react"

// Helper to format document type for display
const formatDocumentType = (type: string) => {
  const mapping: Record<string, string> = {
    DEED: "Property Deed",
    FLOOR_PLAN: "Floor Plan",
    ENERGY_CERTIFICATE: "Energy Certificate",
    SURVEY: "Property Survey",
    PROPERTY_TAX: "Property Tax",
    INSURANCE: "Insurance Document",
    PHOTO: "Property Photo",
    OTHER: "Other Document",
  }
  return mapping[type] || "Document"
}

// Helper to get icon for document type
const getDocumentIcon = (type: string) => {
  switch (type) {
    case "DEED":
    case "ENERGY_CERTIFICATE":
    case "PROPERTY_TAX":
    case "INSURANCE":
      return <FileText className="size-10 text-primary/70" />
    case "FLOOR_PLAN":
    case "SURVEY":
    case "PHOTO":
      return <File className="size-10 text-primary/70" />
    default:
      return <File className="size-10 text-primary/70" />
  }
}

export function DocumentCenter() {
  // In a real application, this would fetch the seller's property and documents from the API
  // For now, we're using mock data - assuming the first property
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

  // Get documents for this property
  const propertyDocs = mockPropertyDocuments.filter(
    (doc) => doc.propertyId === property.id
  )

  // Group documents by type
  const requiredDocs = propertyDocs.filter((doc) =>
    ["DEED", "ENERGY_CERTIFICATE", "FLOOR_PLAN"].includes(doc.documentType)
  )

  const additionalDocs = propertyDocs.filter(
    (doc) =>
      !["DEED", "ENERGY_CERTIFICATE", "FLOOR_PLAN"].includes(doc.documentType)
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Document Center</CardTitle>
          <CardDescription>
            Manage all your property documents in one place
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                {property.address.streetLine1}
              </h3>
              <p className="text-sm text-muted-foreground">
                {property.address.city}, {property.address.postalCode}
              </p>
            </div>
            <Button>
              <Upload className="mr-2 size-4" />
              Upload Document
            </Button>
          </div>

          <Tabs defaultValue="required" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="required">Required Documents</TabsTrigger>
              <TabsTrigger value="additional">Additional Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="required" className="mt-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {requiredDocs.length > 0 ? (
                  requiredDocs.map((doc) => (
                    <Card key={doc.id} className="overflow-hidden">
                      <div className="flex p-4">
                        <div className="mr-4 flex items-center justify-center">
                          {getDocumentIcon(doc.documentType as string)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">
                            {formatDocumentType(doc.documentType as string)}
                          </h4>
                          <p className="truncate text-sm text-muted-foreground">
                            {doc.filename}
                          </p>
                          <div className="mt-1 flex items-center">
                            {doc.verified ? (
                              <Badge
                                variant="outline"
                                className="flex items-center gap-1 border-green-200 bg-green-50 text-xs text-green-700"
                              >
                                <CheckCircle2 className="size-3" />
                                Verified
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="border-amber-200 bg-amber-50 text-xs text-amber-700"
                              >
                                Pending Verification
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <CardFooter className="flex justify-end gap-2 bg-gray-50 p-2">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-2 rounded-lg border bg-gray-50 p-6 text-center">
                    <p className="text-muted-foreground">
                      No required documents uploaded yet.
                    </p>
                    <Button variant="outline" className="mt-2">
                      <Upload className="mr-2 size-4" />
                      Upload Document
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="additional" className="mt-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {additionalDocs.length > 0 ? (
                  additionalDocs.map((doc) => (
                    <Card key={doc.id} className="overflow-hidden">
                      <div className="flex p-4">
                        <div className="mr-4 flex items-center justify-center">
                          {getDocumentIcon(doc.documentType as string)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">
                            {formatDocumentType(doc.documentType as string)}
                          </h4>
                          <p className="truncate text-sm text-muted-foreground">
                            {doc.filename}
                          </p>
                          <div className="mt-1 flex items-center">
                            {doc.verified ? (
                              <Badge
                                variant="outline"
                                className="flex items-center gap-1 border-green-200 bg-green-50 text-xs text-green-700"
                              >
                                <CheckCircle2 className="size-3" />
                                Verified
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="border-amber-200 bg-amber-50 text-xs text-amber-700"
                              >
                                Pending Verification
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <CardFooter className="flex justify-end gap-2 bg-gray-50 p-2">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-2 rounded-lg border bg-gray-50 p-6 text-center">
                    <p className="text-muted-foreground">
                      No additional documents uploaded yet.
                    </p>
                    <Button variant="outline" className="mt-2">
                      <Upload className="mr-2 size-4" />
                      Upload Document
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
