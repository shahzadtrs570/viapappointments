/*eslint-disable react/jsx-sort-props*/
/*eslint-disable import/order*/
/*eslint-disable sort-imports*/

"use client"

import { useState } from "react"
import { Card, CardContent } from "@package/ui/card"
import { Button } from "@package/ui/button"
import { Badge } from "@package/ui/badge"
import { Input } from "@package/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@package/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@package/ui/select"
import {
  Search,
  Building2,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Calendar,
  Banknote,
  Percent,
  SlidersHorizontal,
} from "lucide-react"
import Link from "next/link"
import { mockBuyBoxOffers, findBuyBoxById } from "@/mock-data"
import type { OfferStatus } from "@/mock-data/types"

export default function OffersPage() {
  const [activeTab, setActiveTab] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date-desc")

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

  const filteredOffers = mockBuyBoxOffers.filter((offer) => {
    const buyBox = findBuyBoxById(offer.buyBoxId)
    if (!buyBox) return false

    const matchesSearch =
      searchTerm === "" ||
      buyBox.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      activeTab === "all" ||
      (activeTab === "pending" && offer.status === "PENDING") ||
      (activeTab === "accepted" && offer.status === "ACCEPTED") ||
      (activeTab === "rejected" &&
        (offer.status === "REJECTED" || offer.status === "EXPIRED"))

    return matchesSearch && matchesStatus
  })

  const sortedOffers = [...filteredOffers].sort((a, b) => {
    switch (sortBy) {
      case "date-desc":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "date-asc":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "amount-desc":
        return b.initialPaymentAmount - a.initialPaymentAmount
      case "amount-asc":
        return a.initialPaymentAmount - b.initialPaymentAmount
      default:
        return 0
    }
  })

  return (
    <div className="container mx-auto space-y-8 py-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">My Offers</h1>
          <p className="text-muted-foreground">
            Track and manage your offers on buy boxes
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by buy box name..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SlidersHorizontal className="mr-2 size-4" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Newest First</SelectItem>
            <SelectItem value="date-asc">Oldest First</SelectItem>
            <SelectItem value="amount-desc">Highest Amount</SelectItem>
            <SelectItem value="amount-asc">Lowest Amount</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Offers</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-6">
            {sortedOffers.map((offer) => {
              const buyBox = findBuyBoxById(offer.buyBoxId)
              if (!buyBox) return null

              return (
                <Card key={offer.id}>
                  <CardContent className="p-6">
                    <div className="grid gap-6 md:grid-cols-4">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {buyBox.name}
                          </h3>
                          <p className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="size-3" />
                            Offered on{" "}
                            {new Date(offer.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className={getStatusColor(offer.status)}
                        >
                          <span className="flex items-center gap-1">
                            {getStatusIcon(offer.status)}
                            {offer.status}
                          </span>
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Initial Payment
                        </p>
                        <p className="flex items-center gap-1 text-lg font-semibold">
                          <Banknote className="size-4 text-muted-foreground" />
                          {formatCurrency(offer.initialPaymentAmount)}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Monthly Payment
                        </p>
                        <p className="flex items-center gap-1 text-lg font-semibold">
                          <Banknote className="size-4 text-muted-foreground" />
                          {formatCurrency(offer.totalMonthlyPaymentAmount)}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Indexation Rate
                        </p>
                        <p className="flex items-center gap-1 text-lg font-semibold">
                          <Percent className="size-4 text-muted-foreground" />
                          {offer.averageIndexationRate}%
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-4">
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={`/fund-buyer/buy-boxes/${buyBox.id}`}
                          className="flex items-center gap-2"
                        >
                          <Building2 className="size-4" />
                          View Buy Box
                        </Link>
                      </Button>
                      {offer.status === "ACCEPTED" && (
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            href={`/fund-buyer/offers/${offer.id}/contract`}
                            className="flex items-center gap-2"
                          >
                            <FileText className="size-4" />
                            View Contract
                          </Link>
                        </Button>
                      )}
                      <Button variant="default" size="sm" asChild>
                        <Link
                          href={`/fund-buyer/offers/${offer.id}`}
                          className="flex items-center gap-2"
                        >
                          View Details
                          <ArrowUpRight className="size-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {sortedOffers.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  <p>No offers found matching your criteria.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
