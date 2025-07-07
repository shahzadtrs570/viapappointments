/*eslint-disable react/jsx-sort-props*/
/*eslint-disable import/order*/
"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@package/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@package/ui/card"
import { AlertCircle, BookOpen, Home, Mail } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@package/ui/alert"
import { CommunicationCenter } from "@/components/family-supporter/communication/CommunicationCenter"
import { PropertyTracker } from "@/components/family-supporter/property/PropertyTracker"
import { ResourceLibrary } from "@/components/family-supporter/resources/ResourceLibrary"
import { RoleBasedLayout } from "@/components/Layouts/RoleBasedLayout"
import Link from "next/link"

export default function FamilySupporterDashboard() {
  return (
    <RoleBasedLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Family Supporter Dashboard
        </h1>
        <p className="text-muted-foreground">
          Support your loved ones through their property journey with our
          helpful tools and resources.
        </p>

        <Alert className="mt-2">
          <AlertCircle className="size-4" />
          <AlertTitle>New message from seller</AlertTitle>
          <AlertDescription>
            Sarah has shared property documents for your review.{" "}
            <Link href="#" className="font-medium underline">
              View message
            </Link>
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="property" className="mt-6">
          <TabsList className="mb-8 grid w-full grid-cols-3">
            <TabsTrigger value="property" className="flex items-center gap-2">
              <Home className="size-4" />
              <span>Property Tracker</span>
            </TabsTrigger>
            <TabsTrigger
              value="communication"
              className="flex items-center gap-2"
            >
              <Mail className="size-4" />
              <span>Communication Center</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <BookOpen className="size-4" />
              <span>Resources</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="property" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Property Tracking</CardTitle>
                <CardDescription>
                  {`Monitor the progress of your loved one's property journey.`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PropertyTracker />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communication" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Communication Center</CardTitle>
                <CardDescription>
                  Stay in touch with your loved ones and Srenova professionals.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CommunicationCenter />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Resource Library</CardTitle>
                <CardDescription>
                  Access guides, checklists, and tools to help support your
                  loved ones.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResourceLibrary />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RoleBasedLayout>
  )
}
