/*eslint-disable react/jsx-sort-props*/
/*eslint-disable import/order*/

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@package/ui/card"
import { Button } from "@package/ui/button"
import { ArrowLeft, Edit, Search } from "lucide-react"
import Link from "next/link"
import { findBuyBoxById } from "@/mock-data"

export default function BuyBoxPage({ params }: { params: { id: string } }) {
  const buyBox = findBuyBoxById(params.id)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value)
  }

  if (!buyBox) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold">Buy Box not found</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/fund-buyer/buy-boxes">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{buyBox.name}</h1>
          <p className="text-muted-foreground">
            {buyBox.description || "No description provided"}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buy Box Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold">
                {formatCurrency(buyBox.totalValue)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Monthly Income</p>
              <p className="text-2xl font-bold">
                {formatCurrency(buyBox.estimatedMonthlyIncome)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="text-2xl font-bold capitalize">
                {buyBox.status.toLowerCase()}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" size="lg" asChild>
              <Link href={`/fund-buyer/buy-boxes/${params.id}/edit`}>
                <Edit className="mr-2 size-4" />
                Edit Buy Box
              </Link>
            </Button>
            <Button size="lg" asChild>
              <Link href={`/fund-buyer/buy-boxes/${params.id}/matches`}>
                <Search className="mr-2 size-4" />
                View Matches
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
