/*eslint-disable react/jsx-max-depth */
/*eslint-disable @typescript-eslint/no-explicit-any */
/*eslint-disable max-lines */
/*eslint-disable @typescript-eslint/no-unnecessary-condition */

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@package/ui/table"
import { Textarea } from "@package/ui/textarea"
import { useToast } from "@package/ui/toast"

import type { BaseStepProps } from "../StepProps"
import type { BuyBoxAllocationAndInvestment } from "../types"

import { api } from "@/lib/trpc/react"

// This is a fallback in case the API hasn't loaded yet or fails
const MOCK_AVAILABLE_BUYBOXES = [
  {
    id: "bb-001",
    name: "London Luxury Residences",
    description:
      "Prime luxury properties in Central London with stable rental history",
    propertyCount: 12,
    totalValue: 24500000,
    expectedYield: 5.7,
    riskRating: "moderate",
    sellerDemographics: "75+ age group",
    location: "Central London",
  },
  {
    id: "bb-002",
    name: "Southeast Heritage Portfolio",
    description: "Historic properties in affluent Southeast England towns",
    propertyCount: 18,
    totalValue: 16800000,
    expectedYield: 6.2,
    riskRating: "low",
    sellerDemographics: "70+ age group",
    location: "Southeast England",
  },
  {
    id: "bb-003",
    name: "Urban Mixed-Use Collection",
    description:
      "Diversified urban properties with mixed residential and commercial usage",
    propertyCount: 8,
    totalValue: 18200000,
    expectedYield: 7.1,
    riskRating: "moderate",
    sellerDemographics: "68+ age group",
    location: "Manchester & Birmingham",
  },
  {
    id: "bb-004",
    name: "Premium Retirement Living",
    description:
      "Purpose-built retirement properties in desirable coastal locations",
    propertyCount: 22,
    totalValue: 20300000,
    expectedYield: 5.9,
    riskRating: "low",
    sellerDemographics: "75+ age group",
    location: "Coastal South England",
  },
]

export function BuyBoxAllocationAndInvestmentCommencementStep({
  wizardData,
  updateWizardData,
  onNext,
  onBack,
  setGuideMessage,
}: BaseStepProps) {
  // Set the guide message for this step
  useEffect(() => {
    setGuideMessage(
      "Select the Buy Boxes that meet your investment criteria. Each Buy Box contains a collection of properties that have been carefully curated based on location, seller demographics, and expected returns. You can perform additional due diligence on each Buy Box before making your final commitment."
    )
  }, [setGuideMessage])

  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [availableBuyBoxes, setAvailableBuyBoxes] = useState(
    MOCK_AVAILABLE_BUYBOXES
  )

  // Query to get available buy boxes
  const buyBoxesQuery = api.buyer.getAvailableBuyBoxes.useQuery({
    page: 1,
    limit: 10,
    filterByPreferences: true,
  })

  // Handle buy boxes data changes
  useEffect(() => {
    if (
      buyBoxesQuery.data &&
      buyBoxesQuery.data.buyBoxes &&
      buyBoxesQuery.data.buyBoxes.length > 0
    ) {
      // Transform API data to match expected format
      const formattedBuyBoxes = buyBoxesQuery.data.buyBoxes.map((box) => ({
        id: box.id,
        name: box.name,
        description: box.description,
        propertyCount: box.propertyCount || 0,
        totalValue: box.financialHighlights?.estimatedValue || 0,
        expectedYield: box.financialHighlights?.targetReturn || 0,
        riskRating: box.financialHighlights?.riskRating || "moderate",
        sellerDemographics: "75+ age group", // Default value
        location: box.location?.city || box.location?.region || "Unknown",
      }))

      setAvailableBuyBoxes(formattedBuyBoxes)
    }
  }, [buyBoxesQuery.data])

  // Handle buy boxes query error
  useEffect(() => {
    if (buyBoxesQuery.error) {
      console.error("Error fetching buy boxes:", buyBoxesQuery.error)
      toast({
        title: "Error loading Buy Boxes",
        description:
          "Could not load available Buy Boxes. Using example data instead.",
        variant: "destructive",
      })
    }
  }, [buyBoxesQuery.error, toast])

  // Query to get existing data for this step
  const stepDataQuery = api.buyer.getStepData.useQuery({
    step: "buyBoxAllocation",
  })

  // Handle step data changes
  useEffect(() => {
    const stepData = stepDataQuery.data as
      | BuyBoxAllocationAndInvestment
      | null
      | undefined
    if (stepData && !wizardData.buyBoxAllocation) {
      updateWizardData({ buyBoxAllocation: stepData })
    }
  }, [stepDataQuery.data, updateWizardData, wizardData.buyBoxAllocation])

  // Mutation to save data
  const saveBuyBoxAllocation = api.buyer.submitBuyBoxAllocation.useMutation({
    onSuccess: () => {
      toast({
        title: "Buy Box allocation saved",
        description:
          "Your Buy Box selections and investment preferences have been saved.",
      })
      onNext()
    },
    onError: (error: any) => {
      toast({
        title: "Error saving data",
        description:
          error.message ||
          "Could not save Buy Box allocation data. Please try again.",
        variant: "destructive",
      })
    },
  })

  // Initialize local state with existing data or defaults
  const [allocationData, setAllocationData] =
    useState<BuyBoxAllocationAndInvestment>(
      () =>
        wizardData.buyBoxAllocation || {
          presentedBuyBoxes: availableBuyBoxes.map((buyBox) => ({
            id: buyBox.id,
            name: buyBox.name,
            presentationDate: new Date().toISOString().split("T")[0],
            investorInterest: "none",
            followUpRequired: false,
          })),
          selectedBuyBoxes: [],
          dueDiligenceRequests: {
            legalReviewRequested: false,
            financialAnalysisRequested: false,
            riskAssessmentRequested: false,
            additionalInformationRequested: false,
            additionalRequests: "",
          },
          investmentCommitment: {
            agreementsSigned: false,
            capitalCommitted: 0,
            fundingScheduleAgreed: false,
            initialFundingDate: "",
          },
          allocationNotes: "",
        }
    )

  // Update allocation data when available buy boxes change
  useEffect(() => {
    if (
      availableBuyBoxes &&
      availableBuyBoxes.length > 0 &&
      !wizardData.buyBoxAllocation
    ) {
      setAllocationData((prevData) => ({
        ...prevData,
        presentedBuyBoxes: availableBuyBoxes.map((buyBox) => {
          const existing = prevData.presentedBuyBoxes.find(
            (pb) => pb.id === buyBox.id
          )
          return (
            existing || {
              id: buyBox.id,
              name: buyBox.name,
              presentationDate: new Date().toISOString().split("T")[0],
              investorInterest: "none",
              followUpRequired: false,
            }
          )
        }),
      }))
    }
  }, [availableBuyBoxes, wizardData.buyBoxAllocation])

  // Format date for input fields
  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toISOString().split("T")[0]
  }

  // Get date for n days in the future
  const getDateInDays = (days: number): string => {
    const date = new Date()
    date.setDate(date.getDate() + days)
    return date.toISOString().split("T")[0]
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Handle interest level change for a Buy Box
  const handleInterestChange = (
    buyBoxId: string,
    interestLevel: "none" | "low" | "medium" | "high"
  ) => {
    setAllocationData((prev) => {
      const updatedBuyBoxes = prev.presentedBuyBoxes.map((buyBox) => {
        if (buyBox.id === buyBoxId) {
          return {
            ...buyBox,
            investorInterest: interestLevel,
          }
        }
        return buyBox
      })
      return {
        ...prev,
        presentedBuyBoxes: updatedBuyBoxes,
      }
    })
  }

  // Handle follow-up toggle for a Buy Box
  const handleFollowUpToggle = (
    buyBoxId: string,
    requiresFollowUp: boolean
  ) => {
    setAllocationData((prev) => {
      const updatedBuyBoxes = prev.presentedBuyBoxes.map((buyBox) => {
        if (buyBox.id === buyBoxId) {
          return {
            ...buyBox,
            followUpRequired: requiresFollowUp,
          }
        }
        return buyBox
      })
      return {
        ...prev,
        presentedBuyBoxes: updatedBuyBoxes,
      }
    })
  }

  // Handle selection of a Buy Box
  const handleBuyBoxSelection = (buyBoxId: string, buyBoxName: string) => {
    // Check if Buy Box is already selected
    const isAlreadySelected = allocationData.selectedBuyBoxes.some(
      (bb) => bb.id === buyBoxId
    )

    if (isAlreadySelected) {
      // Remove from selection
      setAllocationData((prev) => ({
        ...prev,
        selectedBuyBoxes: prev.selectedBuyBoxes.filter(
          (bb) => bb.id !== buyBoxId
        ),
      }))
    } else {
      // Add to selection with default values
      const buyBox = availableBuyBoxes.find((bb) => bb.id === buyBoxId)
      const suggestedAllocation = buyBox
        ? Math.min(
            buyBox.totalValue * 0.2, // Suggest 20% of total value as default
            wizardData.investorProfile?.allocationStrategy
              .maximumBuyBoxAllocation || 5000000
          )
        : 1000000

      setAllocationData((prev) => ({
        ...prev,
        selectedBuyBoxes: [
          ...prev.selectedBuyBoxes,
          {
            id: buyBoxId,
            name: buyBoxName,
            allocationAmount: Math.round(suggestedAllocation),
            selectionDate: new Date().toISOString().split("T")[0],
            dueDiligenceStatus: "pending",
          },
        ],
      }))
    }
  }

  // Handle allocation amount change
  const handleAllocationChange = (buyBoxId: string, amount: number) => {
    setAllocationData((prev) => ({
      ...prev,
      selectedBuyBoxes: prev.selectedBuyBoxes.map((buyBox) => {
        if (buyBox.id === buyBoxId) {
          return {
            ...buyBox,
            allocationAmount: amount,
          }
        }
        return buyBox
      }),
    }))
  }

  // Handle due diligence status change
  const handleDueDiligenceStatusChange = (
    buyBoxId: string,
    status: "pending" | "in_progress" | "completed"
  ) => {
    setAllocationData((prev) => ({
      ...prev,
      selectedBuyBoxes: prev.selectedBuyBoxes.map((buyBox) => {
        if (buyBox.id === buyBoxId) {
          return {
            ...buyBox,
            dueDiligenceStatus: status,
          }
        }
        return buyBox
      }),
    }))
  }

  // Handle due diligence request changes
  const handleDueDiligenceRequestChange = (
    field: string,
    value: boolean | string
  ) => {
    setAllocationData((prev) => ({
      ...prev,
      dueDiligenceRequests: {
        ...prev.dueDiligenceRequests,
        [field]: value,
      },
    }))
  }

  // Handle investment commitment changes
  const handleInvestmentCommitmentChange = (field: string, value: any) => {
    setAllocationData((prev) => ({
      ...prev,
      investmentCommitment: {
        ...prev.investmentCommitment,
        [field]: value,
      },
    }))
  }

  // Calculate total allocated amount
  const calculateTotalAllocation = (): number => {
    return allocationData.selectedBuyBoxes.reduce(
      (sum, buyBox) => sum + buyBox.allocationAmount,
      0
    )
  }

  // Modified handleContinue to use the API mutation
  const handleContinue = () => {
    // Validation
    if (allocationData.selectedBuyBoxes.length === 0) {
      toast({
        title: "Selection required",
        description: "Please select at least one Buy Box for investment",
        variant: "destructive",
      })
      return
    }

    if (calculateTotalAllocation() <= 0) {
      toast({
        title: "Allocation required",
        description: "Please allocate funds to your selected Buy Boxes",
        variant: "destructive",
      })
      return
    }

    if (
      allocationData.investmentCommitment.agreementsSigned &&
      !allocationData.investmentCommitment.initialFundingDate
    ) {
      toast({
        title: "Date required",
        description: "Please provide an initial funding date",
        variant: "destructive",
      })
      return
    }

    // Save data locally in the wizard
    updateWizardData({ buyBoxAllocation: allocationData })

    // Convert the data to the format expected by the API
    const apiData = {
      selectedBuyBoxIds: allocationData.selectedBuyBoxes.map((bb) => bb.id),
      investmentAmountPerBuyBox: allocationData.selectedBuyBoxes.reduce(
        (acc, bb) => {
          acc[bb.id] = bb.allocationAmount
          return acc
        },
        {} as Record<string, number>
      ),
      totalAllocation: calculateTotalAllocation(),
      allocationStrategy: "custom" as const,
      hasDiversificationRequirements: false,
      allocationNotes: allocationData.allocationNotes,
      dueDiligenceRequests: allocationData.dueDiligenceRequests,
      investmentCommitment: allocationData.investmentCommitment,
    }

    // Save data via API
    setIsLoading(true)
    saveBuyBoxAllocation.mutate(apiData, {
      onSettled: () => setIsLoading(false),
    })
  }

  // Get Buy Box details by ID
  const getBuyBoxDetails = (buyBoxId: string) => {
    return availableBuyBoxes.find((bb) => bb.id === buyBoxId)
  }

  // Get risk badge color
  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
      case "moderate":
        return "bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400"
      case "high":
        return "bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">
          Buy Box Allocation & Investment Commencement
        </CardTitle>
        <CardDescription>
          Select Buy Boxes, conduct due diligence, and make investment
          commitments
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Available Buy Boxes */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Available Buy Boxes</h3>
          <p className="text-sm text-muted-foreground">
            Review available Buy Boxes that match your investment criteria
          </p>

          {buyBoxesQuery.isLoading ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                Loading available Buy Boxes...
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border border-border">
              <Table>
                <TableHeader className="bg-muted/20">
                  <TableRow>
                    <TableHead className="w-[50px]">Select</TableHead>
                    <TableHead>Buy Box</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Properties</TableHead>
                    <TableHead className="text-right">Total Value</TableHead>
                    <TableHead className="text-right">Yield (%)</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead>Interest Level</TableHead>
                    <TableHead className="w-[80px]">Follow-Up</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableBuyBoxes.map((buyBox) => {
                    const presentedBuyBox =
                      allocationData.presentedBuyBoxes.find(
                        (bb) => bb.id === buyBox.id
                      )
                    const isSelected = allocationData.selectedBuyBoxes.some(
                      (bb) => bb.id === buyBox.id
                    )

                    return (
                      <TableRow
                        key={buyBox.id}
                        className={isSelected ? "bg-primary/5" : ""}
                      >
                        <TableCell>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() =>
                              handleBuyBoxSelection(buyBox.id, buyBox.name)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{buyBox.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {buyBox.description.substring(0, 60)}...
                          </div>
                        </TableCell>
                        <TableCell>{buyBox.location}</TableCell>
                        <TableCell className="text-right">
                          {buyBox.propertyCount}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(buyBox.totalValue)}
                        </TableCell>
                        <TableCell className="text-right">
                          {buyBox.expectedYield.toFixed(1)}%
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getRiskBadgeColor(buyBox.riskRating)}
                          >
                            {buyBox.riskRating.charAt(0).toUpperCase() +
                              buyBox.riskRating.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={presentedBuyBox?.investorInterest || "none"}
                            onValueChange={(value) =>
                              handleInterestChange(
                                buyBox.id,
                                value as "none" | "low" | "medium" | "high"
                              )
                            }
                          >
                            <SelectTrigger className="h-8 w-[100px]">
                              <SelectValue placeholder="Interest" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={presentedBuyBox?.followUpRequired || false}
                            onCheckedChange={(checked) =>
                              handleFollowUpToggle(buyBox.id, checked === true)
                            }
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Selected Buy Boxes */}
        {allocationData.selectedBuyBoxes.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Selected Buy Boxes</h3>
            <p className="text-sm text-muted-foreground">
              Allocate investment amounts to your selected Buy Boxes
            </p>

            <div className="rounded-md border border-border p-4">
              <div className="space-y-4">
                {allocationData.selectedBuyBoxes.map((selectedBuyBox) => {
                  const buyBoxDetails = getBuyBoxDetails(selectedBuyBox.id)

                  return (
                    <div
                      key={selectedBuyBox.id}
                      className="rounded-md border border-border bg-muted/10 p-3"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="font-medium">{selectedBuyBox.name}</h4>
                        <Badge
                          className={getRiskBadgeColor(
                            buyBoxDetails?.riskRating || ""
                          )}
                        >
                          {buyBoxDetails?.riskRating.charAt(0).toUpperCase() +
                            (buyBoxDetails?.riskRating.slice(1) || "")}
                        </Badge>
                      </div>

                      <div className="mb-3 grid gap-4 md:grid-cols-3">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Total Value
                          </p>
                          <p className="font-medium">
                            {formatCurrency(buyBoxDetails?.totalValue || 0)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Expected Yield
                          </p>
                          <p className="font-medium">
                            {buyBoxDetails?.expectedYield.toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Properties
                          </p>
                          <p className="font-medium">
                            {buyBoxDetails?.propertyCount}
                          </p>
                        </div>
                      </div>

                      <div className="mb-3 grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor={`allocation-${selectedBuyBox.id}`}>
                            Allocation Amount (£)
                          </Label>
                          <Input
                            id={`allocation-${selectedBuyBox.id}`}
                            min={100000}
                            step={100000}
                            type="number"
                            value={selectedBuyBox.allocationAmount}
                            onChange={(e) =>
                              handleAllocationChange(
                                selectedBuyBox.id,
                                parseInt(e.target.value)
                              )
                            }
                          />
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(selectedBuyBox.allocationAmount)}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`due-diligence-${selectedBuyBox.id}`}>
                            Due Diligence Status
                          </Label>
                          <Select
                            value={selectedBuyBox.dueDiligenceStatus}
                            onValueChange={(value) =>
                              handleDueDiligenceStatusChange(
                                selectedBuyBox.id,
                                value as "pending" | "in_progress" | "completed"
                              )
                            }
                          >
                            <SelectTrigger
                              id={`due-diligence-${selectedBuyBox.id}`}
                            >
                              <SelectValue placeholder="Due Diligence Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in_progress">
                                In Progress
                              </SelectItem>
                              <SelectItem value="completed">
                                Completed
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )
                })}

                <div className="mt-4 rounded-md bg-muted/20 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total Allocation:</span>
                    <span className="text-lg font-semibold">
                      {formatCurrency(calculateTotalAllocation())}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Due Diligence Requests */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Due Diligence Requests</h3>

          <div className="rounded-md border border-border p-4">
            <div className="mb-4 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="legal-review"
                  checked={
                    allocationData.dueDiligenceRequests.legalReviewRequested
                  }
                  onCheckedChange={(checked) =>
                    handleDueDiligenceRequestChange(
                      "legalReviewRequested",
                      checked === true
                    )
                  }
                />
                <Label htmlFor="legal-review">Legal Review Requested</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="financial-analysis"
                  checked={
                    allocationData.dueDiligenceRequests
                      .financialAnalysisRequested
                  }
                  onCheckedChange={(checked) =>
                    handleDueDiligenceRequestChange(
                      "financialAnalysisRequested",
                      checked === true
                    )
                  }
                />
                <Label htmlFor="financial-analysis">
                  Financial Analysis Requested
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="risk-assessment"
                  checked={
                    allocationData.dueDiligenceRequests.riskAssessmentRequested
                  }
                  onCheckedChange={(checked) =>
                    handleDueDiligenceRequestChange(
                      "riskAssessmentRequested",
                      checked === true
                    )
                  }
                />
                <Label htmlFor="risk-assessment">
                  Risk Assessment Requested
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="additional-info"
                  checked={
                    allocationData.dueDiligenceRequests
                      .additionalInformationRequested
                  }
                  onCheckedChange={(checked) =>
                    handleDueDiligenceRequestChange(
                      "additionalInformationRequested",
                      checked === true
                    )
                  }
                />
                <Label htmlFor="additional-info">
                  Additional Information Requested
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additional-requests">
                Additional Due Diligence Requests
              </Label>
              <Textarea
                className="min-h-[80px]"
                id="additional-requests"
                placeholder="Specify any additional due diligence requests or information needed..."
                value={
                  allocationData.dueDiligenceRequests.additionalRequests || ""
                }
                onChange={(e) =>
                  handleDueDiligenceRequestChange(
                    "additionalRequests",
                    e.target.value
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* Investment Commitment */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Investment Commitment</h3>

          <div className="rounded-md border border-border p-4">
            <div className="mb-4 flex items-center space-x-2">
              <Checkbox
                checked={allocationData.investmentCommitment.agreementsSigned}
                id="agreements-signed"
                onCheckedChange={(checked) =>
                  handleInvestmentCommitmentChange(
                    "agreementsSigned",
                    checked === true
                  )
                }
              />
              <Label className="font-medium" htmlFor="agreements-signed">
                Investment Agreements Signed
              </Label>
            </div>

            {allocationData.investmentCommitment.agreementsSigned && (
              <div className="mb-4 space-y-2">
                <Label htmlFor="signature-date">Signature Date</Label>
                <Input
                  id="signature-date"
                  type="date"
                  value={
                    formatDateForInput(
                      allocationData.investmentCommitment.signatureDate
                    ) || formatDateForInput()
                  }
                  onChange={(e) =>
                    handleInvestmentCommitmentChange(
                      "signatureDate",
                      e.target.value
                    )
                  }
                />
              </div>
            )}

            <div className="mb-4 space-y-2">
              <Label htmlFor="capital-committed">
                Total Capital Committed (£)
              </Label>
              <Input
                id="capital-committed"
                min={0}
                step={100000}
                type="number"
                value={allocationData.investmentCommitment.capitalCommitted}
                onChange={(e) =>
                  handleInvestmentCommitmentChange(
                    "capitalCommitted",
                    parseInt(e.target.value)
                  )
                }
              />
              <p className="text-sm text-muted-foreground">
                {formatCurrency(
                  allocationData.investmentCommitment.capitalCommitted
                )}
              </p>
            </div>

            <div className="mb-4 flex items-center space-x-2">
              <Checkbox
                id="funding-schedule"
                checked={
                  allocationData.investmentCommitment.fundingScheduleAgreed
                }
                onCheckedChange={(checked) =>
                  handleInvestmentCommitmentChange(
                    "fundingScheduleAgreed",
                    checked === true
                  )
                }
              />
              <Label className="font-medium" htmlFor="funding-schedule">
                Funding Schedule Agreed
              </Label>
            </div>

            {allocationData.investmentCommitment.fundingScheduleAgreed && (
              <div className="space-y-2">
                <Label htmlFor="initial-funding-date">
                  Initial Funding Date
                </Label>
                <Input
                  id="initial-funding-date"
                  type="date"
                  value={
                    formatDateForInput(
                      allocationData.investmentCommitment.initialFundingDate
                    ) || getDateInDays(14)
                  }
                  onChange={(e) =>
                    handleInvestmentCommitmentChange(
                      "initialFundingDate",
                      e.target.value
                    )
                  }
                />
              </div>
            )}
          </div>
        </div>

        {/* Additional Notes */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Additional Notes</h3>

          <div className="space-y-2">
            <Label htmlFor="allocation-notes">
              Additional Buy Box Allocation Notes
            </Label>
            <Textarea
              className="min-h-[100px]"
              id="allocation-notes"
              placeholder="Enter any additional notes about your Buy Box selections, allocation strategy, or investment considerations..."
              value={allocationData.allocationNotes || ""}
              onChange={(e) =>
                setAllocationData((prev) => ({
                  ...prev,
                  allocationNotes: e.target.value,
                }))
              }
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button disabled={isLoading} variant="outline" onClick={onBack}>
          Back to Platform Training
        </Button>
        <Button
          className="w-[300px]"
          disabled={isLoading}
          onClick={handleContinue}
        >
          {isLoading ? "Saving..." : "Continue to Transaction Execution"}
        </Button>
      </CardFooter>
    </Card>
  )
}
