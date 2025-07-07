/*eslint-disable react/jsx-sort-props*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable import/order*/
/*eslint-disable sort-imports*/

"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@package/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@package/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@package/ui/alert"
import { ArrowUpDown, Building2, LineChart, Package } from "lucide-react"
import PropertySearch from "@/components/fund-buyer/search/PropertySearch"
// import { BuyBoxManagement } from "../../../components/fund-buyer/buy-box/BuyBoxManagement"
// import OfferCreation from "../../../components/fund-buyer/offers/OfferCreation"

import { BuyBoxManagement } from "@/components/fund-buyer/buy-box/BuyBoxManagement"
import OfferCreation from "@/components/fund-buyer/offers/OfferCreation"

export default function FundBuyerDashboard() {
  return (
    <div className="container mx-auto space-y-8 py-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Fund Buyer Dashboard</h1>
        <p className="text-muted-foreground">
          Search properties, manage Buy Boxes, and create offers
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Portfolio Value
            </CardTitle>
            <LineChart className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£1,245,000</div>
            <p className="text-xs text-muted-foreground">
              +£215,000 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Properties</CardTitle>
            <Building2 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Buy Boxes</CardTitle>
            <Package className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">+1 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average ROI</CardTitle>
            <ArrowUpDown className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.2%</div>
            <p className="text-xs text-muted-foreground">
              +1.1% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Alert className="border-primary/30 bg-primary/10">
        <Package className="size-4 text-primary" />
        <AlertTitle>New Buy Box available!</AlertTitle>
        <AlertDescription>
          A new UK Prime Buy Box has been created. You can review it in the Buy
          Box Management tab.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="property-search" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="property-search">Property Search</TabsTrigger>
          <TabsTrigger value="buy-box">Buy Box Management</TabsTrigger>
          <TabsTrigger value="offers">Offer Creation</TabsTrigger>
        </TabsList>

        <TabsContent value="property-search" className="mt-6">
          <PropertySearch />
        </TabsContent>

        <TabsContent value="buy-box" className="mt-6">
          <BuyBoxManagement />
        </TabsContent>

        <TabsContent value="offers" className="mt-6">
          <OfferCreation />
        </TabsContent>
      </Tabs>
    </div>
  )
}
