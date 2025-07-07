/*eslint-disable @typescript-eslint/no-explicit-any */
/*eslint-disable react/jsx-max-depth */
/*eslint-disable max-lines */
/*eslint-disable  @typescript-eslint/no-unnecessary-condition */
import { useEffect, useState } from "react"

import { Badge } from "@package/ui/badge"
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
import { useToast } from "@package/ui/toast"

import type { BaseStepProps } from "../StepProps"
import type { MonitoringReportingAndRelations } from "../types"

import { api } from "@/lib/trpc/react"

export function MonitoringReportingAndInvestorRelationsStep({
  wizardData,
  updateWizardData,
  onNext,
  onBack,
  setGuideMessage,
}: BaseStepProps) {
  // Set the guide message for this step
  useEffect(() => {
    setGuideMessage(
      "Effective monitoring and reporting are crucial for maintaining transparency and tracking the performance of your investments. We'll establish reporting schedules, communication protocols, and monitoring mechanisms to ensure you have full visibility into your portfolio's performance."
    )
  }, [setGuideMessage])

  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Query to get existing data for this step
  const stepDataQuery = api.buyer.getStepData.useQuery({
    step: "monitoringReporting",
  })

  // Handle successful data fetch
  useEffect(() => {
    const queryData = stepDataQuery.data as unknown
    if (queryData && !wizardData.monitoringReporting) {
      // First cast to unknown, then to the expected type
      const apiData = queryData as MonitoringReportingAndRelations

      // Verify the data has the expected structure before using it
      if (apiData && typeof apiData === "object") {
        updateWizardData({ monitoringReporting: apiData })
        setMonitoringData(apiData)
      }
    }
  }, [stepDataQuery.data, updateWizardData, wizardData.monitoringReporting])

  // Handle query errors
  useEffect(() => {
    if (stepDataQuery.error) {
      console.error("Error fetching monitoring data:", stepDataQuery.error)
      toast({
        title: "Error loading data",
        description:
          "Could not load your saved monitoring and reporting preferences.",
        variant: "destructive",
      })
    }
  }, [stepDataQuery.error, toast])

  // Mutation to save data
  const saveMonitoringReporting =
    api.buyer.submitMonitoringReporting.useMutation({
      onSuccess: () => {
        toast({
          title: "Monitoring preferences saved",
          description:
            "Your monitoring and reporting preferences have been saved.",
        })
        onNext()
      },
      onError: (error) => {
        toast({
          title: "Error saving data",
          description:
            error.message ||
            "Could not save monitoring preferences. Please try again.",
          variant: "destructive",
        })
      },
    })

  // Initialize local state with existing data or defaults
  const [monitoringData, setMonitoringData] =
    useState<MonitoringReportingAndRelations>(
      () =>
        wizardData.monitoringReporting || {
          reportingSetup: {
            reportingFrequency: "quarterly",
            automaticReportingEnabled: true,
            customReportingRequirements: [],
            nextReportDate: new Date(
              new Date().setMonth(new Date().getMonth() + 3)
            )
              .toISOString()
              .split("T")[0],
          },
          portfolioMonitoring: {
            realTimeAccessEnabled: true,
            alertsConfigured: true,
            performanceMetricsTracked: [
              "occupancy",
              "yield",
              "capital-appreciation",
              "cash-flow",
            ],
            benchmarkingSetup: true,
          },
          investorCommunication: {
            regularCallsScheduled: true,
            callFrequency: "Monthly",
            relationshipManagerAssigned: true,
            relationshipManagerName: "Emma Thompson",
            feedbackMechanismEstablished: true,
          },
          continuousSupport: {
            complianceAssistanceAvailable: true,
            strategyAdjustmentProcess: true,
            escalationProcedure: true,
          },
          monitoringNotes: "",
        }
    )

  // Update local state when wizardData changes
  useEffect(() => {
    if (wizardData.monitoringReporting) {
      setMonitoringData(wizardData.monitoringReporting)
    }
  }, [wizardData.monitoringReporting])

  // Handle reporting setup changes
  const handleReportingSetupChange = (field: string, value: any) => {
    setMonitoringData((prev) => ({
      ...prev,
      reportingSetup: {
        ...prev.reportingSetup,
        [field]: value,
      },
    }))
  }

  // Handle custom requirements input
  const handleCustomRequirementsInput = (value: string) => {
    const requirements = value
      .split(",")
      .map((req) => req.trim())
      .filter(Boolean)

    setMonitoringData((prev) => ({
      ...prev,
      reportingSetup: {
        ...prev.reportingSetup,
        customReportingRequirements: requirements,
      },
    }))
  }

  // Handle portfolio monitoring changes
  const handlePortfolioMonitoringChange = (field: string, value: boolean) => {
    setMonitoringData((prev) => ({
      ...prev,
      portfolioMonitoring: {
        ...prev.portfolioMonitoring,
        [field]: value,
      },
    }))
  }

  // Handle performance metrics input
  const handlePerformanceMetricsInput = (value: string) => {
    const metrics = value
      .split(",")
      .map((metric) => metric.trim())
      .filter(Boolean)

    setMonitoringData((prev) => ({
      ...prev,
      portfolioMonitoring: {
        ...prev.portfolioMonitoring,
        performanceMetricsTracked: metrics,
      },
    }))
  }

  // Handle investor communication changes
  const handleCommunicationChange = (field: string, value: any) => {
    setMonitoringData((prev) => ({
      ...prev,
      investorCommunication: {
        ...prev.investorCommunication,
        [field]: value,
      },
    }))
  }

  // Handle continuous support changes
  const handleContinuousSupportChange = (field: string, value: boolean) => {
    setMonitoringData((prev) => ({
      ...prev,
      continuousSupport: {
        ...prev.continuousSupport,
        [field]: value,
      },
    }))
  }

  // Handle form submission
  const handleContinue = () => {
    // Validation
    if (
      monitoringData.investorCommunication.regularCallsScheduled &&
      !monitoringData.investorCommunication.callFrequency
    ) {
      toast({
        title: "Missing information",
        description:
          "Please specify the call frequency for regular investor calls",
        variant: "destructive",
      })
      return
    }

    if (
      monitoringData.investorCommunication.relationshipManagerAssigned &&
      !monitoringData.investorCommunication.relationshipManagerName
    ) {
      toast({
        title: "Missing information",
        description:
          "Please provide the name of your assigned relationship manager",
        variant: "destructive",
      })
      return
    }

    // Save data locally in the wizard
    updateWizardData({ monitoringReporting: monitoringData })

    // Convert the data to match API expectations
    const apiData = {
      preferredReportingFrequency: (():
        | "monthly"
        | "quarterly"
        | "annually"
        | "semi_annually" => {
        switch (monitoringData.reportingSetup.reportingFrequency) {
          case "monthly":
            return "monthly"
          case "quarterly":
            return "quarterly"
          case "biannual":
            return "semi_annually"
          case "annual":
            return "annually"
          default:
            return "quarterly"
        }
      })(),
      notificationPreferences: {
        push: monitoringData.portfolioMonitoring.alertsConfigured,
        email: monitoringData.reportingSetup.automaticReportingEnabled,
        sms: false,
      },
      hasSetupDashboardAlerts:
        monitoringData.portfolioMonitoring.alertsConfigured,
      hasScheduledPeriodicCalls:
        monitoringData.investorCommunication.regularCallsScheduled,
      meetingFrequency:
        monitoringData.investorCommunication.callFrequency || "Monthly",
      relationshipManagerName:
        monitoringData.investorCommunication.relationshipManagerName || "",
      performanceMetricsSelected:
        monitoringData.portfolioMonitoring.performanceMetricsTracked,
      specialReportingRequirements:
        monitoringData.reportingSetup.customReportingRequirements?.join(", ") ||
        "",
    }

    // Save data via API
    setIsLoading(true)
    saveMonitoringReporting.mutate(apiData, {
      onSettled: () => setIsLoading(false),
    })
  }

  // Format date for input fields
  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toISOString().split("T")[0]
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">
          Monitoring, Reporting, & Investor Relations
        </CardTitle>
        <CardDescription>
          Configure reporting preferences and communication protocols
        </CardDescription>
        {stepDataQuery.isLoading && (
          <p className="text-sm text-muted-foreground">Loading your data...</p>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Reporting Setup */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Reporting Setup</h3>

          <div className="rounded-md border border-border p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="reporting-frequency">Reporting Frequency</Label>
                <Select
                  value={monitoringData.reportingSetup.reportingFrequency}
                  onValueChange={(value) =>
                    handleReportingSetupChange("reportingFrequency", value)
                  }
                >
                  <SelectTrigger id="reporting-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="biannual">Bi-Annual</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="next-report-date">Next Report Date</Label>
                <Input
                  id="next-report-date"
                  type="date"
                  value={formatDateForInput(
                    monitoringData.reportingSetup.nextReportDate
                  )}
                  onChange={(e) =>
                    handleReportingSetupChange("nextReportDate", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="mt-4 flex items-center space-x-2">
              <Checkbox
                id="automatic-reporting"
                checked={
                  monitoringData.reportingSetup.automaticReportingEnabled
                }
                onCheckedChange={(checked) =>
                  handleReportingSetupChange(
                    "automaticReportingEnabled",
                    checked === true
                  )
                }
              />
              <Label htmlFor="automatic-reporting">
                Enable Automatic Report Delivery
              </Label>
            </div>

            <div className="mt-4 space-y-2">
              <Label htmlFor="custom-requirements">
                Custom Reporting Requirements (comma-separated)
              </Label>
              <Input
                id="custom-requirements"
                placeholder="e.g., ESG metrics, detailed maintenance costs, occupancy trends"
                value={
                  monitoringData.reportingSetup.customReportingRequirements?.join(
                    ", "
                  ) || ""
                }
                onChange={(e) => handleCustomRequirementsInput(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Portfolio Monitoring */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Portfolio Monitoring</h3>

          <div className="rounded-md border border-border p-4">
            <div className="mb-4 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="real-time"
                  checked={
                    monitoringData.portfolioMonitoring.realTimeAccessEnabled
                  }
                  onCheckedChange={(checked) =>
                    handlePortfolioMonitoringChange(
                      "realTimeAccessEnabled",
                      checked === true
                    )
                  }
                />
                <Label htmlFor="real-time">
                  Enable Real-Time Portfolio Access
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={monitoringData.portfolioMonitoring.alertsConfigured}
                  id="alerts"
                  onCheckedChange={(checked) =>
                    handlePortfolioMonitoringChange(
                      "alertsConfigured",
                      checked === true
                    )
                  }
                />
                <Label htmlFor="alerts">Configure Performance Alerts</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={monitoringData.portfolioMonitoring.benchmarkingSetup}
                  id="benchmarking"
                  onCheckedChange={(checked) =>
                    handlePortfolioMonitoringChange(
                      "benchmarkingSetup",
                      checked === true
                    )
                  }
                />
                <Label htmlFor="benchmarking">
                  Enable Performance Benchmarking
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="performance-metrics">
                Performance Metrics to Track (comma-separated)
              </Label>
              <Input
                id="performance-metrics"
                placeholder="e.g., occupancy, yield, capital appreciation, cash flow"
                value={
                  monitoringData.portfolioMonitoring.performanceMetricsTracked?.join(
                    ", "
                  ) || ""
                }
                onChange={(e) => handlePerformanceMetricsInput(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Investor Communication */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Investor Communication</h3>

          <div className="rounded-md border border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="regular-calls"
                  checked={
                    monitoringData.investorCommunication.regularCallsScheduled
                  }
                  onCheckedChange={(checked) =>
                    handleCommunicationChange(
                      "regularCallsScheduled",
                      checked === true
                    )
                  }
                />
                <Label className="font-medium" htmlFor="regular-calls">
                  Schedule Regular Progress Calls
                </Label>
              </div>

              {monitoringData.investorCommunication.regularCallsScheduled && (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                  Scheduled
                </Badge>
              )}
            </div>

            {monitoringData.investorCommunication.regularCallsScheduled && (
              <div className="mt-4 space-y-2">
                <Label htmlFor="call-frequency">Call Frequency</Label>
                <Input
                  id="call-frequency"
                  placeholder="e.g., Monthly, Quarterly"
                  value={
                    monitoringData.investorCommunication.callFrequency || ""
                  }
                  onChange={(e) =>
                    handleCommunicationChange("callFrequency", e.target.value)
                  }
                />
              </div>
            )}

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="relationship-manager"
                  checked={
                    monitoringData.investorCommunication
                      .relationshipManagerAssigned
                  }
                  onCheckedChange={(checked) =>
                    handleCommunicationChange(
                      "relationshipManagerAssigned",
                      checked === true
                    )
                  }
                />
                <Label className="font-medium" htmlFor="relationship-manager">
                  Assign Dedicated Relationship Manager
                </Label>
              </div>

              {monitoringData.investorCommunication
                .relationshipManagerAssigned && (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                  Assigned
                </Badge>
              )}
            </div>

            {monitoringData.investorCommunication
              .relationshipManagerAssigned && (
              <div className="mt-4 space-y-2">
                <Label htmlFor="manager-name">Relationship Manager Name</Label>
                <Input
                  id="manager-name"
                  placeholder="e.g., John Smith"
                  value={
                    monitoringData.investorCommunication
                      .relationshipManagerName || ""
                  }
                  onChange={(e) =>
                    handleCommunicationChange(
                      "relationshipManagerName",
                      e.target.value
                    )
                  }
                />
              </div>
            )}

            <div className="mt-4 flex items-center space-x-2">
              <Checkbox
                id="feedback-mechanism"
                checked={
                  monitoringData.investorCommunication
                    .feedbackMechanismEstablished
                }
                onCheckedChange={(checked) =>
                  handleCommunicationChange(
                    "feedbackMechanismEstablished",
                    checked === true
                  )
                }
              />
              <Label htmlFor="feedback-mechanism">
                Establish Feedback Mechanism
              </Label>
            </div>
          </div>
        </div>

        {/* Continuous Support */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Continuous Support</h3>

          <div className="rounded-md border border-border p-4">
            <div className="grid gap-4 sm:grid-cols-1">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="compliance-assistance"
                  checked={
                    monitoringData.continuousSupport
                      .complianceAssistanceAvailable
                  }
                  onCheckedChange={(checked) =>
                    handleContinuousSupportChange(
                      "complianceAssistanceAvailable",
                      checked === true
                    )
                  }
                />
                <Label htmlFor="compliance-assistance">
                  Request Compliance & Regulatory Assistance
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="strategy-adjustment"
                  checked={
                    monitoringData.continuousSupport.strategyAdjustmentProcess
                  }
                  onCheckedChange={(checked) =>
                    handleContinuousSupportChange(
                      "strategyAdjustmentProcess",
                      checked === true
                    )
                  }
                />
                <Label htmlFor="strategy-adjustment">
                  Establish Strategy Adjustment Process
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={monitoringData.continuousSupport.escalationProcedure}
                  id="escalation-procedure"
                  onCheckedChange={(checked) =>
                    handleContinuousSupportChange(
                      "escalationProcedure",
                      checked === true
                    )
                  }
                />
                <Label htmlFor="escalation-procedure">
                  Set Up Issue Escalation Procedure
                </Label>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Additional Notes</h3>

          <div className="space-y-2">
            <Label htmlFor="monitoring-notes">
              Additional Monitoring & Reporting Notes
            </Label>
            <Textarea
              className="min-h-[100px]"
              id="monitoring-notes"
              placeholder="Enter any additional notes about monitoring, reporting, or communication preferences..."
              value={monitoringData.monitoringNotes || ""}
              onChange={(e) =>
                setMonitoringData((prev) => ({
                  ...prev,
                  monitoringNotes: e.target.value,
                }))
              }
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button disabled={isLoading} variant="outline" onClick={onBack}>
          Back to Transaction Execution
        </Button>
        <Button
          className="w-[300px]"
          disabled={isLoading}
          onClick={handleContinue}
        >
          {isLoading ? "Saving..." : "Continue to Secondary Market & Exit"}
        </Button>
      </CardFooter>
    </Card>
  )
}
