/*eslint-disable import/order*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable max-lines*/

"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@package/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@package/ui/card"
import {
  AlertCircle,
  Home,
  Clock,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  Search,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@package/ui/alert"
import { Badge } from "@package/ui/badge"
import { Button } from "@package/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@package/ui/table"
import { Input } from "@package/ui/input"
import { RoleBasedLayout } from "@/components/Layouts/RoleBasedLayout"

// Mock data for the dashboard
const valuationStats = {
  pendingValuations: 8,
  completedThisMonth: 15,
  averageTurnaround: "2.3 days",
  recentActivity: 5,
}

const pendingValuations = [
  {
    id: "val1",
    propertyAddress: "15 Willow Avenue, Manchester",
    postcode: "M14 5TP",
    propertyType: "Semi-detached house",
    requestDate: "2024-04-01T10:30:00Z",
    urgency: "high",
    assignedTo: "You",
  },
  {
    id: "val2",
    propertyAddress: "42 Oak Street, London",
    postcode: "E1 6AN",
    propertyType: "Apartment",
    requestDate: "2024-04-01T14:15:00Z",
    urgency: "medium",
    assignedTo: "You",
  },
  {
    id: "val3",
    propertyAddress: "7 Maple Road, Birmingham",
    postcode: "B15 2TT",
    propertyType: "Detached house",
    requestDate: "2024-03-31T09:45:00Z",
    urgency: "medium",
    assignedTo: "Sarah Johnson",
  },
  {
    id: "val4",
    propertyAddress: "29 Pine Lane, Leeds",
    postcode: "LS1 4DL",
    propertyType: "Terraced house",
    requestDate: "2024-03-30T16:20:00Z",
    urgency: "low",
    assignedTo: "Michael Brown",
  },
  {
    id: "val5",
    propertyAddress: "8 Elm Court, Bristol",
    postcode: "BS1 5AZ",
    propertyType: "Apartment",
    requestDate: "2024-03-29T11:10:00Z",
    urgency: "high",
    assignedTo: "You",
  },
]

const recentValuations = [
  {
    id: "comp1",
    propertyAddress: "104 Birch Street, Sheffield",
    postcode: "S1 2BN",
    propertyType: "Terraced house",
    completionDate: "2024-04-01T15:30:00Z",
    valuationAmount: "£245,000",
  },
  {
    id: "comp2",
    propertyAddress: "56 Aspen Close, Nottingham",
    postcode: "NG1 5AS",
    propertyType: "Semi-detached house",
    completionDate: "2024-03-31T12:45:00Z",
    valuationAmount: "£320,000",
  },
  {
    id: "comp3",
    propertyAddress: "23 Cedar Avenue, Liverpool",
    postcode: "L1 3CD",
    propertyType: "Detached house",
    completionDate: "2024-03-30T10:15:00Z",
    valuationAmount: "£410,000",
  },
  {
    id: "comp4",
    propertyAddress: "17 Hawthorn Lane, Newcastle",
    postcode: "NE1 6HL",
    propertyType: "Apartment",
    completionDate: "2024-03-29T14:20:00Z",
    valuationAmount: "£175,000",
  },
]

export default function ValuerDashboard() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPendingValuations = pendingValuations.filter(
    (val) =>
      val.propertyAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      val.postcode.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date)
  }

  return (
    <RoleBasedLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Valuer Dashboard</h1>
        <p className="text-muted-foreground">
          Manage property valuations, reports, and client communication.
        </p>

        <Alert className="mt-2">
          <AlertCircle className="size-4" />
          <AlertTitle>High priority valuations</AlertTitle>
          <AlertDescription>
            You have 2 high priority valuations that require your
            attention.{" "}
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="mb-8 grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Home className="size-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="size-4" />
              <span>Pending Valuations</span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <TrendingUp className="size-4" />
              <span>Recent Valuations</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Pending Valuations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {valuationStats.pendingValuations}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {valuationStats.pendingValuations > 5
                      ? "High workload"
                      : "Normal workload"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Completed This Month
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {valuationStats.completedThisMonth}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    +3 from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Average Turnaround
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {valuationStats.averageTurnaround}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    -0.5 days from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {valuationStats.recentActivity}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Updates in the last 48 hours
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Valuations</CardTitle>
                  <CardDescription>
                    Your upcoming valuation assignments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Property</TableHead>
                        <TableHead>Request Date</TableHead>
                        <TableHead>Urgency</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingValuations
                        .filter((val) => val.assignedTo === "You")
                        .slice(0, 3)
                        .map((valuation) => (
                          <TableRow key={valuation.id}>
                            <TableCell className="font-medium">
                              {valuation.propertyAddress}
                              <div className="text-xs text-muted-foreground">
                                {valuation.propertyType} • {valuation.postcode}
                              </div>
                            </TableCell>
                            <TableCell>
                              {formatDate(valuation.requestDate)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={`
                                ${valuation.urgency === "low" ? "bg-blue-500" : ""}
                                ${valuation.urgency === "medium" ? "bg-amber-500" : ""}
                                ${valuation.urgency === "high" ? "bg-red-500" : ""}
                              `}
                              >
                                {valuation.urgency.charAt(0).toUpperCase() +
                                  valuation.urgency.slice(1)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm">
                      View All Pending
                      <ArrowUpRight className="ml-2 size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Valuations</CardTitle>
                  <CardDescription>
                    Your recently completed property valuations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Property</TableHead>
                        <TableHead>Completion</TableHead>
                        <TableHead>Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentValuations.slice(0, 3).map((valuation) => (
                        <TableRow key={valuation.id}>
                          <TableCell className="font-medium">
                            {valuation.propertyAddress}
                            <div className="text-xs text-muted-foreground">
                              {valuation.propertyType} • {valuation.postcode}
                            </div>
                          </TableCell>
                          <TableCell>
                            {formatDate(valuation.completionDate)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {valuation.valuationAmount}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm">
                      View All Completed
                      <ArrowUpRight className="ml-2 size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>
                  Your scheduled property visits
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
                        42 Oak Street, London
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Tomorrow at 10:30 AM • Apartment • E1 6AN
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="secondary">High Priority</Badge>
                        <Badge variant="outline">Client Waiting</Badge>
                      </div>
                    </div>
                    <Button size="sm">View Details</Button>
                  </div>

                  <div className="flex items-start gap-4 rounded-lg border p-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Calendar className="size-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold">
                        8 Elm Court, Bristol
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        3 April at 2:00 PM • Apartment • BS1 5AZ
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="secondary">High Priority</Badge>
                      </div>
                    </div>
                    <Button size="sm">View Details</Button>
                  </div>

                  <div className="flex items-start gap-4 rounded-lg border p-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Calendar className="size-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold">
                        15 Willow Avenue, Manchester
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        4 April at 11:00 AM • Semi-detached • M14 5TP
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="secondary">Medium Priority</Badge>
                      </div>
                    </div>
                    <Button size="sm">View Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle>Pending Valuations</CardTitle>
                    <CardDescription>
                      Properties awaiting valuation assessment
                    </CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by address or postcode..."
                      className="w-full pl-8 md:w-[300px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Request Date</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Urgency</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPendingValuations.map((valuation) => (
                      <TableRow key={valuation.id}>
                        <TableCell className="font-medium">
                          {valuation.propertyAddress}
                          <div className="text-xs text-muted-foreground">
                            {valuation.postcode}
                          </div>
                        </TableCell>
                        <TableCell>{valuation.propertyType}</TableCell>
                        <TableCell>
                          {formatDate(valuation.requestDate)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              valuation.assignedTo === "You"
                                ? "default"
                                : "outline"
                            }
                          >
                            {valuation.assignedTo}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`
                              ${valuation.urgency === "low" ? "bg-blue-500" : ""}
                              ${valuation.urgency === "medium" ? "bg-amber-500" : ""}
                              ${valuation.urgency === "high" ? "bg-red-500" : ""}
                            `}
                          >
                            {valuation.urgency.charAt(0).toUpperCase() +
                              valuation.urgency.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm">
                            {valuation.assignedTo === "You"
                              ? "Start Valuation"
                              : "View Details"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}

                    {filteredPendingValuations.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No pending valuations found matching your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Valuations</CardTitle>
                <CardDescription>
                  Your recently completed property valuations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Completion Date</TableHead>
                      <TableHead>Valuation</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentValuations.map((valuation) => (
                      <TableRow key={valuation.id}>
                        <TableCell className="font-medium">
                          {valuation.propertyAddress}
                          <div className="text-xs text-muted-foreground">
                            {valuation.postcode}
                          </div>
                        </TableCell>
                        <TableCell>{valuation.propertyType}</TableCell>
                        <TableCell>
                          {formatDate(valuation.completionDate)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {valuation.valuationAmount}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              View Report
                            </Button>
                            <Button size="sm">Edit</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing 4 of 15 completed valuations
                  </p>
                  <Button variant="outline" size="sm">
                    View All Completed
                    <ArrowUpRight className="ml-2 size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RoleBasedLayout>
  )
}
