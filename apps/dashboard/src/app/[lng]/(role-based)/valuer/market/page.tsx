/*eslint-disable import/order*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/
"use client"

import { useState } from "react"
import { MarketAnalysis } from "@/components/valuer/market/MarketAnalysis"
import { Alert, AlertDescription, AlertTitle } from "@package/ui/alert"
import { Button } from "@package/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@package/ui/card"
import { Input } from "@package/ui/input"
import { TrendingUp, Search, BarChart3 } from "lucide-react"
import { RoleBasedLayout } from "@/components/Layouts/RoleBasedLayout"

export default function MarketAnalysisPage() {
  const [postcode, setPostcode] = useState("")
  const [searchedPostcode, setSearchedPostcode] = useState("")
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "E1 6AN",
    "SW1A 1AA",
    "M1 1AE",
    "B1 1HQ",
    "EH1 1YZ",
  ])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (postcode.trim()) {
      setSearchedPostcode(postcode.trim())
      if (!recentSearches.includes(postcode.trim())) {
        setRecentSearches([postcode.trim(), ...recentSearches.slice(0, 4)])
      }
    }
  }

  return (
    <RoleBasedLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Market Analysis</h1>
        <p className="text-muted-foreground">
          Research local market trends, comparable sales, and area statistics to
          inform property valuations.
        </p>

        <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="col-span-1 md:col-span-3">
            <CardHeader>
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <CardTitle>Local Market Search</CardTitle>
                  <CardDescription>
                    Enter a postcode to analyze market data for that area
                  </CardDescription>
                </div>
                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Enter postcode..."
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      className="w-full pl-8 sm:w-[200px]"
                    />
                  </div>
                  <Button type="submit">Search</Button>
                </form>
              </div>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6">
                <TrendingUp className="size-4" />
                <AlertTitle>Market Insights</AlertTitle>
                <AlertDescription>
                  Analyzing market data helps provide more accurate valuations
                  by considering recent sales, local trends, and area
                  statistics.
                </AlertDescription>
              </Alert>

              {searchedPostcode ? (
                <MarketAnalysis initialPostcode={searchedPostcode} />
              ) : (
                <div className="py-12 text-center">
                  <BarChart3 className="mx-auto size-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">
                    Enter a postcode to view market analysis
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                    Search for any UK postcode to view detailed market data,
                    including price trends, comparable sales, and area
                    statistics.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Searches</CardTitle>
              <CardDescription>
                Quick access to recently analyzed areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left"
                    onClick={() => {
                      setPostcode(search)
                      setSearchedPostcode(search)
                    }}
                  >
                    <Search className="mr-2 size-4" />
                    {search}
                  </Button>
                ))}
              </div>

              <div className="mt-6">
                <h4 className="mb-3 text-sm font-medium">Featured Areas</h4>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left"
                    onClick={() => {
                      setPostcode("SW1A 1AA")
                      setSearchedPostcode("SW1A 1AA")
                    }}
                  >
                    <span className="text-primary">●</span>
                    <span className="ml-2">Central London</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left"
                    onClick={() => {
                      setPostcode("M1 1AE")
                      setSearchedPostcode("M1 1AE")
                    }}
                  >
                    <span className="text-primary">●</span>
                    <span className="ml-2">Manchester</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left"
                    onClick={() => {
                      setPostcode("B1 1HQ")
                      setSearchedPostcode("B1 1HQ")
                    }}
                  >
                    <span className="text-primary">●</span>
                    <span className="ml-2">Birmingham</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left"
                    onClick={() => {
                      setPostcode("EH1 1YZ")
                      setSearchedPostcode("EH1 1YZ")
                    }}
                  >
                    <span className="text-primary">●</span>
                    <span className="ml-2">Edinburgh</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleBasedLayout>
  )
}
