/*eslint-disable @typescript-eslint/no-explicit-any */
/*eslint-disable react/jsx-max-depth */
/*eslint-disable max-lines */

import { useEffect, useState } from "react"

import { Button } from "@package/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@package/ui/card"
import { Checkbox } from "@package/ui/checkbox"
import { Input } from "@package/ui/input"
import { Label } from "@package/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@package/ui/select"
import { Textarea } from "@package/ui/textarea"

import type { BaseStepProps } from "../StepProps"
import type { CapitalDeployment } from "../types"

import { api } from "@/lib/trpc/react"

export function CapitalDeploymentStep({
  wizardData,
  updateWizardData,
  onNext,
  onBack,
  setGuideMessage,
}: BaseStepProps) {
  // Set the guide message for this step
  useEffect(() => {
    setGuideMessage(
      "Plan how you'll deploy investor capital and execute contracts with property sellers. This stage is critical for ensuring funds are properly managed, contracts are executed on schedule, and all legal requirements are met."
    )
  }, [setGuideMessage])

  // Helper to get date string for n days in the future
  function getDateInDays(days: number): string {
    const date = new Date()
    date.setDate(date.getDate() + days)
    return date.toISOString().split("T")[0]
  }

  // Initialize local state with existing data or defaults
  const [capitalDeployment, setCapitalDeployment] = useState<CapitalDeployment>(
    () =>
      wizardData.capitalDeployment || {
        fundsManagement: {
          escrowDetails: "Central Escrow Account #ESC-9876543",
          accountingContact: "Finance Department",
          fundsReceived: false,
          totalReceived: 0,
        },
        contractExecution: {
          scheduledExecutionDate: getDateInDays(45),
          legalRepresentative: "Legal Department",
          executionStatus: "pending",
          notes: "",
        },
        propertyTransfers: {
          transferSchedule: getDateInDays(60),
          registrationStatus: "not_started",
          lienRegistration: true,
        },
        sellerPayments: {
          bouquetPaymentDate: getDateInDays(47),
          bouquetPaymentStatus: "pending",
          firstAnnuityDate: getDateInDays(75),
          paymentProcessingSystem: "Finance Platform",
        },
      }
  )

  // API mutation
  const updateCapitalDeploymentMutation =
    api.admin.buyBoxCreation.updateCapitalDeployment.useMutation()

  // Handle funds management changes
  const handleFundsChange = (field: string, value: any) => {
    setCapitalDeployment((prev) => ({
      ...prev,
      fundsManagement: {
        ...prev.fundsManagement,
        [field]: value,
      },
    }))
  }

  // Handle contract execution changes
  const handleContractChange = (field: string, value: any) => {
    setCapitalDeployment((prev) => ({
      ...prev,
      contractExecution: {
        ...prev.contractExecution,
        [field]: value,
      },
    }))
  }

  // Handle property transfers changes
  const handleTransferChange = (field: string, value: any) => {
    setCapitalDeployment((prev) => ({
      ...prev,
      propertyTransfers: {
        ...prev.propertyTransfers,
        [field]: value,
      },
    }))
  }

  // Handle seller payments changes
  const handlePaymentsChange = (field: string, value: any) => {
    setCapitalDeployment((prev) => ({
      ...prev,
      sellerPayments: {
        ...prev.sellerPayments,
        [field]: value,
      },
    }))
  }

  // Handle form submission
  const handleContinue = () => {
    // Validation
    if (!capitalDeployment.fundsManagement.escrowDetails) {
      alert("Please provide escrow account details")
      return
    }

    if (!capitalDeployment.contractExecution.scheduledExecutionDate) {
      alert("Please provide a scheduled execution date")
      return
    }

    if (!capitalDeployment.propertyTransfers.transferSchedule) {
      alert("Please provide a property transfer schedule")
      return
    }

    if (!capitalDeployment.sellerPayments.bouquetPaymentDate) {
      alert("Please provide a bouquet payment date")
      return
    }

    // Save data and move to next step
    updateWizardData({ capitalDeployment })

    // Call API to update capital deployment
    setIsLoading(true)
    updateCapitalDeploymentMutation.mutate(
      {
        buyBoxId: localStorage.getItem("buyBoxId") || "", // TODO: make dynamic
        data: capitalDeployment,
      },
      {
        onSuccess: () => {
          setIsLoading(false)
          onNext()
        },
        onError: (error) => {
          console.error("Error updating capital deployment:", error)
          setIsLoading(false)
          alert("Error updating capital deployment. Please try again.")
        },
      }
    )
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const [isLoading, setIsLoading] = useState(false)

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">
          Capital Deployment & Contract Execution
        </CardTitle>
        <CardDescription>
          Plan financial operations, contract execution, and property transfers
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary of Buy Box and Financial Model */}
        {wizardData.buyBoxTheme && wizardData.financialModel && (
          <div className="rounded-md border border-border bg-muted/20 p-4">
            <h3 className="mb-2 text-lg font-medium">Investment Summary</h3>
            <div className="grid gap-2 md:grid-cols-2">
              <div>
                <span className="font-medium">Buy Box Name:</span>{" "}
                {wizardData.buyBoxTheme.name}
              </div>
              <div>
                <span className="font-medium">Total Investment:</span>{" "}
                {formatCurrency(
                  wizardData.financialModel.pricing.totalInvestmentPrice
                )}
              </div>
              <div>
                <span className="font-medium">Properties:</span>{" "}
                {wizardData.selectedProperties?.length || 0}
              </div>
              <div>
                <span className="font-medium">Total Bouquet:</span>{" "}
                {formatCurrency(wizardData.financialModel.totalBouquet)}
              </div>
              <div>
                <span className="font-medium">Monthly Annuity:</span>{" "}
                {formatCurrency(wizardData.financialModel.totalMonthlyAnnuity)}
              </div>
            </div>
          </div>
        )}

        {/* Funds Management */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Funds Management</h3>
          <div className="rounded-md border border-border p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="escrow-details">Escrow Account Details</Label>
                <Input
                  id="escrow-details"
                  placeholder="e.g., Central Escrow Account #ESC-9876543"
                  value={capitalDeployment.fundsManagement.escrowDetails}
                  onChange={(e) =>
                    handleFundsChange("escrowDetails", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accounting-contact">Accounting Contact</Label>
                <Input
                  id="accounting-contact"
                  placeholder="e.g., Finance Department or specific person"
                  value={capitalDeployment.fundsManagement.accountingContact}
                  onChange={(e) =>
                    handleFundsChange("accountingContact", e.target.value)
                  }
                />
              </div>

              <div className="flex items-center space-x-2 self-end">
                <Checkbox
                  checked={capitalDeployment.fundsManagement.fundsReceived}
                  id="funds-received"
                  onCheckedChange={(checked) =>
                    handleFundsChange("fundsReceived", checked === true)
                  }
                />
                <Label className="font-medium" htmlFor="funds-received">
                  Funds Received from Investors
                </Label>
              </div>

              {capitalDeployment.fundsManagement.fundsReceived && (
                <div className="space-y-2">
                  <Label htmlFor="total-received">
                    Total Amount Received (£)
                  </Label>
                  <Input
                    id="total-received"
                    min={0}
                    step={10000}
                    type="number"
                    value={capitalDeployment.fundsManagement.totalReceived || 0}
                    onChange={(e) =>
                      handleFundsChange(
                        "totalReceived",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contract Execution */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Contract Execution</h3>
          <div className="rounded-md border border-border p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="execution-date">Scheduled Execution Date</Label>
                <Input
                  id="execution-date"
                  type="date"
                  value={
                    capitalDeployment.contractExecution.scheduledExecutionDate
                  }
                  onChange={(e) =>
                    handleContractChange(
                      "scheduledExecutionDate",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="legal-representative">
                  Legal Representative
                </Label>
                <Input
                  id="legal-representative"
                  placeholder="e.g., Legal Department or specific lawyer"
                  value={
                    capitalDeployment.contractExecution.legalRepresentative
                  }
                  onChange={(e) =>
                    handleContractChange("legalRepresentative", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="execution-status">Execution Status</Label>
                <Select
                  value={capitalDeployment.contractExecution.executionStatus}
                  onValueChange={(value) =>
                    handleContractChange("executionStatus", value)
                  }
                >
                  <SelectTrigger id="execution-status">
                    <SelectValue placeholder="Select execution status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="execution-notes">Notes</Label>
                <Textarea
                  className="min-h-[80px]"
                  id="execution-notes"
                  placeholder="Enter any details or notes about the contract execution process..."
                  value={capitalDeployment.contractExecution.notes || ""}
                  onChange={(e) =>
                    handleContractChange("notes", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Property Transfers */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Property Transfers</h3>
          <div className="rounded-md border border-border p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="transfer-schedule">
                  Transfer Schedule Date
                </Label>
                <Input
                  id="transfer-schedule"
                  type="date"
                  value={capitalDeployment.propertyTransfers.transferSchedule}
                  onChange={(e) =>
                    handleTransferChange("transferSchedule", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registration-status">Registration Status</Label>
                <Select
                  value={capitalDeployment.propertyTransfers.registrationStatus}
                  onValueChange={(value) =>
                    handleTransferChange("registrationStatus", value)
                  }
                >
                  <SelectTrigger id="registration-status">
                    <SelectValue placeholder="Select registration status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2 flex items-center space-x-2 self-end">
                <Checkbox
                  checked={capitalDeployment.propertyTransfers.lienRegistration}
                  id="lien-registration"
                  onCheckedChange={(checked) =>
                    handleTransferChange("lienRegistration", checked === true)
                  }
                />
                <Label className="font-medium" htmlFor="lien-registration">
                  Register Legal Charges (Liens) on Properties
                </Label>
              </div>
            </div>
          </div>
        </div>

        {/* Seller Payments */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Seller Payments</h3>
          <div className="rounded-md border border-border p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bouquet-date">Bouquet Payment Date</Label>
                <Input
                  id="bouquet-date"
                  type="date"
                  value={capitalDeployment.sellerPayments.bouquetPaymentDate}
                  onChange={(e) =>
                    handlePaymentsChange("bouquetPaymentDate", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bouquet-status">Bouquet Payment Status</Label>
                <Select
                  value={capitalDeployment.sellerPayments.bouquetPaymentStatus}
                  onValueChange={(value) =>
                    handlePaymentsChange("bouquetPaymentStatus", value)
                  }
                >
                  <SelectTrigger id="bouquet-status">
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="initiated">Initiated</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="first-annuity">
                  First Annuity Payment Date
                </Label>
                <Input
                  id="first-annuity"
                  type="date"
                  value={
                    capitalDeployment.sellerPayments.firstAnnuityDate || ""
                  }
                  onChange={(e) =>
                    handlePaymentsChange("firstAnnuityDate", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-system">
                  Payment Processing System
                </Label>
                <Input
                  id="payment-system"
                  placeholder="e.g., Finance Platform, Banking System"
                  value={
                    capitalDeployment.sellerPayments.paymentProcessingSystem
                  }
                  onChange={(e) =>
                    handlePaymentsChange(
                      "paymentProcessingSystem",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Summary */}
        <div className="rounded-md border border-border bg-muted/20 p-4">
          <h3 className="mb-3 text-lg font-medium">Deployment Timeline</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Contract Execution:</span>
              <span className="font-medium">
                {new Date(
                  capitalDeployment.contractExecution.scheduledExecutionDate
                ).toLocaleDateString("en-GB")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Bouquet Payments:</span>
              <span className="font-medium">
                {new Date(
                  capitalDeployment.sellerPayments.bouquetPaymentDate
                ).toLocaleDateString("en-GB")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Property Transfers:</span>
              <span className="font-medium">
                {new Date(
                  capitalDeployment.propertyTransfers.transferSchedule
                ).toLocaleDateString("en-GB")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>First Annuity Payment:</span>
              <span className="font-medium">
                {capitalDeployment.sellerPayments.firstAnnuityDate
                  ? new Date(
                      capitalDeployment.sellerPayments.firstAnnuityDate
                    ).toLocaleDateString("en-GB")
                  : "Not scheduled"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Investor Engagement
        </Button>
        <Button
          className="w-[300px]"
          disabled={isLoading}
          onClick={handleContinue}
        >
          {isLoading ? "Saving..." : "Continue to Continuous Management"}
        </Button>
      </CardFooter>
    </Card>
  )
}
