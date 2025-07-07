/*eslint-disable no-nested-ternary */
/*eslint-disable max-lines */
import { useEffect, useState } from "react"

import { Alert, AlertDescription, AlertTitle } from "@package/ui/alert"
import { Button } from "@package/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@package/ui/card"
import { Input } from "@package/ui/input"
import { Label } from "@package/ui/label"
import { Switch } from "@package/ui/switch"
import { Textarea } from "@package/ui/textarea"
import { AlertCircle, CheckCircle, Clock, Settings } from "lucide-react"

import type { BaseStepProps } from "../StepProps"
import type { FinalConfiguration } from "../types"

import { api } from "@/lib/trpc/react"

export function FinalConfigurationStep({
  wizardData,
  updateWizardData,
  onNext,
  onBack,
  setGuideMessage,
}: BaseStepProps) {
  // Set the guide message for this step
  useEffect(() => {
    setGuideMessage(
      "This is the final step before your Buy Box can be submitted for approval. Review all settings, configure launch parameters, and set any final options before submission."
    )
  }, [setGuideMessage])

  // Local state for final configuration
  const [finalConfig, setFinalConfig] = useState<FinalConfiguration>(() => {
    // Initialize with existing data or defaults
    return (
      wizardData.finalConfiguration || {
        launchDate: getNextBusinessDay(),
        minInvestmentAmount: 50000,
        maxInvestmentAmount: 1000000,
        allowPartialFunding: true,
        fundingDeadline: getDateInDays(30),
        enableEarlyAccess: true,
        earlyAccessGroups: ["premium_investors", "institutional"],
        administrativeNotes: "",
        notifyInvestors: true,
        launchStrategy: "immediate",
        reviewNotes: "",
      }
    )
  })

  const [isLoading, setIsLoading] = useState(false)

  // API mutation
  const submitForApprovalMutation =
    api.admin.buyBoxCreation.submitForApproval.useMutation()

  // Get next business day (excluding weekends)
  function getNextBusinessDay(): string {
    const date = new Date()
    date.setDate(date.getDate() + 1) // Start with tomorrow

    // Adjust for weekends
    const day = date.getDay()
    if (day === 6) {
      // Saturday
      date.setDate(date.getDate() + 2)
    } else if (day === 0) {
      // Sunday
      date.setDate(date.getDate() + 1)
    }

    return date.toISOString().split("T")[0]
  }

  // Get date n days in the future
  function getDateInDays(days: number): string {
    const date = new Date()
    date.setDate(date.getDate() + days)
    return date.toISOString().split("T")[0]
  }

  // Handle input changes for string and number fields
  const handleInputChange = (
    field: string,
    value: string | number | boolean
  ) => {
    setFinalConfig((prev: FinalConfiguration) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle array toggles for early access groups
  const handleEarlyAccessGroupToggle = (group: string, isActive: boolean) => {
    setFinalConfig((prev: FinalConfiguration) => {
      if (isActive) {
        return {
          ...prev,
          earlyAccessGroups: [...prev.earlyAccessGroups, group],
        }
      } else {
        return {
          ...prev,
          earlyAccessGroups: prev.earlyAccessGroups.filter(
            (g: string) => g !== group
          ),
        }
      }
    })
  }

  // Validate configuration before submission
  const validateConfiguration = (): string[] => {
    const errors: string[] = []

    // Validate launch date
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const launchDate = new Date(finalConfig.launchDate)

    if (launchDate < today) {
      errors.push("Launch date cannot be in the past")
    }

    // Validate funding deadline
    const fundingDeadline = new Date(finalConfig.fundingDeadline)
    if (fundingDeadline <= launchDate) {
      errors.push("Funding deadline must be after launch date")
    }

    // Validate investment amounts
    if (finalConfig.minInvestmentAmount <= 0) {
      errors.push("Minimum investment amount must be greater than zero")
    }

    if (finalConfig.maxInvestmentAmount <= finalConfig.minInvestmentAmount) {
      errors.push(
        "Maximum investment amount must be greater than minimum investment amount"
      )
    }

    return errors
  }

  // Handle form submission
  const handleFinish = () => {
    // Validation
    const errors = validateConfiguration()
    if (errors.length > 0) {
      const errorMessage = `Please fix the following issues:\n${errors.join("\n")}`
      alert(errorMessage)
      return
    }

    // Save data and move to next step
    updateWizardData({ finalConfiguration: finalConfig })

    // Call API to submit for approval
    setIsLoading(true)
    submitForApprovalMutation.mutate(
      {
        buyBoxId: localStorage.getItem("buyBoxId") || "", // TODO: make dynamic
        notes: finalConfig.reviewNotes,
      },
      {
        onSuccess: () => {
          setIsLoading(false)
          onNext()
        },
        onError: (error) => {
          console.error("Error submitting Buy Box for approval:", error)
          setIsLoading(false)
          alert("Error submitting Buy Box for approval. Please try again.")
        },
      }
    )
  }

  // Get completion percentage based on previous steps
  const getCompletionPercentage = (): number => {
    const steps = [
      !!wizardData.buyBoxTheme,
      !!wizardData.selectedProperties &&
        wizardData.selectedProperties.length > 0,
      !!wizardData.financialModel,
      !!wizardData.complianceInfo,
      !!wizardData.platformListing,
    ]

    const completedSteps = steps.filter(Boolean).length
    return Math.round((completedSteps / steps.length) * 100)
  }

  // Check if all required steps are complete
  const allStepsComplete = getCompletionPercentage() === 100

  // Check if financial metrics are within acceptable ranges
  const getFinancialHealthStatus = (): "good" | "warning" | "critical" => {
    if (!wizardData.financialModel) return "warning"

    const { expectedReturns, riskAnalysis } = wizardData.financialModel

    // Example checks - these would be based on your specific business rules
    if (expectedReturns.targetYield < 4.0 || riskAnalysis.riskRating > 7) {
      return "critical"
    } else if (
      expectedReturns.targetYield < 5.0 ||
      riskAnalysis.riskRating > 5
    ) {
      return "warning"
    } else {
      return "good"
    }
  }

  // Helper for formatting currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(value)
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">
          Final Configuration & Submission
        </CardTitle>
        <CardDescription>
          Configure launch parameters and review before submitting your Buy Box
          for approval
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Completion Status */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Completion Status</h3>

          <div className="flex items-center gap-4">
            <div className="flex-1 rounded-full bg-muted">
              <div
                className={`h-2 rounded-full ${getCompletionPercentage() === 100 ? "bg-green-500" : "bg-amber-500"}`}
                style={{ width: `${getCompletionPercentage()}%` }}
              />
            </div>
            <span className="font-medium">{getCompletionPercentage()}%</span>
          </div>

          <Alert variant={allStepsComplete ? "default" : "destructive"}>
            <div className="flex items-start gap-2">
              {allStepsComplete ? (
                <CheckCircle className="mt-0.5 size-5 text-green-500" />
              ) : (
                <AlertCircle className="mt-0.5 size-5 text-amber-500" />
              )}
              <div>
                <AlertTitle className="text-sm font-medium">
                  {allStepsComplete
                    ? "All Required Steps Completed"
                    : "Required Steps Incomplete"}
                </AlertTitle>
                <AlertDescription className="text-xs">
                  {allStepsComplete
                    ? "You have completed all required steps and can submit this Buy Box for review."
                    : "Please complete all previous steps before final submission."}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        </div>

        {/* Launch Parameters */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Launch Parameters</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="launch-date">Launch Date</Label>
              <Input
                id="launch-date"
                min={new Date().toISOString().split("T")[0]}
                type="date"
                value={finalConfig.launchDate}
                onChange={(e) =>
                  handleInputChange("launchDate", e.target.value)
                }
              />
              <p className="text-xs text-muted-foreground">
                Date when this Buy Box will be available to investors
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="funding-deadline">Funding Deadline</Label>
              <Input
                id="funding-deadline"
                min={finalConfig.launchDate}
                type="date"
                value={finalConfig.fundingDeadline}
                onChange={(e) =>
                  handleInputChange("fundingDeadline", e.target.value)
                }
              />
              <p className="text-xs text-muted-foreground">
                Date by which funding must be completed
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="min-investment">Minimum Investment</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  £
                </span>
                <Input
                  className="pl-7"
                  id="min-investment"
                  min={1}
                  type="number"
                  value={finalConfig.minInvestmentAmount}
                  onChange={(e) =>
                    handleInputChange(
                      "minInvestmentAmount",
                      parseFloat(e.target.value)
                    )
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-investment">Maximum Investment</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  £
                </span>
                <Input
                  className="pl-7"
                  id="max-investment"
                  min={finalConfig.minInvestmentAmount}
                  type="number"
                  value={finalConfig.maxInvestmentAmount}
                  onChange={(e) =>
                    handleInputChange(
                      "maxInvestmentAmount",
                      parseFloat(e.target.value)
                    )
                  }
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center space-x-2">
              <Switch
                checked={finalConfig.allowPartialFunding}
                id="partial-funding"
                onCheckedChange={(checked) =>
                  handleInputChange("allowPartialFunding", checked)
                }
              />
              <Label className="cursor-pointer" htmlFor="partial-funding">
                Allow Partial Funding
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={finalConfig.notifyInvestors}
                id="notify-investors"
                onCheckedChange={(checked) =>
                  handleInputChange("notifyInvestors", checked)
                }
              />
              <Label className="cursor-pointer" htmlFor="notify-investors">
                Notify Eligible Investors
              </Label>
            </div>
          </div>
        </div>

        {/* Early Access */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Early Access Settings</h3>
            <div className="flex items-center space-x-2">
              <Switch
                checked={finalConfig.enableEarlyAccess}
                id="enable-early-access"
                onCheckedChange={(checked) =>
                  handleInputChange("enableEarlyAccess", checked)
                }
              />
              <Label className="cursor-pointer" htmlFor="enable-early-access">
                Enable Early Access
              </Label>
            </div>
          </div>

          {finalConfig.enableEarlyAccess && (
            <div className="rounded-md border border-border p-4">
              <p className="mb-4 text-sm text-muted-foreground">
                Select investor groups who will have early access to this Buy
                Box before public launch
              </p>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="premium-investors"
                    checked={finalConfig.earlyAccessGroups.includes(
                      "premium_investors"
                    )}
                    onCheckedChange={(checked) =>
                      handleEarlyAccessGroupToggle("premium_investors", checked)
                    }
                  />
                  <Label className="cursor-pointer" htmlFor="premium-investors">
                    Premium Investors
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="institutional-investors"
                    checked={finalConfig.earlyAccessGroups.includes(
                      "institutional"
                    )}
                    onCheckedChange={(checked) =>
                      handleEarlyAccessGroupToggle("institutional", checked)
                    }
                  />
                  <Label
                    className="cursor-pointer"
                    htmlFor="institutional-investors"
                  >
                    Institutional Investors
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="strategic-partners"
                    checked={finalConfig.earlyAccessGroups.includes(
                      "strategic_partners"
                    )}
                    onCheckedChange={(checked) =>
                      handleEarlyAccessGroupToggle(
                        "strategic_partners",
                        checked
                      )
                    }
                  />
                  <Label
                    className="cursor-pointer"
                    htmlFor="strategic-partners"
                  >
                    Strategic Partners
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="repeat-investors"
                    checked={finalConfig.earlyAccessGroups.includes(
                      "repeat_investors"
                    )}
                    onCheckedChange={(checked) =>
                      handleEarlyAccessGroupToggle("repeat_investors", checked)
                    }
                  />
                  <Label className="cursor-pointer" htmlFor="repeat-investors">
                    Repeat Investors
                  </Label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Launch Strategy */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Launch Strategy</h3>

          <div className="grid gap-4 sm:grid-cols-3">
            <button
              className={`cursor-pointer rounded-md border p-4 transition-colors ${
                finalConfig.launchStrategy === "immediate"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/20"
              }`}
              onClick={() => handleInputChange("launchStrategy", "immediate")}
            >
              <div className="mb-2 flex items-center gap-2">
                <Clock className="size-5 text-primary" />
                <h4 className="font-medium">Immediate Launch</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Launch on specified date without phased rollout
              </p>
            </button>

            <button
              className={`cursor-pointer rounded-md border p-4 transition-colors ${
                finalConfig.launchStrategy === "phased"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/20"
              }`}
              onClick={() => handleInputChange("launchStrategy", "phased")}
            >
              <div className="mb-2 flex items-center gap-2">
                <Settings className="size-5 text-primary" />
                <h4 className="font-medium">Phased Rollout</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Launch in phases to different investor groups
              </p>
            </button>

            <button
              className={`cursor-pointer rounded-md border p-4 transition-colors ${
                finalConfig.launchStrategy === "waitlist"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/20"
              }`}
              onClick={() => handleInputChange("launchStrategy", "waitlist")}
            >
              <div className="mb-2 flex items-center gap-2">
                <AlertCircle className="size-5 text-primary" />
                <h4 className="font-medium">Waitlist Mode</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Allow investors to join waitlist before launch
              </p>
            </button>
          </div>
        </div>

        {/* Administrative Notes */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Administrative Notes</h3>

          <div className="space-y-2">
            <Label htmlFor="admin-notes">
              Notes for Review Team (Internal Only)
            </Label>
            <Textarea
              className="min-h-[100px]"
              id="admin-notes"
              placeholder="Add any additional notes or context for the review team..."
              value={finalConfig.administrativeNotes}
              onChange={(e) =>
                handleInputChange("administrativeNotes", e.target.value)
              }
            />
            <p className="text-xs text-muted-foreground">
              These notes will only be visible to administrators and compliance
              officers
            </p>
          </div>
        </div>

        {/* Financial Health Check */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Buy Box Health Check</h3>

          <div className="rounded-md border border-border p-4">
            <div className="mb-4 grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Investment Total
                </p>
                <p className="text-lg font-semibold">
                  {wizardData.financialModel
                    ? formatCurrency(
                        wizardData.financialModel.pricing.totalInvestmentPrice
                      )
                    : "N/A"}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Target Yield</p>
                <p className="text-lg font-semibold">
                  {wizardData.financialModel
                    ? `${wizardData.financialModel.expectedReturns.targetYield}%`
                    : "N/A"}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Risk Rating</p>
                <p className="text-lg font-semibold">
                  {wizardData.financialModel
                    ? `${wizardData.financialModel.riskAnalysis.riskRating}/10`
                    : "N/A"}
                </p>
              </div>
            </div>

            <Alert
              variant={
                getFinancialHealthStatus() === "good"
                  ? "default"
                  : "destructive"
              }
            >
              <AlertCircle className="size-4" />
              <AlertTitle>
                {getFinancialHealthStatus() === "good"
                  ? "Financial Metrics Look Good"
                  : getFinancialHealthStatus() === "warning"
                    ? "Some Financial Metrics Need Attention"
                    : "Critical Financial Issues Detected"}
              </AlertTitle>
              <AlertDescription>
                {getFinancialHealthStatus() === "good"
                  ? "All financial parameters are within desired ranges."
                  : getFinancialHealthStatus() === "warning"
                    ? "Some financial parameters may need adjustment before final approval."
                    : "Critical issues with financial metrics may prevent approval."}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Platform Listing
        </Button>
        <Button
          className="w-[300px]"
          disabled={!allStepsComplete || isLoading}
          onClick={handleFinish}
        >
          {isLoading ? "Submitting..." : "Submit Buy Box for Approval"}
        </Button>
      </CardFooter>
    </Card>
  )
}
