/*eslint-disable react/jsx-max-depth*/
/*eslint-disable import/order*/
/*eslint-disable react/jsx-sort-props*/
"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@package/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@package/ui/card"
import { AlertCircle, ArrowUpRight, Clock, FileCheck, Home } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@package/ui/alert"
import { Badge } from "@package/ui/badge"
import { Button } from "@package/ui/button"
import { Progress } from "@package/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@package/ui/table"
import { RoleBasedLayout } from "@/components/Layouts/RoleBasedLayout"

import Link from "next/link"

// Mock data for the dashboard
const caseStats = {
  active: 12,
  pending: 5,
  completed: 23,
  urgent: 3,
}

const recentActivity = [
  {
    id: "act1",
    type: "Document",
    action: "New document uploaded",
    property: "15 Willow Avenue, Manchester",
    time: "10 minutes ago",
    status: "pending",
  },
  {
    id: "act2",
    type: "Verification",
    action: "Property verification requested",
    property: "42 Oak Street, London",
    time: "2 hours ago",
    status: "pending",
  },
  {
    id: "act3",
    type: "Contract",
    action: "Contract review completed",
    property: "7 Maple Road, Birmingham",
    time: "Yesterday",
    status: "completed",
  },
  {
    id: "act4",
    type: "Query",
    action: "Buyer sent a query",
    property: "29 Pine Lane, Leeds",
    time: "Yesterday",
    status: "urgent",
  },
]

const upcomingDeadlines = [
  {
    id: "dead1",
    task: "Complete property verification",
    property: "15 Willow Avenue, Manchester",
    deadline: "Tomorrow",
    progress: 75,
  },
  {
    id: "dead2",
    task: "Review contract documents",
    property: "42 Oak Street, London",
    deadline: "In 2 days",
    progress: 30,
  },
  {
    id: "dead3",
    task: "Respond to buyer queries",
    property: "29 Pine Lane, Leeds",
    deadline: "In 3 days",
    progress: 10,
  },
]

export default function ConveyancerDashboard() {
  return (
    <RoleBasedLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Conveyancer Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage property verifications, document reviews, and legal processes.
        </p>

        <Alert className="mt-2">
          <AlertCircle className="size-4" />
          <AlertTitle>Urgent action required</AlertTitle>
          <AlertDescription>
            3 cases need your attention.{" "}
            <Link href="#" className="font-medium underline">
              View urgent cases
            </Link>
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="mb-8 grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Home className="size-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Clock className="size-4" />
              <span>Recent Activity</span>
            </TabsTrigger>
            <TabsTrigger value="deadlines" className="flex items-center gap-2">
              <FileCheck className="size-4" />
              <span>Deadlines</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Cases
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{caseStats.active}</div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    +2 from last week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Pending Verifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{caseStats.pending}</div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    -1 from last week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Completed Cases
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {caseStats.completed}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    +4 from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Urgent Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">
                    {caseStats.urgent}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Requires immediate attention
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your most recent case activities and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentActivity.slice(0, 3).map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell className="font-medium">
                          {activity.type}
                        </TableCell>
                        <TableCell>{activity.action}</TableCell>
                        <TableCell>{activity.property}</TableCell>
                        <TableCell>{activity.time}</TableCell>
                        <TableCell>
                          <Badge
                            className={`
                            ${activity.status === "pending" ? "bg-amber-500" : ""}
                            ${activity.status === "completed" ? "bg-green-500" : ""}
                            ${activity.status === "urgent" ? "bg-red-500" : ""}
                          `}
                          >
                            {activity.status.charAt(0).toUpperCase() +
                              activity.status.slice(1)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm">
                    View All Activities
                    <ArrowUpRight className="ml-2 size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Recent Activity</CardTitle>
                <CardDescription>
                  Detailed list of all recent case activities and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentActivity.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell className="font-medium">
                          {activity.type}
                        </TableCell>
                        <TableCell>{activity.action}</TableCell>
                        <TableCell>{activity.property}</TableCell>
                        <TableCell>{activity.time}</TableCell>
                        <TableCell>
                          <Badge
                            className={`
                            ${activity.status === "pending" ? "bg-amber-500" : ""}
                            ${activity.status === "completed" ? "bg-green-500" : ""}
                            ${activity.status === "urgent" ? "bg-red-500" : ""}
                          `}
                          >
                            {activity.status.charAt(0).toUpperCase() +
                              activity.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deadlines" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>
                  Tasks that require your attention in the near future
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {upcomingDeadlines.map((deadline) => (
                    <div key={deadline.id} className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{deadline.task}</h4>
                          <p className="text-sm text-muted-foreground">
                            {deadline.property}
                          </p>
                        </div>
                        <Badge
                          className={`
                          ${deadline.deadline === "Tomorrow" ? "bg-red-500" : ""}
                          ${deadline.deadline.includes("2 days") ? "bg-amber-500" : ""}
                          ${deadline.deadline.includes("3 days") ? "bg-blue-500" : ""}
                        `}
                        >
                          {deadline.deadline}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{deadline.progress}%</span>
                        </div>
                        <Progress value={deadline.progress} className="h-2" />
                      </div>
                      <div className="flex justify-end pt-2">
                        <Button size="sm">Continue Work</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RoleBasedLayout>
  )
}
