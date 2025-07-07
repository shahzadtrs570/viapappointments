/*eslint-disable import/order*/
/*eslint-disable react/function-component-definition*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable max-lines*/
/*eslint-disable @typescript-eslint/no-explicit-any*/
/*eslint-disable no-nested-ternary*/

"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@package/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@package/ui/tabs"
import { Button } from "@package/ui/button"
import { Input } from "@package/ui/input"
import { Textarea } from "@package/ui/textarea"
import { Checkbox } from "@package/ui/checkbox"
import { Label } from "@package/ui/label"
import { RadioGroup, RadioGroupItem } from "@package/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@package/ui/alert"
import { Badge } from "@package/ui/badge"
import {
  CheckCircle,
  AlertCircle,
  FileText,
  Shield,
  Building,
} from "lucide-react"

interface PropertyDetails {
  id: string
  address: string
  postcode: string
  propertyType: string
  bedrooms: number
  bathrooms: number
  yearBuilt: number
  tenure: string
  status: "pending" | "in_progress" | "verified" | "issues"
}

interface VerificationFormProps {
  property: PropertyDetails
  onSave: (data: any) => void
}

export function PropertyVerification({
  property,
  onSave,
}: VerificationFormProps) {
  const [activeTab, setActiveTab] = useState("property_details")
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "in_progress" | "verified" | "issues"
  >(property.status)

  // Form states for each section
  const [propertyChecks, setPropertyChecks] = useState({
    titleDeeds: false,
    landRegistry: false,
    boundaryCheck: false,
    propertySearch: false,
    localAuthority: false,
    environmentalSearch: false,
    floodRisk: false,
    utilitiesCheck: false,
  })

  const [legalChecks, setLegalChecks] = useState({
    covenants: false,
    easements: false,
    restrictions: false,
    planningPermissions: false,
    buildingRegulations: false,
    propertyRights: false,
  })

  const [financialChecks, setFinancialChecks] = useState({
    outstandingMortgage: false,
    serviceCharge: false,
    groundRent: false,
    councilTax: false,
    utilityBills: false,
  })

  const [notes, setNotes] = useState("")
  const [issueType, setIssueType] = useState("")

  const handlePropertyCheckChange = (id: keyof typeof propertyChecks) => {
    setPropertyChecks({
      ...propertyChecks,
      [id]: !propertyChecks[id],
    })
  }

  const handleLegalCheckChange = (id: keyof typeof legalChecks) => {
    setLegalChecks({
      ...legalChecks,
      [id]: !legalChecks[id],
    })
  }

  const handleFinancialCheckChange = (id: keyof typeof financialChecks) => {
    setFinancialChecks({
      ...financialChecks,
      [id]: !financialChecks[id],
    })
  }

  const handleSubmit = () => {
    // Create verification data
    const verificationData = {
      propertyId: property.id,
      propertyChecks,
      legalChecks,
      financialChecks,
      notes,
      issueType: issueType || null,
      status: verificationStatus,
      completedAt: new Date().toISOString(),
    }

    onSave(verificationData)
  }

  const allPropertyChecksComplete = Object.values(propertyChecks).every(Boolean)
  const allLegalChecksComplete = Object.values(legalChecks).every(Boolean)
  const allFinancialChecksComplete =
    Object.values(financialChecks).every(Boolean)

  const handleMarkVerified = () => {
    if (
      allPropertyChecksComplete &&
      allLegalChecksComplete &&
      allFinancialChecksComplete
    ) {
      setVerificationStatus("verified")
    } else {
      setVerificationStatus("in_progress")
    }
  }

  const handleMarkIssues = () => {
    setVerificationStatus("issues")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Property Verification</CardTitle>
            <CardDescription>
              Complete legal verification for {property.address}
            </CardDescription>
          </div>
          <Badge
            className={`
              ${verificationStatus === "pending" ? "bg-amber-500" : ""}
              ${verificationStatus === "in_progress" ? "bg-blue-500" : ""}
              ${verificationStatus === "verified" ? "bg-green-500" : ""}
              ${verificationStatus === "issues" ? "bg-red-500" : ""}
            `}
          >
            {verificationStatus === "pending"
              ? "Pending"
              : verificationStatus === "in_progress"
                ? "In Progress"
                : verificationStatus === "verified"
                  ? "Verified"
                  : "Issues Found"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger
              value="property_details"
              className="flex items-center gap-2"
            >
              <Building className="size-4" />
              <span>Property Details</span>
            </TabsTrigger>
            <TabsTrigger
              value="legal_checks"
              className="flex items-center gap-2"
            >
              <Shield className="size-4" />
              <span>Legal Checks</span>
            </TabsTrigger>
            <TabsTrigger
              value="financial_checks"
              className="flex items-center gap-2"
            >
              <FileText className="size-4" />
              <span>Financial Checks</span>
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <CheckCircle className="size-4" />
              <span>Summary</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="property_details" className="mt-4 space-y-4">
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={property.address} readOnly />
              </div>
              <div>
                <Label htmlFor="postcode">Postcode</Label>
                <Input id="postcode" value={property.postcode} readOnly />
              </div>
              <div>
                <Label htmlFor="propertyType">Property Type</Label>
                <Input
                  id="propertyType"
                  value={property.propertyType}
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="tenure">Tenure</Label>
                <Input id="tenure" value={property.tenure} readOnly />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Property Document Verification
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="titleDeeds"
                    checked={propertyChecks.titleDeeds}
                    onCheckedChange={() =>
                      handlePropertyCheckChange("titleDeeds")
                    }
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="titleDeeds" className="font-medium">
                      Title Deeds
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Confirm title deeds are accurate and complete
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="landRegistry"
                    checked={propertyChecks.landRegistry}
                    onCheckedChange={() =>
                      handlePropertyCheckChange("landRegistry")
                    }
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="landRegistry" className="font-medium">
                      Land Registry
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Verify land registry information
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="boundaryCheck"
                    checked={propertyChecks.boundaryCheck}
                    onCheckedChange={() =>
                      handlePropertyCheckChange("boundaryCheck")
                    }
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="boundaryCheck" className="font-medium">
                      Boundary Check
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Confirm property boundaries are correctly defined
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="propertySearch"
                    checked={propertyChecks.propertySearch}
                    onCheckedChange={() =>
                      handlePropertyCheckChange("propertySearch")
                    }
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="propertySearch" className="font-medium">
                      Property Search
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Complete property search with results
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="localAuthority"
                    checked={propertyChecks.localAuthority}
                    onCheckedChange={() =>
                      handlePropertyCheckChange("localAuthority")
                    }
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="localAuthority" className="font-medium">
                      Local Authority Search
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Verify local authority information
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="environmentalSearch"
                    checked={propertyChecks.environmentalSearch}
                    onCheckedChange={() =>
                      handlePropertyCheckChange("environmentalSearch")
                    }
                  />
                  <div className="grid gap-1.5">
                    <Label
                      htmlFor="environmentalSearch"
                      className="font-medium"
                    >
                      Environmental Search
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Check for environmental issues or concerns
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="floodRisk"
                    checked={propertyChecks.floodRisk}
                    onCheckedChange={() =>
                      handlePropertyCheckChange("floodRisk")
                    }
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="floodRisk" className="font-medium">
                      Flood Risk Assessment
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Confirm flood risk assessment is complete
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="utilitiesCheck"
                    checked={propertyChecks.utilitiesCheck}
                    onCheckedChange={() =>
                      handlePropertyCheckChange("utilitiesCheck")
                    }
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="utilitiesCheck" className="font-medium">
                      Utilities Check
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Verify utility connections and services
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="legal_checks" className="mt-4 space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Legal Document Checks</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="covenants"
                    checked={legalChecks.covenants}
                    onCheckedChange={() => handleLegalCheckChange("covenants")}
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="covenants" className="font-medium">
                      Covenants
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Check for restrictive covenants on the property
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="easements"
                    checked={legalChecks.easements}
                    onCheckedChange={() => handleLegalCheckChange("easements")}
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="easements" className="font-medium">
                      Easements
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Verify any easements affecting the property
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="restrictions"
                    checked={legalChecks.restrictions}
                    onCheckedChange={() =>
                      handleLegalCheckChange("restrictions")
                    }
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="restrictions" className="font-medium">
                      Restrictions
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Identify any legal restrictions on the property
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="planningPermissions"
                    checked={legalChecks.planningPermissions}
                    onCheckedChange={() =>
                      handleLegalCheckChange("planningPermissions")
                    }
                  />
                  <div className="grid gap-1.5">
                    <Label
                      htmlFor="planningPermissions"
                      className="font-medium"
                    >
                      Planning Permissions
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Check for any planning permissions or issues
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="buildingRegulations"
                    checked={legalChecks.buildingRegulations}
                    onCheckedChange={() =>
                      handleLegalCheckChange("buildingRegulations")
                    }
                  />
                  <div className="grid gap-1.5">
                    <Label
                      htmlFor="buildingRegulations"
                      className="font-medium"
                    >
                      Building Regulations
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Confirm compliance with building regulations
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="propertyRights"
                    checked={legalChecks.propertyRights}
                    onCheckedChange={() =>
                      handleLegalCheckChange("propertyRights")
                    }
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="propertyRights" className="font-medium">
                      Property Rights
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Verify all property rights are properly documented
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="financial_checks" className="mt-4 space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Financial Checks</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="outstandingMortgage"
                    checked={financialChecks.outstandingMortgage}
                    onCheckedChange={() =>
                      handleFinancialCheckChange("outstandingMortgage")
                    }
                  />
                  <div className="grid gap-1.5">
                    <Label
                      htmlFor="outstandingMortgage"
                      className="font-medium"
                    >
                      Outstanding Mortgage
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Check for any outstanding mortgage on the property
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="serviceCharge"
                    checked={financialChecks.serviceCharge}
                    onCheckedChange={() =>
                      handleFinancialCheckChange("serviceCharge")
                    }
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="serviceCharge" className="font-medium">
                      Service Charge
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Verify service charge arrangements if applicable
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="groundRent"
                    checked={financialChecks.groundRent}
                    onCheckedChange={() =>
                      handleFinancialCheckChange("groundRent")
                    }
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="groundRent" className="font-medium">
                      Ground Rent
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Check ground rent details if leasehold property
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="councilTax"
                    checked={financialChecks.councilTax}
                    onCheckedChange={() =>
                      handleFinancialCheckChange("councilTax")
                    }
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="councilTax" className="font-medium">
                      Council Tax
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Verify council tax band and payment status
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="utilityBills"
                    checked={financialChecks.utilityBills}
                    onCheckedChange={() =>
                      handleFinancialCheckChange("utilityBills")
                    }
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="utilityBills" className="font-medium">
                      Utility Bills
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Check utility bill payments are up to date
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Label htmlFor="notes" className="text-lg font-medium">
                Additional Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes about the financial checks..."
                className="mt-2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="summary" className="mt-4 space-y-4">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Verification Summary</h3>
                {allPropertyChecksComplete &&
                allLegalChecksComplete &&
                allFinancialChecksComplete ? (
                  <Badge className="bg-green-500">All Checks Complete</Badge>
                ) : (
                  <Badge className="bg-amber-500">Incomplete</Badge>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Property Checks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Object.values(propertyChecks).filter(Boolean).length}/
                      {Object.values(propertyChecks).length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {allPropertyChecksComplete ? "Complete" : "Incomplete"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Legal Checks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Object.values(legalChecks).filter(Boolean).length}/
                      {Object.values(legalChecks).length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {allLegalChecksComplete ? "Complete" : "Incomplete"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Financial Checks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Object.values(financialChecks).filter(Boolean).length}/
                      {Object.values(financialChecks).length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {allFinancialChecksComplete ? "Complete" : "Incomplete"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {!allPropertyChecksComplete ||
              !allLegalChecksComplete ||
              !allFinancialChecksComplete ? (
                <Alert className="mt-4 border-amber-200 bg-amber-50">
                  <AlertCircle className="size-4 text-amber-500" />
                  <AlertTitle className="text-amber-500">
                    Incomplete Verification
                  </AlertTitle>
                  <AlertDescription>
                    Please complete all checks before finalizing verification.
                  </AlertDescription>
                </Alert>
              ) : verificationStatus !== "verified" ? (
                <Alert className="mt-4 border-green-200 bg-green-50">
                  <CheckCircle className="size-4 text-green-500" />
                  <AlertTitle className="text-green-500">
                    Ready for Verification
                  </AlertTitle>
                  <AlertDescription>
                    All checks are complete. You can now mark this property as
                    verified.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="mt-4 border-green-200 bg-green-50">
                  <CheckCircle className="size-4 text-green-500" />
                  <AlertTitle className="text-green-500">
                    Property Verified
                  </AlertTitle>
                  <AlertDescription>
                    This property has been successfully verified.
                  </AlertDescription>
                </Alert>
              )}

              {verificationStatus === "issues" && (
                <div className="mt-4">
                  <Label htmlFor="issueType" className="text-lg font-medium">
                    Issues Found
                  </Label>
                  <RadioGroup
                    id="issueType"
                    value={issueType}
                    onValueChange={setIssueType}
                    className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="title_issues" id="title_issues" />
                      <Label htmlFor="title_issues">Title Issues</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="boundary_disputes"
                        id="boundary_disputes"
                      />
                      <Label htmlFor="boundary_disputes">
                        Boundary Disputes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="planning_issues"
                        id="planning_issues"
                      />
                      <Label htmlFor="planning_issues">Planning Issues</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="property_rights"
                        id="property_rights"
                      />
                      <Label htmlFor="property_rights">Property Rights</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="financial_issues"
                        id="financial_issues"
                      />
                      <Label htmlFor="financial_issues">Financial Issues</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                  <Textarea
                    placeholder="Describe the issues found..."
                    className="mt-4"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setActiveTab("property_details")}
          >
            Back
          </Button>
          <Button variant="destructive" onClick={handleMarkIssues}>
            Mark Issues Found
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() =>
              setActiveTab(
                activeTab === "property_details"
                  ? "legal_checks"
                  : activeTab === "legal_checks"
                    ? "financial_checks"
                    : activeTab === "financial_checks"
                      ? "summary"
                      : "property_details"
              )
            }
          >
            {activeTab === "summary" ? "Review Property Details" : "Next"}
          </Button>
          <Button
            onClick={
              activeTab === "summary" ? handleSubmit : handleMarkVerified
            }
            disabled={
              activeTab === "summary" &&
              !allPropertyChecksComplete &&
              !allLegalChecksComplete &&
              !allFinancialChecksComplete
            }
          >
            {activeTab === "summary" ? "Save Verification" : "Mark as Verified"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
