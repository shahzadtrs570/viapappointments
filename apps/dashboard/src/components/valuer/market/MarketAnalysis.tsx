/*eslint-disable import/order*/
/*eslint-disable react/function-component-definition*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable @typescript-eslint/consistent-type-imports*/
/*eslint-disable @typescript-eslint/no-unnecessary-condition*/
/*eslint-disable max-lines*/
/*eslint-disable react/no-unescaped-entities*/

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
import { Button } from "@package/ui/button"
import { Input } from "@package/ui/input"
import { Label } from "@package/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@package/ui/select"
import { Badge } from "@package/ui/badge"
import {
  TrendingUp,
  Home,
  Map,
  BarChart3,
  LineChart,
  Search,
  Calendar,
  ExternalLink,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@package/ui/table"

// Mock area data
const areaData = {
  postcode: "E1 6AN",
  areaName: "Aldgate, London",
  averagePrice: "£425,000",
  priceChange: "+3.2%",
  averageRent: "£1,800 pcm",
  rentChange: "+2.5%",
  averageDaysOnMarket: 42,
  totalPropertiesForSale: 128,
  totalPropertiesForRent: 85,
  demographics: {
    averageAge: 34,
    homeowners: "38%",
    renters: "62%",
    averageIncome: "£48,000",
  },
  amenities: {
    schools: 12,
    parks: 5,
    restaurants: 48,
    transportLinks: 8,
    hospitals: 2,
  },
}

// Mock property price history
const priceHistory = [
  { month: "Jan 2023", price: 395000 },
  { month: "Feb 2023", price: 398000 },
  { month: "Mar 2023", price: 400000 },
  { month: "Apr 2023", price: 405000 },
  { month: "May 2023", price: 402000 },
  { month: "Jun 2023", price: 410000 },
  { month: "Jul 2023", price: 415000 },
  { month: "Aug 2023", price: 412000 },
  { month: "Sep 2023", price: 418000 },
  { month: "Oct 2023", price: 420000 },
  { month: "Nov 2023", price: 422000 },
  { month: "Dec 2023", price: 425000 },
  { month: "Jan 2024", price: 423000 },
  { month: "Feb 2024", price: 428000 },
  { month: "Mar 2024", price: 432000 },
  { month: "Apr 2024", price: 425000 },
]

// Mock property types in area
const propertyTypes = [
  { type: "Flat", percentage: 45, averagePrice: "£380,000", change: "+2.8%" },
  {
    type: "Terraced",
    percentage: 28,
    averagePrice: "£520,000",
    change: "+3.5%",
  },
  {
    type: "Semi-Detached",
    percentage: 18,
    averagePrice: "£650,000",
    change: "+4.2%",
  },
  {
    type: "Detached",
    percentage: 9,
    averagePrice: "£890,000",
    change: "+2.1%",
  },
]

// Mock comparable sales
const comparableSales = [
  {
    id: "cs1",
    address: "12B Leman Street, London",
    postcode: "E1 8EQ",
    propertyType: "2 bed flat",
    saleDate: "2024-03-15",
    salePrice: "£420,000",
    sizeSqFt: 750,
    priceSqFt: "£560",
    distance: "0.3 miles",
  },
  {
    id: "cs2",
    address: "45 Commercial Road, London",
    postcode: "E1 1LN",
    propertyType: "2 bed flat",
    saleDate: "2024-02-28",
    salePrice: "£435,000",
    sizeSqFt: 780,
    priceSqFt: "£558",
    distance: "0.5 miles",
  },
  {
    id: "cs3",
    address: "8 Prescot Street, London",
    postcode: "E1 8AZ",
    propertyType: "2 bed flat",
    saleDate: "2024-02-12",
    salePrice: "£415,000",
    sizeSqFt: 720,
    priceSqFt: "£576",
    distance: "0.2 miles",
  },
  {
    id: "cs4",
    address: "22A Whitechapel Road, London",
    postcode: "E1 1EJ",
    propertyType: "2 bed flat",
    saleDate: "2024-01-25",
    salePrice: "£395,000",
    sizeSqFt: 710,
    priceSqFt: "£556",
    distance: "0.7 miles",
  },
  {
    id: "cs5",
    address: "34 Mansell Street, London",
    postcode: "E1 8AA",
    propertyType: "2 bed flat",
    saleDate: "2024-01-10",
    salePrice: "£428,000",
    sizeSqFt: 760,
    priceSqFt: "£563",
    distance: "0.4 miles",
  },
]

interface MarketAnalysisProps {
  initialPostcode?: string
  propertyType?: string
}

export function MarketAnalysis({
  initialPostcode = "E1 6AN",
  propertyType = "Flat",
}: MarketAnalysisProps) {
  const [activeTab, setActiveTab] = useState("market_trends")
  const [postcode, setPostcode] = useState(initialPostcode)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPropertyType, setSelectedPropertyType] = useState(propertyType)
  const [timeRange, setTimeRange] = useState("12m")

  const handlePostcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostcode(e.target.value)
  }

  const handlePropertyTypeChange = (value: string) => {
    setSelectedPropertyType(value)
  }

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const filteredComparables = comparableSales.filter(
    (sale) =>
      sale.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.postcode.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date)
  }

  // This would be replaced with actual chart rendering in a real app
  const renderPriceChart = () => {
    // Mock chart rendering - in a real app, use a library like Recharts or Chart.js
    return (
      <div className="relative h-64 w-full rounded-md border bg-muted/20 p-4">
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <LineChart className="size-12 opacity-50" />
          <span className="ml-2 text-sm">
            Chart visualization would appear here in production
          </span>
        </div>
        <div className="absolute inset-x-4 bottom-4">
          <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary" style={{ width: "70%" }} />
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            {priceHistory
              .filter((_, index) => index % 3 === 0)
              .map((item, index) => (
                <span key={index}>{item.month.split(" ")[0]}</span>
              ))}
          </div>
        </div>
      </div>
    )
  }

  const renderPropertyTypeChart = () => {
    // Mock chart rendering
    return (
      <div className="relative h-64 w-full rounded-md border bg-muted/20 p-4">
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <BarChart3 className="size-12 opacity-50" />
          <span className="ml-2 text-sm">
            Chart visualization would appear here in production
          </span>
        </div>
        <div className="absolute inset-x-4 bottom-4">
          <div className="grid grid-cols-4 gap-2">
            {propertyTypes.map((type, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="relative h-24 w-full overflow-hidden rounded-t-sm bg-muted">
                  <div
                    className="absolute bottom-0 w-full bg-primary"
                    style={{ height: `${type.percentage}%` }}
                  />
                </div>
                <span className="mt-1 text-xs text-muted-foreground">
                  {type.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col gap-4 pb-2 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Market Analysis</CardTitle>
          <CardDescription>
            Review market data for the {areaData.areaName} area
          </CardDescription>
        </div>
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="max-w-[180px]">
            <Label htmlFor="postcode" className="sr-only">
              Postcode
            </Label>
            <Input
              id="postcode"
              placeholder="Enter postcode..."
              value={postcode}
              onChange={handlePostcodeChange}
              className="h-9"
            />
          </div>
          <Button type="submit" size="sm">
            Search
          </Button>
        </form>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              value="market_trends"
              className="flex items-center gap-2"
            >
              <TrendingUp className="size-4" />
              <span>Market Trends</span>
            </TabsTrigger>
            <TabsTrigger
              value="comparable_sales"
              className="flex items-center gap-2"
            >
              <Home className="size-4" />
              <span>Comparable Sales</span>
            </TabsTrigger>
            <TabsTrigger
              value="area_statistics"
              className="flex items-center gap-2"
            >
              <Map className="size-4" />
              <span>Area Statistics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="market_trends" className="mt-4 space-y-6">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-medium">
                Price Trends for {areaData.areaName}
              </h3>
              <div className="flex items-center gap-2">
                <Label htmlFor="property-type" className="text-sm">
                  Property Type:
                </Label>
                <Select
                  value={selectedPropertyType}
                  onValueChange={handlePropertyTypeChange}
                >
                  <SelectTrigger id="property-type" className="h-9 w-[140px]">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Flat">Flat</SelectItem>
                    <SelectItem value="Terraced">Terraced</SelectItem>
                    <SelectItem value="Semi-Detached">Semi-Detached</SelectItem>
                    <SelectItem value="Detached">Detached</SelectItem>
                  </SelectContent>
                </Select>

                <Label htmlFor="time-range" className="ml-2 text-sm">
                  Time Range:
                </Label>
                <Select value={timeRange} onValueChange={handleTimeRangeChange}>
                  <SelectTrigger id="time-range" className="h-9 w-[100px]">
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6m">6 months</SelectItem>
                    <SelectItem value="12m">12 months</SelectItem>
                    <SelectItem value="3y">3 years</SelectItem>
                    <SelectItem value="5y">5 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price History Chart */}
            {renderPriceChart()}

            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Average Price
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {areaData.averagePrice}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    <span className="text-green-600">
                      {areaData.priceChange}
                    </span>{" "}
                    year-on-year
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Properties For Sale
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {areaData.totalPropertiesForSale}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    In {areaData.areaName}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Avg. Days on Market
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {areaData.averageDaysOnMarket}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    -3 days from last quarter
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Rent Price (PCM)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {areaData.averageRent}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    <span className="text-green-600">
                      {areaData.rentChange}
                    </span>{" "}
                    year-on-year
                  </p>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-medium">
                Property Types in {areaData.areaName}
              </h3>
              {/* Property Type Distribution Chart */}
              {renderPropertyTypeChart()}

              <Table className="mt-4">
                <TableHeader>
                  <TableRow>
                    <TableHead>Property Type</TableHead>
                    <TableHead>Distribution</TableHead>
                    <TableHead>Average Price</TableHead>
                    <TableHead>Annual Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {propertyTypes.map((type, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{type.type}</TableCell>
                      <TableCell>{type.percentage}%</TableCell>
                      <TableCell>{type.averagePrice}</TableCell>
                      <TableCell className="text-green-600">
                        {type.change}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="comparable_sales" className="mt-4 space-y-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">
                Recent Sales Near {areaData.postcode}
              </h3>
              <div className="relative max-w-sm">
                <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by address or postcode..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableHead>Property Type</TableHead>
                  <TableHead>Sale Date</TableHead>
                  <TableHead>Sale Price</TableHead>
                  <TableHead>£/sqft</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComparables.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">
                      {sale.address}
                      <div className="text-xs text-muted-foreground">
                        {sale.postcode}
                      </div>
                    </TableCell>
                    <TableCell>{sale.propertyType}</TableCell>
                    <TableCell>{formatDate(sale.saleDate)}</TableCell>
                    <TableCell className="font-medium">
                      {sale.salePrice}
                    </TableCell>
                    <TableCell>{sale.priceSqFt}</TableCell>
                    <TableCell>{sale.distance}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        Details
                        <ExternalLink className="ml-2 size-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredComparables.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No comparable sales found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="area_statistics" className="mt-4 space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Demographics in {areaData.areaName}</CardTitle>
                  <CardDescription>
                    Population and housing statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Average Age
                      </span>
                      <span className="font-medium">
                        {areaData.demographics.averageAge}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Homeowners
                      </span>
                      <span className="font-medium">
                        {areaData.demographics.homeowners}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Renters
                      </span>
                      <span className="font-medium">
                        {areaData.demographics.renters}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Average Income
                      </span>
                      <span className="font-medium">
                        {areaData.demographics.averageIncome}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Local Amenities</CardTitle>
                  <CardDescription>
                    Services and facilities in the area
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Schools
                      </span>
                      <span className="font-medium">
                        {areaData.amenities.schools}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Parks & Green Spaces
                      </span>
                      <span className="font-medium">
                        {areaData.amenities.parks}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Restaurants & Cafés
                      </span>
                      <span className="font-medium">
                        {areaData.amenities.restaurants}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Transport Links
                      </span>
                      <span className="font-medium">
                        {areaData.amenities.transportLinks}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Hospitals & Health Centers
                      </span>
                      <span className="font-medium">
                        {areaData.amenities.hospitals}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Transport & Connectivity</CardTitle>
                <CardDescription>
                  Transportation options and commute data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="mb-2 text-sm font-medium">
                      Public Transport
                    </h4>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="bg-blue-500">
                        Aldgate Underground (3 min walk)
                      </Badge>
                      <Badge className="bg-blue-500">
                        Aldgate East Underground (5 min walk)
                      </Badge>
                      <Badge className="bg-blue-500">
                        Liverpool Street Station (12 min walk)
                      </Badge>
                      <Badge className="bg-blue-500">
                        Bus Routes: 15, 25, 40, 135, 205
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2 text-sm font-medium">
                      Average Commute Times
                    </h4>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                      <div className="rounded-md border bg-muted/10 p-3">
                        <div className="text-xs text-muted-foreground">
                          To City of London
                        </div>
                        <div className="font-medium">12 minutes</div>
                      </div>
                      <div className="rounded-md border bg-muted/10 p-3">
                        <div className="text-xs text-muted-foreground">
                          To Canary Wharf
                        </div>
                        <div className="font-medium">18 minutes</div>
                      </div>
                      <div className="rounded-md border bg-muted/10 p-3">
                        <div className="text-xs text-muted-foreground">
                          To West End
                        </div>
                        <div className="font-medium">25 minutes</div>
                      </div>
                      <div className="rounded-md border bg-muted/10 p-3">
                        <div className="text-xs text-muted-foreground">
                          To King's Cross
                        </div>
                        <div className="font-medium">22 minutes</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Planning & Development</CardTitle>
                <CardDescription>
                  Recent and planned developments in the area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 rounded-lg border p-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Calendar className="size-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold">
                        Goodman's Fields Development
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Mixed-use development with 1000+ new homes, scheduled
                        for completion in 2024.
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="outline">Residential</Badge>
                        <Badge variant="outline">Commercial</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-lg border p-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Calendar className="size-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold">
                        Aldgate Place Phase 2
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        136 new residential units, retail space, and public
                        realm improvements.
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="outline">Residential</Badge>
                        <Badge variant="outline">Retail</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-lg border p-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Calendar className="size-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold">
                        Transport for London Cycling Improvements
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        New cycling infrastructure and safety improvements due
                        for completion in 2025.
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="outline">Infrastructure</Badge>
                        <Badge variant="outline">Transport</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
