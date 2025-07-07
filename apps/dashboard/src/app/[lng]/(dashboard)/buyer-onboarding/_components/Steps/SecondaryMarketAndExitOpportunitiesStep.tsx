/*eslint-disable @typescript-eslint/no-explicit-any */
/*eslint-disable react/jsx-max-depth */
/*eslint-disable max-lines */
/*eslint-disable  @typescript-eslint/no-unnecessary-condition */
/*eslint-disable  no-nested-ternary */
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
import { RadioGroup, RadioGroupItem } from "@package/ui/radio-group"
import { Textarea } from "@package/ui/textarea"
import { useToast } from "@package/ui/toast"

import type { BaseStepProps } from "../StepProps"
import type { SecondaryMarketAndExit } from "../types"
import type { AppRouter } from "@package/api"
import type { inferRouterInputs } from "@trpc/server"

import { api } from "@/lib/trpc/react"

// Add type aliases at the top level
type RouterInputs = inferRouterInputs<AppRouter>

export function SecondaryMarketAndExitOpportunitiesStep({
  wizardData,
  updateWizardData,
  onBack,
  onComplete,
  setGuideMessage,
}: Omit<BaseStepProps, "onNext"> & { onComplete: () => void }) {
  // Set the guide message for this step
  useEffect(() => {
    setGuideMessage(
      "Planning for secondary market access and future exit strategies is an important part of your investment journey. We'll establish parameters for liquidity, valuation, and potential exit scenarios to ensure your long-term investment goals are supported."
    )
  }, [setGuideMessage])

  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [finalAcknowledged, setFinalAcknowledged] = useState(false)

  // Query to get existing data for this step
  const stepDataQuery = api.buyer.getStepData.useQuery(
    { step: "secondaryMarket" as const },
    {
      enabled: true,
    }
  )

  // Mutation to save data
  const saveSecondaryMarket = api.buyer.submitSecondaryMarket.useMutation({
    onSuccess: () => {
      toast({
        title: "Secondary market data saved",
        description:
          "Your exit strategies and secondary market preferences have been saved.",
      })

      // After saving secondary market data, complete the onboarding if acknowledged
      if (finalAcknowledged) {
        completeOnboarding.mutate()
      } else {
        setIsLoading(false)
      }
    },
    onError: (error) => {
      setIsLoading(false)
      toast({
        title: "Error saving data",
        description:
          error.message ||
          "Could not save secondary market data. Please try again.",
        variant: "destructive",
      })
    },
  })

  // Mutation to complete the entire onboarding process
  const completeOnboarding = api.buyer.completeOnboarding.useMutation({
    onSuccess: () => {
      setIsLoading(false)
      toast({
        title: "Onboarding complete!",
        description:
          "Congratulations! Your onboarding process has been successfully completed.",
      })
      onComplete()
    },
    onError: (error) => {
      setIsLoading(false)
      toast({
        title: "Error completing onboarding",
        description:
          error.message ||
          "Could not complete the onboarding process. Please try again.",
        variant: "destructive",
      })
    },
  })

  // Initialize local state with existing data or defaults
  const [exitData, setExitData] = useState<SecondaryMarketAndExit>(
    () =>
      wizardData.secondaryMarket || {
        secondaryMarketAccess: {
          accessEnabled: true,
          liquidityOptionsReviewed: true,
          secondaryMarketTermsAcknowledged: false,
        },
        exitPlanning: {
          initialInvestmentTerm: 5, // 5 years
          autoRenewalOption: true,
          exitStrategyDiscussed: false,
          plannedExitDate: "",
        },
        valuationFramework: {
          regularValuationSchedule: true,
          valuationMethodologyAgreed: false,
          independentValuationsRequired: true,
          lastValuationDate: "",
        },
        exitNotes: "",
      }
  )

  // Update local state when wizardData changes
  useEffect(() => {
    if (wizardData.secondaryMarket) {
      setExitData(wizardData.secondaryMarket)
    }
  }, [wizardData.secondaryMarket])

  // Handle secondary market access changes
  const handleSecondaryMarketChange = (field: string, value: boolean) => {
    setExitData((prev) => ({
      ...prev,
      secondaryMarketAccess: {
        ...prev.secondaryMarketAccess,
        [field]: value,
      },
    }))
  }

  // Handle exit planning changes
  const handleExitPlanningChange = (field: string, value: any) => {
    setExitData((prev) => ({
      ...prev,
      exitPlanning: {
        ...prev.exitPlanning,
        [field]: value,
      },
    }))
  }

  // Handle valuation framework changes
  const handleValuationFrameworkChange = (field: string, value: boolean) => {
    setExitData((prev) => ({
      ...prev,
      valuationFramework: {
        ...prev.valuationFramework,
        [field]: value,
      },
    }))
  }

  // Transform the exitData to match the expected input type
  const transformExitDataForSubmission = (
    data: SecondaryMarketAndExit
  ): RouterInputs["buyer"]["submitSecondaryMarket"] => {
    return {
      interestedInSecondaryMarket: data.secondaryMarketAccess.accessEnabled,
      hasReviewedLiquidityOptions:
        data.secondaryMarketAccess.liquidityOptionsReviewed,
      hasTrustedBeneficiaries:
        data.secondaryMarketAccess.secondaryMarketTermsAcknowledged,
      expectedHoldingPeriod:
        data.exitPlanning.initialInvestmentTerm <= 1
          ? "less_than_1_year"
          : data.exitPlanning.initialInvestmentTerm <= 2
            ? "1_2_years"
            : data.exitPlanning.initialInvestmentTerm <= 5
              ? "3_5_years"
              : "5_plus_years",
      exitStrategyPreferences: data.exitNotes ? "hold_long_term" : undefined,
    }
  }

  // Handle form submission
  const handleComplete = () => {
    // Validation
    if (
      exitData.secondaryMarketAccess.secondaryMarketTermsAcknowledged === false
    ) {
      toast({
        title: "Acknowledgement required",
        description: "Please acknowledge the Secondary Market Terms",
        variant: "destructive",
      })
      return
    }

    if (
      exitData.exitPlanning.exitStrategyDiscussed &&
      !exitData.exitPlanning.plannedExitDate
    ) {
      toast({
        title: "Date required",
        description: "Please provide a planned exit date",
        variant: "destructive",
      })
      return
    }

    if (!finalAcknowledged) {
      toast({
        title: "Acknowledgement required",
        description:
          "Please check the final acknowledgement to complete onboarding",
        variant: "destructive",
      })
      return
    }

    // Save data locally in the wizard
    updateWizardData({ secondaryMarket: exitData })

    // Save data via API and then complete onboarding
    setIsLoading(true)
    saveSecondaryMarket.mutate(transformExitDataForSubmission(exitData))
  }

  // Format date for input fields
  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toISOString().split("T")[0]
  }

  // Get a future date based on the investment term
  const getFutureDate = (years: number): string => {
    const date = new Date()
    date.setFullYear(date.getFullYear() + years)
    return date.toISOString().split("T")[0]
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">
          Secondary Market & Exit Opportunities
        </CardTitle>
        <CardDescription>
          Configure secondary market access and exit planning
        </CardDescription>
        {stepDataQuery.isLoading && (
          <p className="text-sm text-muted-foreground">Loading your data...</p>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Secondary Market Access */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Secondary Market Access</h3>

          <div className="rounded-md border border-border p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={exitData.secondaryMarketAccess.accessEnabled}
                  id="access-enabled"
                  onCheckedChange={(checked) =>
                    handleSecondaryMarketChange(
                      "accessEnabled",
                      checked === true
                    )
                  }
                />
                <Label className="font-medium" htmlFor="access-enabled">
                  Enable Secondary Market Access
                </Label>
              </div>

              {exitData.secondaryMarketAccess.accessEnabled && (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                  Enabled
                </Badge>
              )}
            </div>

            <div className="mb-4 flex items-center space-x-2">
              <Checkbox
                id="liquidity-options"
                checked={
                  exitData.secondaryMarketAccess.liquidityOptionsReviewed
                }
                onCheckedChange={(checked) =>
                  handleSecondaryMarketChange(
                    "liquidityOptionsReviewed",
                    checked === true
                  )
                }
              />
              <Label htmlFor="liquidity-options">
                Liquidity Options Reviewed
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms-acknowledged"
                checked={
                  exitData.secondaryMarketAccess
                    .secondaryMarketTermsAcknowledged
                }
                onCheckedChange={(checked) =>
                  handleSecondaryMarketChange(
                    "secondaryMarketTermsAcknowledged",
                    checked === true
                  )
                }
              />
              <Label htmlFor="terms-acknowledged">
                I acknowledge the secondary market terms and conditions,
                including potential fees, restrictions, and disclosure
                requirements.
              </Label>
            </div>
          </div>
        </div>

        {/* Exit Planning */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Exit Planning</h3>

          <div className="rounded-md border border-border p-4">
            <div className="mb-4 space-y-2">
              <Label htmlFor="investment-term">
                Initial Investment Term (Years)
              </Label>
              <Input
                id="investment-term"
                max={30}
                min={1}
                type="number"
                value={exitData.exitPlanning.initialInvestmentTerm}
                onChange={(e) =>
                  handleExitPlanningChange(
                    "initialInvestmentTerm",
                    parseInt(e.target.value)
                  )
                }
              />
              <p className="text-xs text-muted-foreground">
                Default exit opportunity after{" "}
                {exitData.exitPlanning.initialInvestmentTerm} years (
                {getFutureDate(exitData.exitPlanning.initialInvestmentTerm)})
              </p>
            </div>

            <div className="mb-4 flex items-center space-x-2">
              <Checkbox
                checked={exitData.exitPlanning.autoRenewalOption}
                id="auto-renewal"
                onCheckedChange={(checked) =>
                  handleExitPlanningChange(
                    "autoRenewalOption",
                    checked === true
                  )
                }
              />
              <Label htmlFor="auto-renewal">Enable Auto-Renewal Option</Label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={exitData.exitPlanning.exitStrategyDiscussed}
                  id="exit-strategy"
                  onCheckedChange={(checked) =>
                    handleExitPlanningChange(
                      "exitStrategyDiscussed",
                      checked === true
                    )
                  }
                />
                <Label className="font-medium" htmlFor="exit-strategy">
                  Exit Strategy Discussed
                </Label>
              </div>

              {exitData.exitPlanning.exitStrategyDiscussed && (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                  Discussed
                </Badge>
              )}
            </div>

            {exitData.exitPlanning.exitStrategyDiscussed && (
              <div className="mt-4 space-y-2">
                <Label htmlFor="planned-exit-date">Planned Exit Date</Label>
                <Input
                  id="planned-exit-date"
                  type="date"
                  value={formatDateForInput(
                    exitData.exitPlanning.plannedExitDate
                  )}
                  onChange={(e) =>
                    handleExitPlanningChange("plannedExitDate", e.target.value)
                  }
                />
              </div>
            )}
          </div>
        </div>

        {/* Valuation Framework */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Valuation Framework</h3>

          <div className="rounded-md border border-border p-4">
            <div className="mb-4 flex items-center space-x-2">
              <Checkbox
                checked={exitData.valuationFramework.regularValuationSchedule}
                id="regular-valuation"
                onCheckedChange={(checked) =>
                  handleValuationFrameworkChange(
                    "regularValuationSchedule",
                    checked === true
                  )
                }
              />
              <Label htmlFor="regular-valuation">
                Establish Regular Valuation Schedule
              </Label>
            </div>

            <div className="mb-4 flex items-center space-x-2">
              <Checkbox
                checked={exitData.valuationFramework.valuationMethodologyAgreed}
                id="valuation-methodology"
                onCheckedChange={(checked) =>
                  handleValuationFrameworkChange(
                    "valuationMethodologyAgreed",
                    checked === true
                  )
                }
              />
              <Label htmlFor="valuation-methodology">
                Valuation Methodology Agreed
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="independent-valuations"
                checked={
                  exitData.valuationFramework.independentValuationsRequired
                }
                onCheckedChange={(checked) =>
                  handleValuationFrameworkChange(
                    "independentValuationsRequired",
                    checked === true
                  )
                }
              />
              <Label htmlFor="independent-valuations">
                Require Independent Valuations
              </Label>
            </div>

            {exitData.valuationFramework.regularValuationSchedule && (
              <div className="mt-4 space-y-2">
                <Label htmlFor="valuation-frequency">Valuation Frequency</Label>
                <RadioGroup
                  className="flex space-x-4"
                  defaultValue="annual"
                  id="valuation-frequency"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="annual" value="annual" />
                    <Label htmlFor="annual">Annual</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="biannual" value="biannual" />
                    <Label htmlFor="biannual">Bi-Annual</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="quarterly" value="quarterly" />
                    <Label htmlFor="quarterly">Quarterly</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>
        </div>

        {/* Additional Notes */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Additional Notes</h3>

          <div className="space-y-2">
            <Label htmlFor="exit-notes">
              Additional Secondary Market & Exit Notes
            </Label>
            <Textarea
              className="min-h-[100px]"
              id="exit-notes"
              placeholder="Enter any additional notes about secondary market access, exit preferences, or valuation requirements..."
              value={exitData.exitNotes || ""}
              onChange={(e) =>
                setExitData((prev) => ({
                  ...prev,
                  exitNotes: e.target.value,
                }))
              }
            />
          </div>
        </div>

        {/* Final Acknowledgement */}
        <div className="rounded-md bg-muted/20 p-4">
          <h3 className="mb-2 text-lg font-medium">Final Acknowledgement</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            By completing this onboarding process, you acknowledge that you have
            reviewed and understood the terms and conditions associated with
            investing in Buy-Boxes through our platform. This includes
            investment risks, fee structures, portfolio management practices,
            and exit mechanisms.
          </p>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={finalAcknowledged}
              id="final-acknowledgement"
              onCheckedChange={(checked) =>
                setFinalAcknowledged(checked === true)
              }
            />
            <Label htmlFor="final-acknowledgement">
              I acknowledge that I have completed the institutional buyer
              onboarding process and am ready to begin investing.
            </Label>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button disabled={isLoading} variant="outline" onClick={onBack}>
          Back to Monitoring & Reporting
        </Button>
        <Button
          className="w-[300px]"
          disabled={isLoading}
          onClick={handleComplete}
        >
          {isLoading ? "Saving..." : "Complete Onboarding"}
        </Button>
      </CardFooter>
    </Card>
  )
}
