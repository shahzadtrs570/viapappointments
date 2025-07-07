/*eslint-disable import/order*/
/*eslint-disable react/jsx-sort-props*/

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@package/ui/card"
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
  AlertCircle,
  CheckCircle2,
  FileText,
  Search,
  XCircle,
} from "lucide-react"
import { mockContracts } from "@/mock-data"

type ContractStatus = "ALL" | "PENDING" | "COMPLETED" | "EXPIRED"

export default function ContractsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<ContractStatus>("ALL")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"date" | "amount">("date")

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "EXPIRED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return <CheckCircle2 className="size-4" />
      case "PENDING":
        return <AlertCircle className="size-4" />
      case "EXPIRED":
        return <XCircle className="size-4" />
      default:
        return null
    }
  }

  const filteredContracts = mockContracts
    .filter(
      (contract) =>
        (activeTab === "ALL" || contract.status === activeTab) &&
        (contract.buyBoxName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
          contract.contractNumber
            .toLowerCase()
            .includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      return b.totalAmount - a.totalAmount
    })

  return (
    <div className="container mx-auto space-y-8 py-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Contracts</h1>
          <p className="text-muted-foreground">
            View and manage all your property contracts
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search contracts..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={sortBy}
          onValueChange={(value: "date" | "amount") => setSortBy(value)}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Sort by Date</SelectItem>
            <SelectItem value="amount">Sort by Amount</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs
        defaultValue="ALL"
        className="w-full"
        onValueChange={(value) => setActiveTab(value as ContractStatus)}
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ALL">All</TabsTrigger>
          <TabsTrigger value="PENDING">Pending</TabsTrigger>
          <TabsTrigger value="COMPLETED">Completed</TabsTrigger>
          <TabsTrigger value="EXPIRED">Expired</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-4">
            {filteredContracts.length === 0 ? (
              <Card>
                <CardContent className="py-8">
                  <div className="space-y-2 text-center">
                    <FileText className="mx-auto size-8 text-muted-foreground" />
                    <h3 className="font-semibold">No contracts found</h3>
                    <p className="text-sm text-muted-foreground">
                      {searchQuery
                        ? "Try adjusting your search terms"
                        : "When you have active contracts, they will appear here"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredContracts.map((contract) => (
                <Card
                  key={contract.id}
                  className="cursor-pointer transition-shadow hover:shadow-md"
                  onClick={() =>
                    router.push(
                      `/fund-buyer/offers/${contract.offerId}/contract`
                    )
                  }
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">
                            {contract.buyBoxName}
                          </h3>
                          <Badge variant="outline">
                            Contract #{contract.contractNumber}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Created on {formatDate(contract.createdAt)}
                        </p>
                      </div>

                      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            Total Value
                          </p>
                          <p className="font-semibold">
                            {formatCurrency(contract.totalAmount)}
                          </p>
                        </div>
                        <Badge className={getStatusColor(contract.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(contract.status)}
                            {contract.status}
                          </span>
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {contract.propertyAddresses.map((address, index) => (
                        <Badge key={index} variant="secondary">
                          {address}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
