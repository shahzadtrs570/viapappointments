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
import { Input } from "@package/ui/input"
import { Label } from "@package/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@package/ui/select"
import { Slider } from "@package/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@package/ui/tabs"
import { Textarea } from "@package/ui/textarea"

import type { BaseStepProps } from "../StepProps"
import type { FinancialModel } from "../types"

import { api } from "@/lib/trpc/react"

export function FinancialModelingStep({
  wizardData,
  updateWizardData,
  onNext,
  onBack,
  setGuideMessage,
}: BaseStepProps) {
  // Set the guide message for this step
  useEffect(() => {
    setGuideMessage(
      "Financial modeling is critical for your Buy Box. Define bouquet and annuity ratios, calculate expected returns, and assess risks. Institutional investors require clear, transparent financial projections."
    )
  }, [setGuideMessage])

  // Calculate the total value of selected properties
  const calculateTotalPropertyValue = () => {
    if (
      !wizardData.selectedProperties ||
      wizardData.selectedProperties.length === 0
    ) {
      return 0
    }

    return wizardData.selectedProperties.reduce(
      (sum, property) => sum + property.estimatedValue,
      0
    )
  }

  // Local state for the financial model
  const [financialModel, setFinancialModel] = useState<FinancialModel>(() => {
    const totalValue = calculateTotalPropertyValue()

    // Initialize with existing data or default values based on selected properties
    return (
      wizardData.financialModel || {
        totalBouquet: totalValue * 0.3, // Default 30% bouquet
        totalMonthlyAnnuity: (totalValue * 0.7) / 180, // Rough estimate for monthly payments over 15 years
        guaranteedTerms: {
          minYears: 15,
          details: "Minimum guaranteed term of 15 years",
        },
        expectedReturns: {
          conservativeYield: 3.5,
          targetYield: 5.2,
          optimisticYield: 6.8,
        },
        riskAnalysis: {
          longevityRisk: "medium",
          marketRisk: "low",
          defaultRisk: "low",
          riskRating: 4,
          notes:
            "Balanced risk profile with primary exposure to longevity factors",
        },
        pricing: {
          totalInvestmentPrice: totalValue * 0.8, // 20% discount to market value
          bouquetPercentage: 30,
          annuityPercentage: 70,
          managementFees: totalValue * 0.01, // 1% management fee
          otherFees: totalValue * 0.005, // 0.5% other fees
        },
        cashFlowProjections: Array.from({ length: 20 }, (_, i) => ({
          year: i + 1,
          expectedCashFlow:
            i < 15
              ? (totalValue * 0.7) / 15 // Annuity payments during guaranteed term
              : ((totalValue * 0.7) / 15) * 0.8, // Reduced by mortality factors after guaranteed term
        })),
      }
    )
  })

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(value)
  }

  // Handle bouquet-annuity ratio change
  const handleRatioChange = (bouquetPercentage: number) => {
    const totalValue = calculateTotalPropertyValue()
    const annuityPercentage = 100 - bouquetPercentage

    setFinancialModel((prev) => ({
      ...prev,
      totalBouquet: totalValue * (bouquetPercentage / 100),
      totalMonthlyAnnuity:
        (totalValue * (annuityPercentage / 100)) /
        (prev.guaranteedTerms.minYears * 12),
      pricing: {
        ...prev.pricing,
        bouquetPercentage,
        annuityPercentage,
      },
    }))
  }

  // Handle guaranteed term change
  const handleTermChange = (minYears: number) => {
    const totalValue = calculateTotalPropertyValue()
    const annuityPercentage = 100 - financialModel.pricing.bouquetPercentage

    setFinancialModel((prev) => ({
      ...prev,
      totalMonthlyAnnuity:
        (totalValue * (annuityPercentage / 100)) / (minYears * 12),
      guaranteedTerms: {
        ...prev.guaranteedTerms,
        minYears,
      },
      // Recalculate cash flow projections
      cashFlowProjections: Array.from({ length: 20 }, (_, i) => ({
        year: i + 1,
        expectedCashFlow:
          i < minYears
            ? (totalValue * (annuityPercentage / 100)) / minYears
            : ((totalValue * (annuityPercentage / 100)) / minYears) * 0.8,
      })),
    }))
  }

  // Handle risk rating changes
  const handleRiskChange = (
    riskType: string,
    value: "low" | "medium" | "high"
  ) => {
    setFinancialModel((prev) => ({
      ...prev,
      riskAnalysis: {
        ...prev.riskAnalysis,
        [riskType]: value,
      },
    }))
  }

  // Handle yield changes
  const handleYieldChange = (yieldType: string, value: string) => {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return

    setFinancialModel((prev) => ({
      ...prev,
      expectedReturns: {
        ...prev.expectedReturns,
        [yieldType]: numValue,
      },
    }))
  }

  // Handle pricing changes
  const handlePricingChange = (field: string, value: string) => {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return

    setFinancialModel((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [field]: numValue,
      },
    }))
  }

  // API mutation
  const updateFinancialModelMutation =
    api.admin.buyBoxCreation.updateFinancialModel.useMutation()

  // Handle form submission
  const [isLoading, setIsLoading] = useState(false)

  const handleContinue = () => {
    // Validation
    if (financialModel.pricing.totalInvestmentPrice <= 0) {
      alert("Total investment price must be greater than zero")
      return
    }

    // Save data and move to next step
    updateWizardData({ financialModel })

    // Call API to update financial model
    setIsLoading(true)
    updateFinancialModelMutation.mutate(
      {
        buyBoxId: localStorage.getItem("buyBoxId") || "", // TODO: make dynamic
        data: financialModel,
      },
      {
        onSuccess: () => {
          setIsLoading(false)
          onNext()
        },
        onError: (error) => {
          console.error("Error updating financial model:", error)
          setIsLoading(false)
          alert("Error updating financial model. Please try again.")
        },
      }
    )
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">
          Financial Modeling & Valuation
        </CardTitle>
        <CardDescription>
          Define the financial structure, expected returns, and risk profile for
          your Buy Box
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs className="w-full" defaultValue="structure">
          <TabsList className="mb-6 grid w-full grid-cols-4">
            <TabsTrigger value="structure">Financial Structure</TabsTrigger>
            <TabsTrigger value="returns">Expected Returns</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
            <TabsTrigger value="pricing">Pricing & Fees</TabsTrigger>
          </TabsList>

          {/* Financial Structure Tab */}
          <TabsContent className="space-y-6" value="structure">
            {/* Total Property Value */}
            <div className="rounded-md border border-border bg-muted/20 p-4">
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium">
                    Total Properties Value
                  </h3>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(calculateTotalPropertyValue())}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Based on {wizardData.selectedProperties?.length || 0}{" "}
                    selected properties
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium">
                    Buy Box Investment Value
                  </h3>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(
                      financialModel.pricing.totalInvestmentPrice
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {(
                      (financialModel.pricing.totalInvestmentPrice /
                        calculateTotalPropertyValue()) *
                      100
                    ).toFixed(1)}
                    % of property value
                  </p>
                </div>
              </div>
            </div>

            {/* Bouquet-Annuity Structure */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Bouquet-Annuity Structure</h3>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>
                      Bouquet: {financialModel.pricing.bouquetPercentage}%
                    </Label>
                    <Label>
                      Annuity: {financialModel.pricing.annuityPercentage}%
                    </Label>
                  </div>
                  <Slider
                    max={90}
                    min={10}
                    step={5}
                    value={[financialModel.pricing.bouquetPercentage]}
                    onValueChange={(values) => handleRatioChange(values[0])}
                  />
                  <div className="grid gap-4 pt-4 sm:grid-cols-2">
                    <div className="rounded-md border border-border p-3">
                      <div className="text-sm font-medium">Total Bouquet</div>
                      <div className="text-xl font-bold text-primary">
                        {formatCurrency(financialModel.totalBouquet)}
                      </div>
                    </div>

                    <div className="rounded-md border border-border p-3">
                      <div className="text-sm font-medium">Monthly Annuity</div>
                      <div className="text-xl font-bold text-primary">
                        {formatCurrency(financialModel.totalMonthlyAnnuity)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>
                    Guaranteed Term (Years):{" "}
                    {financialModel.guaranteedTerms.minYears}
                  </Label>
                  <Slider
                    max={30}
                    min={5}
                    step={1}
                    value={[financialModel.guaranteedTerms.minYears]}
                    onValueChange={(values) => handleTermChange(values[0])}
                  />
                  <p className="text-sm text-muted-foreground">
                    The minimum guaranteed payment period regardless of
                    longevity outcomes
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="term-details">Guaranteed Term Details</Label>
                  <Textarea
                    id="term-details"
                    placeholder="Provide details about the guaranteed term structure..."
                    value={financialModel.guaranteedTerms.details || ""}
                    onChange={(e) =>
                      setFinancialModel((prev) => ({
                        ...prev,
                        guaranteedTerms: {
                          ...prev.guaranteedTerms,
                          details: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Expected Returns Tab */}
          <TabsContent className="space-y-6" value="returns">
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="conservative-yield">
                  Conservative Yield (%)
                </Label>
                <Input
                  id="conservative-yield"
                  max={20}
                  min={0}
                  step={0.1}
                  type="number"
                  value={financialModel.expectedReturns.conservativeYield}
                  onChange={(e) =>
                    handleYieldChange("conservativeYield", e.target.value)
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Lower bound estimate
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target-yield">Target Yield (%)</Label>
                <Input
                  id="target-yield"
                  max={20}
                  min={0}
                  step={0.1}
                  type="number"
                  value={financialModel.expectedReturns.targetYield}
                  onChange={(e) =>
                    handleYieldChange("targetYield", e.target.value)
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Expected average return
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="optimistic-yield">Optimistic Yield (%)</Label>
                <Input
                  id="optimistic-yield"
                  max={20}
                  min={0}
                  step={0.1}
                  type="number"
                  value={financialModel.expectedReturns.optimisticYield}
                  onChange={(e) =>
                    handleYieldChange("optimisticYield", e.target.value)
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Upper bound estimate
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Cash Flow Projections</h3>
              <div className="max-h-[300px] overflow-y-auto rounded-md border border-border">
                <table className="w-full">
                  <thead className="sticky top-0 border-b border-border bg-muted">
                    <tr>
                      <th className="p-2 text-left">Year</th>
                      <th className="p-2 text-right">Expected Cash Flow</th>
                      <th className="p-2 text-right">Cumulative</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financialModel.cashFlowProjections?.map(
                      (projection, index) => {
                        const cumulativeCashFlow =
                          financialModel.cashFlowProjections
                            ?.slice(0, index + 1)
                            .reduce((sum, p) => sum + p.expectedCashFlow, 0) ||
                          0

                        return (
                          <tr key={index} className="border-b border-border">
                            <td className="p-2">{projection.year}</td>
                            <td className="p-2 text-right">
                              {formatCurrency(projection.expectedCashFlow)}
                            </td>
                            <td className="p-2 text-right">
                              {formatCurrency(cumulativeCashFlow)}
                            </td>
                          </tr>
                        )
                      }
                    )}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground">
                Cash flow projections are based on the selected guaranteed term
                and annuity structure
              </p>
            </div>
          </TabsContent>

          {/* Risk Analysis Tab */}
          <TabsContent className="space-y-6" value="risk">
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="longevity-risk">Longevity Risk</Label>
                <Select
                  value={financialModel.riskAnalysis.longevityRisk}
                  onValueChange={(value) =>
                    handleRiskChange(
                      "longevityRisk",
                      value as "low" | "medium" | "high"
                    )
                  }
                >
                  <SelectTrigger id="longevity-risk">
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Risk of sellers living longer than expected
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="market-risk">Market Risk</Label>
                <Select
                  value={financialModel.riskAnalysis.marketRisk}
                  onValueChange={(value) =>
                    handleRiskChange(
                      "marketRisk",
                      value as "low" | "medium" | "high"
                    )
                  }
                >
                  <SelectTrigger id="market-risk">
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Risk of property market fluctuations
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-risk">Default Risk</Label>
                <Select
                  value={financialModel.riskAnalysis.defaultRisk}
                  onValueChange={(value) =>
                    handleRiskChange(
                      "defaultRisk",
                      value as "low" | "medium" | "high"
                    )
                  }
                >
                  <SelectTrigger id="default-risk">
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Risk of contractual default
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="risk-notes">Risk Assessment Notes</Label>
              <Textarea
                className="min-h-[100px]"
                id="risk-notes"
                placeholder="Provide detailed risk assessment notes..."
                value={financialModel.riskAnalysis.notes || ""}
                onChange={(e) =>
                  setFinancialModel((prev) => ({
                    ...prev,
                    riskAnalysis: {
                      ...prev.riskAnalysis,
                      notes: e.target.value,
                    },
                  }))
                }
              />
            </div>

            <div className="rounded-md border border-border bg-muted/20 p-4">
              <h3 className="mb-2 text-lg font-medium">
                Risk Mitigation Measures
              </h3>
              <ul className="list-disc space-y-1 pl-5">
                <li>Guaranteed term structure to limit longevity exposure</li>
                <li>Diversified property portfolio to mitigate market risk</li>
                <li>Thorough legal due diligence to reduce default risk</li>
                <li>Conservative property valuation approach</li>
                <li>Annual portfolio reviews and rebalancing</li>
              </ul>
            </div>
          </TabsContent>

          {/* Pricing & Fees Tab */}
          <TabsContent className="space-y-6" value="pricing">
            <div className="space-y-2">
              <Label htmlFor="total-price">Total Investment Price (£)</Label>
              <Input
                id="total-price"
                min={0}
                step={10000}
                type="number"
                value={financialModel.pricing.totalInvestmentPrice}
                onChange={(e) =>
                  handlePricingChange("totalInvestmentPrice", e.target.value)
                }
              />
              <p className="text-sm text-muted-foreground">
                The full investment price for this Buy Box
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="management-fees">
                  Annual Management Fees (£)
                </Label>
                <Input
                  id="management-fees"
                  min={0}
                  step={1000}
                  type="number"
                  value={financialModel.pricing.managementFees}
                  onChange={(e) =>
                    handlePricingChange("managementFees", e.target.value)
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Annual fees for managing the Buy Box
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="other-fees">Other Fees (£)</Label>
                <Input
                  id="other-fees"
                  min={0}
                  step={1000}
                  type="number"
                  value={financialModel.pricing.otherFees || 0}
                  onChange={(e) =>
                    handlePricingChange("otherFees", e.target.value)
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Additional fees such as setup, legal, or transaction costs
                </p>
              </div>
            </div>

            <div className="rounded-md border border-border bg-muted/20 p-4">
              <h3 className="mb-2 text-lg font-medium">Investment Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between border-b border-border pb-2">
                  <span>Total Property Value:</span>
                  <span className="font-medium">
                    {formatCurrency(calculateTotalPropertyValue())}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span>Buy Box Investment Price:</span>
                  <span className="font-medium">
                    {formatCurrency(
                      financialModel.pricing.totalInvestmentPrice
                    )}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span>Bouquet Component:</span>
                  <span className="font-medium">
                    {formatCurrency(financialModel.totalBouquet)}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span>Annual Annuity Payments:</span>
                  <span className="font-medium">
                    {formatCurrency(financialModel.totalMonthlyAnnuity * 12)}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span>Total Guaranteed Payments:</span>
                  <span className="font-medium">
                    {formatCurrency(
                      financialModel.totalMonthlyAnnuity *
                        12 *
                        financialModel.guaranteedTerms.minYears
                    )}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span>Target Annual Yield:</span>
                  <span className="font-medium">
                    {financialModel.expectedReturns.targetYield}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Annual Management Fee:</span>
                  <span className="font-medium">
                    {formatCurrency(financialModel.pricing.managementFees)}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Property Selection
        </Button>
        <Button
          className="w-[300px]"
          disabled={isLoading}
          onClick={handleContinue}
        >
          {isLoading ? "Saving..." : "Continue to Compliance & Legal"}
        </Button>
      </CardFooter>
    </Card>
  )
}
