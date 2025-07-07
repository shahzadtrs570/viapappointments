/*eslint-disable @typescript-eslint/no-explicit-any */
/*eslint-disable react/jsx-max-depth */
/*eslint-disable max-lines */
/*eslint-disable  @typescript-eslint/no-unnecessary-condition */

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
import { Separator } from "@package/ui/separator"

import type { FinalStepProps } from "../StepProps"
import type { ContinuousManagement } from "../types"

import { api } from "@/lib/trpc/react"

export function ContinuousManagementStep({
  wizardData,
  updateWizardData,
  onBack,
  onComplete,
  setGuideMessage,
}: FinalStepProps) {
  // Set the guide message for this step
  useEffect(() => {
    setGuideMessage(
      "Configure the ongoing management and reporting for your Buy Box. This ensures investors receive timely information, performance is tracked, and regulatory requirements are met throughout the investment lifecycle."
    )
  }, [setGuideMessage])

  // Helper to get date string for n days in the future
  function getDateInDays(days: number): string {
    const date = new Date()
    date.setDate(date.getDate() + days)
    return date.toISOString().split("T")[0]
  }

  // Initialize local state with existing data or defaults
  const [continuousManagement, setContinuousManagement] =
    useState<ContinuousManagement>(
      () =>
        wizardData.continuousManagement || {
          reportingSchedule: {
            frequency: "quarterly",
            nextReportDate: getDateInDays(90),
            includedMetrics: [
              "Yield performance",
              "Property status",
              "Cash flow",
              "Estimated value",
            ],
            automatedDistribution: true,
          },
          performanceTracking: {
            trackingMetrics: [
              "Annual yield",
              "Occupancy rates",
              "Property maintenance costs",
              "Market comparables",
            ],
            benchmarks: [
              "Industry average yields",
              "Regional property value trends",
            ],
            alertThresholds: {
              yieldAlert: 4.0,
              occupancyAlert: 85,
              otherAlerts: ["Major property damage", "Regulatory changes"],
            },
          },
          investorRelations: {
            primaryContact: "Investor Relations Team",
            communicationFrequency:
              "Monthly updates, quarterly detailed reports",
            feedbackMechanism: "Investor portal and direct email",
            escalationProcedure: "48-hour response time for all inquiries",
          },
          complianceReporting: {
            regulatoryReports: [
              "FCA annual report",
              "Tax filings",
              "Anti-money laundering checks",
            ],
            internalAudits: true,
            auditFrequency: "Annual",
            complianceOfficer: "Compliance Department",
          },
        }
    )

  // API mutation
  const updateContinuousManagementMutation =
    api.admin.buyBoxCreation.updateContinuousManagement.useMutation()

  // Handle reporting schedule changes
  const handleReportingChange = (field: string, value: any) => {
    setContinuousManagement((prev) => ({
      ...prev,
      reportingSchedule: {
        ...prev.reportingSchedule,
        [field]: value,
      },
    }))
  }

  // Handle included metrics input
  const handleMetricsInput = (value: string) => {
    const metrics = value
      .split(",")
      .map((metric) => metric.trim())
      .filter(Boolean)

    handleReportingChange("includedMetrics", metrics)
  }

  // Handle performance tracking changes
  const handlePerformanceChange = (
    field: keyof typeof continuousManagement.performanceTracking,
    value: any
  ) => {
    setContinuousManagement((prev) => ({
      ...prev,
      performanceTracking: {
        ...prev.performanceTracking,
        [field]: value,
      },
    }))
  }

  // Handle tracking metrics input
  const handleTrackingMetricsInput = (value: string) => {
    const metrics = value
      .split(",")
      .map((metric) => metric.trim())
      .filter(Boolean)

    handlePerformanceChange("trackingMetrics", metrics)
  }

  // Handle benchmarks input
  const handleBenchmarksInput = (value: string) => {
    const benchmarks = value
      .split(",")
      .map((benchmark) => benchmark.trim())
      .filter(Boolean)

    handlePerformanceChange("benchmarks", benchmarks)
  }

  // Handle alert thresholds changes
  const handleAlertThresholdsChange = (
    field: keyof typeof continuousManagement.performanceTracking.alertThresholds,
    value: any
  ) => {
    setContinuousManagement((prev) => {
      // Ensure the alertThresholds object exists and has default values if needed
      const currentAlertThresholds = prev.performanceTracking
        .alertThresholds || {
        yieldAlert: 0,
        occupancyAlert: 0,
        otherAlerts: [],
      }

      return {
        ...prev,
        performanceTracking: {
          ...prev.performanceTracking,
          alertThresholds: {
            ...currentAlertThresholds,
            [field]: value,
          },
        },
      }
    })
  }

  // Handle other alerts input
  const handleOtherAlertsInput = (value: string) => {
    const alerts = value
      .split(",")
      .map((alert) => alert.trim())
      .filter(Boolean)

    handleAlertThresholdsChange("otherAlerts", alerts)
  }

  // Handle investor relations changes
  const handleInvestorRelationsChange = (
    field: keyof typeof continuousManagement.investorRelations,
    value: string
  ) => {
    setContinuousManagement((prev) => ({
      ...prev,
      investorRelations: {
        ...prev.investorRelations,
        [field]: value,
      },
    }))
  }

  // Handle compliance reporting changes
  const handleComplianceChange = (
    field: keyof typeof continuousManagement.complianceReporting,
    value: any
  ) => {
    setContinuousManagement((prev) => ({
      ...prev,
      complianceReporting: {
        ...prev.complianceReporting,
        [field]: value,
      },
    }))
  }

  // Handle regulatory reports input
  const handleRegulatoryReportsInput = (value: string) => {
    const reports = value
      .split(",")
      .map((report) => report.trim())
      .filter(Boolean)

    handleComplianceChange("regulatoryReports", reports)
  }

  const [isLoading, setIsLoading] = useState(false)

  // Handle form submission
  const handleFinish = () => {
    // Validation
    if (!continuousManagement.reportingSchedule.nextReportDate) {
      alert("Please provide a next report date")
      return
    }

    if (continuousManagement.reportingSchedule.includedMetrics.length === 0) {
      alert("Please specify at least one reporting metric")
      return
    }

    if (!continuousManagement.investorRelations.primaryContact) {
      alert("Please provide a primary contact for investor relations")
      return
    }

    // Update wizard data
    updateWizardData({ continuousManagement })

    // Call API to update continuous management
    setIsLoading(true)
    updateContinuousManagementMutation.mutate(
      {
        buyBoxId: localStorage.getItem("buyBoxId") || "", // TODO: make dynamic
        data: continuousManagement,
      },
      {
        onSuccess: () => {
          setIsLoading(false)
          onComplete()
        },
        onError: (error) => {
          console.error("Error updating continuous management:", error)
          setIsLoading(false)
          alert("Error updating continuous management. Please try again.")
        },
      }
    )
  }

  // Check if all previous steps are complete
  // const allStepsComplete = (): boolean => {
  //   return Boolean(
  //     wizardData.buyBoxTheme &&
  //       wizardData.selectedProperties?.length &&
  //       wizardData.financialModel &&
  //       wizardData.complianceInfo &&
  //       wizardData.platformListing &&
  //       wizardData.investorEngagement &&
  //       wizardData.capitalDeployment
  //   )
  // }

  // Calculate completion percentage
  const calculateCompletionPercentage = (): number => {
    let completed = 0
    const total = 7 // Total number of previous steps

    if (wizardData.buyBoxTheme) completed++
    if (wizardData.selectedProperties?.length) completed++
    if (wizardData.financialModel) completed++
    if (wizardData.complianceInfo) completed++
    if (wizardData.platformListing) completed++
    if (wizardData.investorEngagement) completed++
    if (wizardData.capitalDeployment) completed++

    return Math.round((completed / total) * 100)
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">
          Continuous Management & Reporting
        </CardTitle>
        <CardDescription>
          Configure ongoing management, reporting, and investor relations for
          your Buy Box
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Buy Box Completion Status */}
        <div className="rounded-md border border-border bg-muted/20 p-4">
          <h3 className="mb-2 text-lg font-medium">Buy Box Creation Status</h3>

          <div className="mb-2 flex items-center justify-between">
            <span>Overall completion:</span>
            <span className="font-semibold">
              {calculateCompletionPercentage()}% Complete
            </span>
          </div>

          <div className="h-2.5 w-full rounded-full bg-muted">
            <div
              className="h-2.5 rounded-full bg-primary"
              style={{ width: `${calculateCompletionPercentage()}%` }}
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <div
                className={`size-2 rounded-full ${wizardData.buyBoxTheme ? "bg-green-500" : "bg-gray-300"}`}
              />
              <span>Theme Definition</span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`size-2 rounded-full ${wizardData.selectedProperties?.length ? "bg-green-500" : "bg-gray-300"}`}
              />
              <span>Property Selection</span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`size-2 rounded-full ${wizardData.financialModel ? "bg-green-500" : "bg-gray-300"}`}
              />
              <span>Financial Modeling</span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`size-2 rounded-full ${wizardData.complianceInfo ? "bg-green-500" : "bg-gray-300"}`}
              />
              <span>Compliance Review</span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`size-2 rounded-full ${wizardData.platformListing ? "bg-green-500" : "bg-gray-300"}`}
              />
              <span>Platform Listing</span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`size-2 rounded-full ${wizardData.investorEngagement ? "bg-green-500" : "bg-gray-300"}`}
              />
              <span>Investor Engagement</span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`size-2 rounded-full ${wizardData.capitalDeployment ? "bg-green-500" : "bg-gray-300"}`}
              />
              <span>Capital Deployment</span>
            </div>
          </div>
        </div>

        {/* Reporting Schedule */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Reporting Schedule</h3>
          <div className="rounded-md border border-border p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="report-frequency">Reporting Frequency</Label>
                <Select
                  value={continuousManagement.reportingSchedule.frequency}
                  onValueChange={(value) =>
                    handleReportingChange("frequency", value)
                  }
                >
                  <SelectTrigger id="report-frequency">
                    <SelectValue placeholder="Select reporting frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="semi_annual">Semi-Annual</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="next-report">Next Report Date</Label>
                <Input
                  id="next-report"
                  type="date"
                  value={continuousManagement.reportingSchedule.nextReportDate}
                  onChange={(e) =>
                    handleReportingChange("nextReportDate", e.target.value)
                  }
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="included-metrics">
                  Included Metrics (comma-separated)
                </Label>
                <Input
                  id="included-metrics"
                  placeholder="e.g., Yield performance, Cash flow, Property status"
                  value={continuousManagement.reportingSchedule.includedMetrics.join(
                    ", "
                  )}
                  onChange={(e) => handleMetricsInput(e.target.value)}
                />
              </div>

              <div className="col-span-2 flex items-center space-x-2">
                <Checkbox
                  id="automated-distribution"
                  checked={
                    continuousManagement.reportingSchedule.automatedDistribution
                  }
                  onCheckedChange={(checked) =>
                    handleReportingChange(
                      "automatedDistribution",
                      checked === true
                    )
                  }
                />
                <Label className="font-medium" htmlFor="automated-distribution">
                  Enable Automated Report Distribution
                </Label>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Tracking */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Performance Tracking</h3>
          <div className="rounded-md border border-border p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tracking-metrics">
                  Tracking Metrics (comma-separated)
                </Label>
                <Input
                  id="tracking-metrics"
                  placeholder="e.g., Annual yield, Occupancy rates, Maintenance costs"
                  value={continuousManagement.performanceTracking.trackingMetrics.join(
                    ", "
                  )}
                  onChange={(e) => handleTrackingMetricsInput(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="benchmarks">
                  Performance Benchmarks (comma-separated)
                </Label>
                <Input
                  id="benchmarks"
                  placeholder="e.g., Industry average yields, Regional property trends"
                  value={
                    continuousManagement.performanceTracking.benchmarks?.join(
                      ", "
                    ) || ""
                  }
                  onChange={(e) => handleBenchmarksInput(e.target.value)}
                />
              </div>

              <Separator className="my-2" />

              <h4 className="font-medium">Alert Thresholds</h4>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="yield-alert">Yield Alert Threshold (%)</Label>
                  <Input
                    id="yield-alert"
                    min="0"
                    step="0.1"
                    type="number"
                    value={
                      continuousManagement.performanceTracking.alertThresholds
                        ?.yieldAlert || 0
                    }
                    onChange={(e) =>
                      handleAlertThresholdsChange(
                        "yieldAlert",
                        parseFloat(e.target.value)
                      )
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    Alert if yield falls below this percentage
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occupancy-alert">
                    Occupancy Alert Threshold (%)
                  </Label>
                  <Input
                    id="occupancy-alert"
                    max="100"
                    min="0"
                    type="number"
                    value={
                      continuousManagement.performanceTracking.alertThresholds
                        ?.occupancyAlert || 0
                    }
                    onChange={(e) =>
                      handleAlertThresholdsChange(
                        "occupancyAlert",
                        parseInt(e.target.value)
                      )
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    Alert if occupancy falls below this percentage
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="other-alerts">
                  Other Alert Conditions (comma-separated)
                </Label>
                <Input
                  id="other-alerts"
                  placeholder="e.g., Major property damage, Regulatory changes"
                  value={
                    continuousManagement.performanceTracking.alertThresholds?.otherAlerts?.join(
                      ", "
                    ) || ""
                  }
                  onChange={(e) => handleOtherAlertsInput(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Investor Relations */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Investor Relations</h3>
          <div className="rounded-md border border-border p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="primary-contact">Primary Contact</Label>
                <Input
                  id="primary-contact"
                  placeholder="e.g., Investor Relations Team or specific person"
                  value={continuousManagement.investorRelations.primaryContact}
                  onChange={(e) =>
                    handleInvestorRelationsChange(
                      "primaryContact",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="communication-frequency">
                  Communication Frequency
                </Label>
                <Input
                  id="communication-frequency"
                  placeholder="e.g., Monthly updates, quarterly detailed reports"
                  value={
                    continuousManagement.investorRelations
                      .communicationFrequency
                  }
                  onChange={(e) =>
                    handleInvestorRelationsChange(
                      "communicationFrequency",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback-mechanism">Feedback Mechanism</Label>
                <Input
                  id="feedback-mechanism"
                  placeholder="e.g., Investor portal and direct email"
                  value={
                    continuousManagement.investorRelations.feedbackMechanism
                  }
                  onChange={(e) =>
                    handleInvestorRelationsChange(
                      "feedbackMechanism",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="escalation-procedure">
                  Escalation Procedure
                </Label>
                <Input
                  id="escalation-procedure"
                  placeholder="e.g., 48-hour response time for all inquiries"
                  value={
                    continuousManagement.investorRelations
                      .escalationProcedure || ""
                  }
                  onChange={(e) =>
                    handleInvestorRelationsChange(
                      "escalationProcedure",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Reporting */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Compliance Reporting</h3>
          <div className="rounded-md border border-border p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="regulatory-reports">
                  Regulatory Reports (comma-separated)
                </Label>
                <Input
                  id="regulatory-reports"
                  placeholder="e.g., FCA annual report, Tax filings, Anti-money laundering checks"
                  value={continuousManagement.complianceReporting.regulatoryReports.join(
                    ", "
                  )}
                  onChange={(e) => handleRegulatoryReportsInput(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2 self-end">
                <Checkbox
                  id="internal-audits"
                  checked={
                    continuousManagement.complianceReporting.internalAudits
                  }
                  onCheckedChange={(checked) =>
                    handleComplianceChange("internalAudits", checked === true)
                  }
                />
                <Label className="font-medium" htmlFor="internal-audits">
                  Conduct Internal Audits
                </Label>
              </div>

              {continuousManagement.complianceReporting.internalAudits && (
                <div className="space-y-2">
                  <Label htmlFor="audit-frequency">Audit Frequency</Label>
                  <Input
                    id="audit-frequency"
                    placeholder="e.g., Annual, Bi-annual"
                    value={
                      continuousManagement.complianceReporting.auditFrequency ||
                      ""
                    }
                    onChange={(e) =>
                      handleComplianceChange("auditFrequency", e.target.value)
                    }
                  />
                </div>
              )}

              <div className="col-span-2 space-y-2">
                <Label htmlFor="compliance-officer">
                  Compliance Officer/Department
                </Label>
                <Input
                  id="compliance-officer"
                  placeholder="e.g., Compliance Department or specific person"
                  value={
                    continuousManagement.complianceReporting.complianceOfficer
                  }
                  onChange={(e) =>
                    handleComplianceChange("complianceOfficer", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Final Buy Box Summary */}
        {wizardData.buyBoxTheme && (
          <div className="rounded-md border border-border bg-primary/5 p-4">
            <h3 className="mb-3 text-lg font-medium text-primary">
              Buy Box Summary
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <span className="font-medium">Name:</span>{" "}
                {wizardData.buyBoxTheme.name}
              </div>
              <div>
                <span className="font-medium">Theme:</span>{" "}
                {wizardData.buyBoxTheme.themeType}
              </div>
              <div>
                <span className="font-medium">Properties:</span>{" "}
                {wizardData.selectedProperties?.length || 0}
              </div>
              <div>
                <span className="font-medium">Total Investment Value:</span>{" "}
                {wizardData.financialModel &&
                  new Intl.NumberFormat("en-GB", {
                    style: "currency",
                    currency: "GBP",
                    maximumFractionDigits: 0,
                  }).format(
                    wizardData.financialModel.pricing.totalInvestmentPrice
                  )}
              </div>
              <div>
                <span className="font-medium">Target Yield:</span>{" "}
                {wizardData.financialModel &&
                  `${wizardData.financialModel.expectedReturns.targetYield}%`}
              </div>
              <div>
                <span className="font-medium">Compliance Status:</span>{" "}
                {wizardData.complianceInfo?.regulatoryCompliance.fcaCompliant &&
                wizardData.complianceInfo?.regulatoryCompliance.mifidCompliant
                  ? "Compliant"
                  : "Requires Review"}
              </div>
              <div>
                <span className="font-medium">Publication Status:</span>{" "}
                {wizardData.platformListing?.publishStatus || "Draft"}
              </div>
              <div>
                <span className="font-medium">First Report Due:</span>{" "}
                {new Date(
                  continuousManagement.reportingSchedule.nextReportDate
                ).toLocaleDateString("en-GB")}
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Capital Deployment
        </Button>
        <Button
          className="w-[300px]"
          disabled={isLoading}
          onClick={handleFinish}
        >
          {isLoading ? "Completing..." : "Complete Buy Box Creation"}
        </Button>
      </CardFooter>
    </Card>
  )
}
