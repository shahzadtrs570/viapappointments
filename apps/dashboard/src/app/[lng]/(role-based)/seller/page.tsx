/*eslint-disable react/jsx-max-depth*/
/*eslint-disable import/order*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/

"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@package/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@package/ui/card"
// import { PropertyOverview } from "../../../components/seller/property/PropertyOverview"
// import { DocumentCenter } from "../../../components/seller/documents/DocumentCenter"
// import { OfferManagement } from "../../../components/seller/offers/OfferManagement"

import { PropertyOverview } from "@/components/seller/property/PropertyOverview"
import { DocumentCenter } from "@/components/seller/documents/DocumentCenter"
import { OfferManagement } from "@/components/seller/offers/OfferManagement"
import { Alert, AlertDescription, AlertTitle } from "@package/ui/alert"
import {
  mockOffers,
  mockProperties,
  mockPropertyDocuments,
} from "@/mock-data/properties"
import { Button } from "@package/ui/button"
import { Progress } from "@package/ui/progress"
import {
  Bell,
  Building2,
  FileText,
  HandCoins,
  ChevronRight,
  Clock,
  ArrowUpRight,
  Home,
  Upload,
} from "lucide-react"
import Link from "next/link"

export default function SellerDashboard() {
  // In a real app, this would fetch from an API
  const properties = mockProperties
  const offers = mockOffers
  const documents = mockPropertyDocuments

  const pendingOffers = offers.filter((o) => o.status === "PENDING")
  const pendingDocuments = documents.filter((d) => !d.verified)
  const requiredDocuments = documents.filter((d) =>
    ["DEED", "ENERGY_CERTIFICATE", "SURVEY"].includes(d.documentType)
  )
  const documentCompletionPercentage = Math.round(
    (requiredDocuments.length / 3) * 100
  )

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="container mx-auto space-y-8 py-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Seller Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your property, documents, and offers all in one place.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Properties Listed
            </CardTitle>
            <Building2 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex flex-1 flex-col">
            <div className="flex-1">
              <div className="text-2xl font-bold">{properties.length}</div>
              <p className="text-xs text-muted-foreground">
                Total value:{" "}
                {formatCurrency(
                  properties.reduce((sum, p) => sum + p.estimatedValue, 0)
                )}
              </p>
            </div>
            <Button variant="link" className="mt-4 h-auto w-fit px-0" asChild>
              <Link
                href="/seller/properties"
                className="flex items-center text-sm"
              >
                View Properties
                <ChevronRight className="ml-1 size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
            <HandCoins className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex flex-1 flex-col">
            <div className="flex-1">
              <div className="text-2xl font-bold">{pendingOffers.length}</div>
              <p className="text-xs text-muted-foreground">
                Highest offer:{" "}
                {formatCurrency(
                  Math.max(...offers.map((o) => o.initialPaymentAmount))
                )}
              </p>
            </div>
            <Button variant="link" className="mt-4 h-auto w-fit px-0" asChild>
              <Link href="/seller/offers" className="flex items-center text-sm">
                View Offers
                <ChevronRight className="ml-1 size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Document Status
            </CardTitle>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex flex-1 flex-col">
            <div className="flex-1">
              <div className="text-2xl font-bold">
                {documentCompletionPercentage}%
              </div>
              <div className="mt-2">
                <Progress
                  value={documentCompletionPercentage}
                  className="h-2"
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {pendingDocuments.length} documents pending verification
              </p>
            </div>
            <Button variant="link" className="mt-4 h-auto w-fit px-0" asChild>
              <Link
                href="/seller/documents"
                className="flex items-center text-sm"
              >
                View Documents
                <ChevronRight className="ml-1 size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {pendingOffers.length > 0 && (
        <Alert className="border-amber-200 bg-amber-50">
          <Bell className="size-4 text-amber-600" />
          <AlertTitle>New offers available!</AlertTitle>
          <AlertDescription>
            You have {pendingOffers.length} new{" "}
            {pendingOffers.length === 1 ? "offer" : "offers"} for your{" "}
            {pendingOffers.length === 1 ? "property" : "properties"}. Review
            them in the Offers tab.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingOffers.slice(0, 3).map((offer) => (
                <div key={offer.id} className="flex items-start gap-4">
                  <div className="rounded bg-yellow-100 p-2">
                    <Clock className="size-4 text-yellow-600" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">New Offer Received</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(offer.initialPaymentAmount)} •{" "}
                      {
                        properties.find((p) => p.id === offer.propertyId)
                          ?.address.streetLine1
                      }
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs" asChild>
                    <Link href={`/seller/offers/${offer.id}`}>View</Link>
                  </Button>
                </div>
              ))}
              {pendingDocuments.slice(0, 2).map((doc) => (
                <div key={doc.id} className="flex items-start gap-4">
                  <div className="rounded bg-blue-100 p-2">
                    <FileText className="size-4 text-blue-600" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">
                      Document Pending Verification
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {
                        properties.find((p) => p.id === doc.propertyId)?.address
                          .streetLine1
                      }
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs" asChild>
                    <Link href="/seller/documents">View</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Quick Actions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Button variant="outline" className="justify-start" asChild>
                <Link
                  href="/seller/properties/add"
                  className="flex items-center"
                >
                  <Home className="mr-2 size-4" />
                  Add New Property
                  <ArrowUpRight className="ml-auto size-4" />
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/seller/documents" className="flex items-center">
                  <Upload className="mr-2 size-4" />
                  Upload Document
                  <ArrowUpRight className="ml-auto size-4" />
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/seller/offers" className="flex items-center">
                  <HandCoins className="mr-2 size-4" />
                  Review Offers
                  <ArrowUpRight className="ml-auto size-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow">
        <Tabs defaultValue="property" className="w-full">
          <div className="border-b bg-muted/50">
            <div className="container">
              <TabsList className="h-12 w-full justify-start space-x-6 bg-transparent">
                <TabsTrigger
                  value="property"
                  className="relative h-12 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  <div className="flex items-center space-x-2">
                    <Home className="size-5" />
                    <span>Properties</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="relative h-12 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="size-5" />
                    <span>Documents</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="offers"
                  className="relative h-12 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  <div className="flex items-center space-x-2">
                    <HandCoins className="size-5" />
                    <span>Offers</span>
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <div className="p-6">
            <TabsContent value="property" className="mt-0 border-none p-0">
              <div className="mb-6 flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Your Properties
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Manage and monitor all your listed properties
                  </p>
                </div>
                <Button asChild>
                  <Link
                    href="/seller/properties/add"
                    className="flex items-center gap-2"
                  >
                    <Home className="size-4" />
                    Add Property
                  </Link>
                </Button>
              </div>
              <PropertyOverview />
            </TabsContent>

            <TabsContent value="documents" className="mt-0 border-none p-0">
              <div className="mb-6 flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Property Documents
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Upload and manage your property documentation
                  </p>
                </div>
                <Button asChild>
                  <Link
                    href="/seller/documents/upload"
                    className="flex items-center gap-2"
                  >
                    <Upload className="size-4" />
                    Upload Document
                  </Link>
                </Button>
              </div>
              <DocumentCenter />
            </TabsContent>

            <TabsContent value="offers" className="mt-0 border-none p-0">
              <div className="mb-6 flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Property Offers
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Review and manage offers on your properties
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <Link
                    href="/seller/offers/history"
                    className="flex items-center gap-2"
                  >
                    <Clock className="size-4" />
                    View History
                  </Link>
                </Button>
              </div>
              <OfferManagement />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
