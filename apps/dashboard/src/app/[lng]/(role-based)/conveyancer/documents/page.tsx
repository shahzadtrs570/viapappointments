/*eslint-disable import/order*/
/*eslint-disable react/jsx-sort-props*/
"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@package/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@package/ui/tabs"
import { FileText, Home, Search } from "lucide-react"
import { Input } from "@package/ui/input"
import { Badge } from "@package/ui/badge"
import { Button } from "@package/ui/button"
import { ScrollArea } from "@package/ui/scroll-area"
import { DocumentManagement } from "@/components/conveyancer/documents/DocumentManagement"
import { RoleBasedLayout } from "@/components/Layouts/RoleBasedLayout"

interface Property {
  id: string
  address: string
  postcode: string
  documentsCount: number
  pendingDocuments: number
}

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState("all_documents")
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null
  )
  const [searchPropertyQuery, setSearchPropertyQuery] = useState("")

  // Mock property data
  const properties: Property[] = [
    {
      id: "prop1",
      address: "15 Willow Avenue, Manchester",
      postcode: "M14 5TP",
      documentsCount: 8,
      pendingDocuments: 2,
    },
    {
      id: "prop2",
      address: "42 Oak Street, London",
      postcode: "E1 6AN",
      documentsCount: 5,
      pendingDocuments: 1,
    },
    {
      id: "prop3",
      address: "7 Maple Road, Birmingham",
      postcode: "B15 2TT",
      documentsCount: 12,
      pendingDocuments: 0,
    },
    {
      id: "prop4",
      address: "29 Pine Lane, Leeds",
      postcode: "LS1 4DL",
      documentsCount: 4,
      pendingDocuments: 3,
    },
    {
      id: "prop5",
      address: "8 Elm Court, Bristol",
      postcode: "BS1 5AZ",
      documentsCount: 6,
      pendingDocuments: 0,
    },
  ]

  const filteredProperties = properties.filter(
    (prop) =>
      prop.address.toLowerCase().includes(searchPropertyQuery.toLowerCase()) ||
      prop.postcode.toLowerCase().includes(searchPropertyQuery.toLowerCase())
  )

  const selectedProperty = selectedPropertyId
    ? properties.find((prop) => prop.id === selectedPropertyId)
    : null

  return (
    <RoleBasedLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Document Management
        </h1>
        <p className="text-muted-foreground">
          Review, approve, and manage legal documents for all properties.
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-2">
            <TabsTrigger
              value="all_documents"
              className="flex items-center gap-2"
            >
              <FileText className="size-4" />
              <span>All Documents</span>
            </TabsTrigger>
            <TabsTrigger
              value="by_property"
              className="flex items-center gap-2"
            >
              <Home className="size-4" />
              <span>By Property</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all_documents">
            <DocumentManagement />
          </TabsContent>

          <TabsContent value="by_property">
            {selectedProperty ? (
              <div>
                <Button
                  variant="outline"
                  onClick={() => setSelectedPropertyId(null)}
                  className="mb-4"
                >
                  ← Back to property list
                </Button>
                <DocumentManagement
                  propertyId={selectedProperty.id}
                  propertyAddress={selectedProperty.address}
                />
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Select a Property</CardTitle>
                      <CardDescription>
                        Choose a property to view and manage its documents
                      </CardDescription>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search properties..."
                        className="w-[300px] pl-8"
                        value={searchPropertyQuery}
                        onChange={(e) => setSearchPropertyQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {filteredProperties.map((property) => (
                        <Card
                          key={property.id}
                          className="cursor-pointer transition-colors hover:border-primary"
                          onClick={() => setSelectedPropertyId(property.id)}
                        >
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">
                              {property.address}
                            </CardTitle>
                            <CardDescription>
                              {property.postcode}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  {property.documentsCount} document
                                  {property.documentsCount !== 1 ? "s" : ""}
                                </p>
                              </div>
                              {property.pendingDocuments > 0 && (
                                <Badge className="bg-amber-500">
                                  {property.pendingDocuments} Pending
                                </Badge>
                              )}
                            </div>
                            <Button className="mt-4 w-full" variant="outline">
                              View Documents
                            </Button>
                          </CardContent>
                        </Card>
                      ))}

                      {filteredProperties.length === 0 && (
                        <div className="col-span-2 p-8 text-center text-muted-foreground">
                          No properties found matching your search.
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </RoleBasedLayout>
  )
}
