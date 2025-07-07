/*eslint-disable import/order*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable sort-imports*/

"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@package/ui/card"
import { Input } from "@package/ui/input"
import { Button } from "@package/ui/button"
import { Textarea } from "@package/ui/textarea"
import { Label } from "@package/ui/label"
import { Separator } from "@package/ui/separator"
import { Mail, Phone, Globe, FileText, Shield, Edit } from "lucide-react"

interface CompanyProfile {
  companyName: string
  registrationNumber: string
  vatNumber: string
  address: {
    line1: string
    line2: string
    city: string
    postcode: string
    country: string
  }
  contactInfo: {
    email: string
    phone: string
    website: string
  }
  description: string
  investmentFocus: string[]
  documents: {
    name: string
    type: string
    uploadDate: string
    verified: boolean
  }[]
}

const mockProfile: CompanyProfile = {
  companyName: "London Investment Fund Ltd",
  registrationNumber: "12345678",
  vatNumber: "GB123456789",
  address: {
    line1: "123 Financial Street",
    line2: "Suite 456",
    city: "London",
    postcode: "EC2A 1BB",
    country: "United Kingdom",
  },
  contactInfo: {
    email: "contact@londoninvestmentfund.com",
    phone: "+44 20 7123 4567",
    website: "www.londoninvestmentfund.com",
  },
  description:
    "Leading property investment fund specializing in residential and commercial properties across the UK.",
  investmentFocus: [
    "Residential Properties",
    "Commercial Real Estate",
    "Mixed-Use Developments",
  ],
  documents: [
    {
      name: "Company Registration Certificate",
      type: "REGISTRATION",
      uploadDate: "2024-01-15",
      verified: true,
    },
    {
      name: "VAT Registration",
      type: "TAX",
      uploadDate: "2024-01-15",
      verified: true,
    },
    {
      name: "Investment License",
      type: "LICENSE",
      uploadDate: "2024-01-15",
      verified: true,
    },
  ],
}

export default function CompanyProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile] = useState<CompanyProfile>(mockProfile)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <div className="container mx-auto space-y-8 py-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Company Profile</h1>
          <p className="text-muted-foreground">
            Manage your company information and documents
          </p>
        </div>
        <Button onClick={() => setIsEditing(!isEditing)}>
          <Edit className="mr-2 size-4" />
          {isEditing ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input
                  value={profile.companyName}
                  disabled={!isEditing}
                  placeholder="Enter company name"
                />
              </div>
              <div className="space-y-2">
                <Label>Registration Number</Label>
                <Input
                  value={profile.registrationNumber}
                  disabled={!isEditing}
                  placeholder="Enter registration number"
                />
              </div>
              <div className="space-y-2">
                <Label>VAT Number</Label>
                <Input
                  value={profile.vatNumber}
                  disabled={!isEditing}
                  placeholder="Enter VAT number"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Company Description</Label>
              <Textarea
                value={profile.description}
                disabled={!isEditing}
                placeholder="Enter company description"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Investment Focus</Label>
              <div className="flex flex-wrap gap-2">
                {profile.investmentFocus.map((focus, index) => (
                  <div
                    key={index}
                    className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
                  >
                    {focus}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Email Address</Label>
                <div className="flex">
                  <Mail className="mr-2 mt-2.5 size-4 text-muted-foreground" />
                  <Input
                    value={profile.contactInfo.email}
                    disabled={!isEditing}
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <div className="flex">
                  <Phone className="mr-2 mt-2.5 size-4 text-muted-foreground" />
                  <Input
                    value={profile.contactInfo.phone}
                    disabled={!isEditing}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Website</Label>
                <div className="flex">
                  <Globe className="mr-2 mt-2.5 size-4 text-muted-foreground" />
                  <Input
                    value={profile.contactInfo.website}
                    disabled={!isEditing}
                    placeholder="Enter website URL"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Company Documents</CardTitle>
            <CardDescription>
              Important company documents and certifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile.documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <FileText className="size-8 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">{doc.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Uploaded on {formatDate(doc.uploadDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc.verified && (
                      <div className="flex items-center text-green-600">
                        <Shield className="mr-1 size-4" />
                        <span className="text-sm">Verified</span>
                      </div>
                    )}
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
