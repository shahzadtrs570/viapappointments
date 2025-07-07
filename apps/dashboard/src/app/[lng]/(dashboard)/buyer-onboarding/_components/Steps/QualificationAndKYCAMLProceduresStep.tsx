/*eslint-disable react/jsx-max-depth */
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
import { Textarea } from "@package/ui/textarea"
import { useToast } from "@package/ui/toast"
import { Typography } from "@package/ui/typography"

import type { BaseStepProps } from "../StepProps"
import type {
  InstitutionalInvestorType,
  QualificationAndKYCAML,
} from "../types"

import { api } from "@/lib/trpc/react"

// API expected data format
interface QualificationKYCAMLApiData {
  investorType: "individual" | "entity"
  fullLegalName: string
  taxIdentificationNumber: string
  nationality: string
  residenceCountry: string
  isAccreditedInvestor: boolean
  sourceOfFunds: string
  hasCompletedKYC: boolean
  hasPoliticalExposure: boolean
  politicalExposureDetails?: string
}

export function QualificationAndKYCAMLProceduresStep({
  wizardData,
  updateWizardData,
  onNext,
  onBack,
  setGuideMessage,
}: BaseStepProps) {
  // Set the guide message for this step
  useEffect(() => {
    setGuideMessage(
      "Institutional investor verification and compliance is a critical step. We need to verify your regulatory status and complete Know Your Customer (KYC) and Anti-Money Laundering (AML) procedures. This ensures all investments are compliant with regulatory requirements."
    )
  }, [setGuideMessage])

  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Query to get existing data for this step
  const stepDataQuery = api.buyer.getStepData.useQuery({
    step: "qualificationKYCAML",
  }) as any // Type assertion to bypass TypeScript error

  // Handle successful data fetch
  useEffect(() => {
    if (stepDataQuery.data) {
      // Only set the data if we don't already have it in the wizard
      if (!wizardData.qualificationKYCAML) {
        const data = stepDataQuery.data as QualificationAndKYCAML
        updateWizardData({ qualificationKYCAML: data })
        setQualificationData(data)
      }
    }
  }, [stepDataQuery.data, updateWizardData, wizardData.qualificationKYCAML])

  // Handle query errors
  useEffect(() => {
    if (stepDataQuery.error) {
      console.error("Error fetching qualification data:", stepDataQuery.error)
      toast({
        title: "Error loading data",
        description: "Could not load your saved qualification information.",
        variant: "destructive",
      })
    }
  }, [stepDataQuery.error, toast])

  // Mutation to save data
  const saveQualificationKYCAML =
    api.buyer.submitQualificationKYCAML.useMutation({
      onSuccess: () => {
        toast({
          title: "Qualification data saved",
          description: "Your KYC/AML information has been saved.",
        })
        onNext()
      },
      onError: (error) => {
        toast({
          title: "Error saving data",
          description:
            error.message ||
            "Could not save qualification data. Please try again.",
          variant: "destructive",
        })
      },
    })

  // Initialize local state with existing data or defaults
  const [qualificationData, setQualificationData] =
    useState<QualificationAndKYCAML>(
      () =>
        wizardData.qualificationKYCAML || {
          investorType: "asset_manager",
          aum: 0,
          regulatoryStatus: {
            fcaRegulated: false,
            fcaReferenceNumber: "",
            otherRegulators: [],
          },
          kycDocuments: {
            corporateDocuments: false,
            articlesOfIncorporation: false,
            directorsShareholders: false,
            regulatoryLicenses: false,
          },
          amlChecks: {
            uboVerification: false,
            sanctionsScreening: false,
            sourceFundsVerified: false,
            enhancedDueDiligence: false,
            amlNotes: "",
          },
          qualificationStatus: "pending",
          complianceOfficerNotes: "",
        }
    )

  // Update local state when wizardData changes
  useEffect(() => {
    if (wizardData.qualificationKYCAML) {
      setQualificationData(wizardData.qualificationKYCAML)
    }
  }, [wizardData.qualificationKYCAML])

  // Handle form field changes for top-level fields
  const handleInputChange = (
    field: keyof QualificationAndKYCAML,
    value: string | number | boolean
  ) => {
    setQualificationData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle form field changes for regulatory status
  const handleRegulatoryChange = (field: string, value: boolean | string) => {
    setQualificationData((prev) => ({
      ...prev,
      regulatoryStatus: {
        ...prev.regulatoryStatus,
        [field]: value,
      },
    }))
  }

  // Handle form field changes for KYC documents
  const handleKYCChange = (field: string, value: boolean) => {
    setQualificationData((prev) => ({
      ...prev,
      kycDocuments: {
        ...prev.kycDocuments,
        [field]: value,
      },
    }))
  }

  // Handle form field changes for AML checks
  const handleAMLChange = (field: string, value: boolean | string) => {
    setQualificationData((prev) => ({
      ...prev,
      amlChecks: {
        ...prev.amlChecks,
        [field]: value,
      },
    }))
  }

  // Handle other regulators input
  const handleOtherRegulatorsInput = (value: string) => {
    const regulators = value
      .split(",")
      .map((reg) => reg.trim())
      .filter(Boolean)

    setQualificationData((prev) => ({
      ...prev,
      regulatoryStatus: {
        ...prev.regulatoryStatus,
        otherRegulators: regulators,
      },
    }))
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Handle form submission - updated to use API
  const handleContinue = () => {
    // Validation
    if (qualificationData.aum <= 0) {
      toast({
        title: "Missing information",
        description: "Please provide your assets under management (AUM)",
        variant: "destructive",
      })
      return
    }

    if (
      qualificationData.regulatoryStatus.fcaRegulated &&
      !qualificationData.regulatoryStatus.fcaReferenceNumber
    ) {
      toast({
        title: "Missing information",
        description: "Please provide your FCA reference number",
        variant: "destructive",
      })
      return
    }

    const kycComplete = Object.values(qualificationData.kycDocuments).some(
      (value) => value === true
    )
    if (!kycComplete) {
      toast({
        title: "Document required",
        description:
          "Please confirm at least one KYC document has been provided",
        variant: "destructive",
      })
      return
    }

    // Save data locally in the wizard
    updateWizardData({ qualificationKYCAML: qualificationData })

    // Create API data in the expected format
    const apiData: QualificationKYCAMLApiData = {
      investorType: "entity", // For institutional investors
      fullLegalName: "Company Legal Name", // This should come from organization data
      taxIdentificationNumber:
        qualificationData.regulatoryStatus.fcaReferenceNumber || "Not provided",
      nationality: "United Kingdom", // Default value
      residenceCountry: "United Kingdom", // Default value
      isAccreditedInvestor: true, // Institutional investors are typically accredited
      sourceOfFunds: qualificationData.amlChecks.sourceFundsVerified
        ? "Verified"
        : "Pending verification",
      hasCompletedKYC: kycComplete,
      hasPoliticalExposure: qualificationData.amlChecks.enhancedDueDiligence,
      politicalExposureDetails:
        qualificationData.amlChecks.amlNotes || undefined,
    }

    // Save data via API
    setIsLoading(true)
    saveQualificationKYCAML.mutate(apiData, {
      onSettled: () => setIsLoading(false),
    })
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">
          Qualification & KYC/AML Procedures
        </CardTitle>
        <CardDescription>
          Verify institutional status and complete compliance requirements
        </CardDescription>
        {stepDataQuery.isLoading && (
          <p className="text-sm text-muted-foreground">Loading your data...</p>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Investor Type */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Institutional Investor Type</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="investor-type">Investor Category</Label>
              <Select
                value={qualificationData.investorType}
                onValueChange={(value) =>
                  handleInputChange(
                    "investorType",
                    value as InstitutionalInvestorType
                  )
                }
              >
                <SelectTrigger id="investor-type">
                  <SelectValue placeholder="Select investor type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pension_fund">Pension Fund</SelectItem>
                  <SelectItem value="family_office">Family Office</SelectItem>
                  <SelectItem value="insurance_company">
                    Insurance Company
                  </SelectItem>
                  <SelectItem value="wealth_manager">Wealth Manager</SelectItem>
                  <SelectItem value="investment_bank">
                    Investment Bank
                  </SelectItem>
                  <SelectItem value="asset_manager">Asset Manager</SelectItem>
                  <SelectItem value="sovereign_wealth_fund">
                    Sovereign Wealth Fund
                  </SelectItem>
                  <SelectItem value="endowment">Endowment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="aum">Assets Under Management (£)</Label>
              <Input
                id="aum"
                min={0}
                step={1000000}
                type="number"
                value={qualificationData.aum}
                onChange={(e) =>
                  handleInputChange("aum", parseInt(e.target.value))
                }
              />
              {qualificationData.aum > 0 && (
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(qualificationData.aum)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Regulatory Status */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Regulatory Status</h3>

          <div className="rounded-md border border-border p-4">
            <div className="mb-4 flex items-center space-x-2">
              <Checkbox
                checked={qualificationData.regulatoryStatus.fcaRegulated}
                id="fca-regulated"
                onCheckedChange={(checked) =>
                  handleRegulatoryChange("fcaRegulated", checked === true)
                }
              />
              <Label className="font-medium" htmlFor="fca-regulated">
                FCA Regulated Entity
              </Label>
            </div>

            {qualificationData.regulatoryStatus.fcaRegulated && (
              <div className="mb-4 space-y-2">
                <Label htmlFor="fca-reference">FCA Reference Number</Label>
                <Input
                  id="fca-reference"
                  placeholder="e.g., 123456"
                  value={
                    qualificationData.regulatoryStatus.fcaReferenceNumber || ""
                  }
                  onChange={(e) =>
                    handleRegulatoryChange("fcaReferenceNumber", e.target.value)
                  }
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="other-regulators">
                Other Regulatory Bodies (comma-separated)
              </Label>
              <Input
                id="other-regulators"
                placeholder="e.g., SEC, FINRA, BaFIN"
                value={
                  qualificationData.regulatoryStatus.otherRegulators?.join(
                    ", "
                  ) || ""
                }
                onChange={(e) => handleOtherRegulatorsInput(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* KYC Documents */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">KYC Documentation</h3>
          <Typography className="text-sm text-muted-foreground">
            Please confirm which documents have been provided
          </Typography>

          <div className="rounded-md border border-border p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={qualificationData.kycDocuments.corporateDocuments}
                  id="corporate-documents"
                  onCheckedChange={(checked) =>
                    handleKYCChange("corporateDocuments", checked === true)
                  }
                />
                <Label htmlFor="corporate-documents">Corporate Documents</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="articles-incorporation"
                  checked={
                    qualificationData.kycDocuments.articlesOfIncorporation
                  }
                  onCheckedChange={(checked) =>
                    handleKYCChange("articlesOfIncorporation", checked === true)
                  }
                />
                <Label htmlFor="articles-incorporation">
                  Articles of Incorporation
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={qualificationData.kycDocuments.directorsShareholders}
                  id="directors-shareholders"
                  onCheckedChange={(checked) =>
                    handleKYCChange("directorsShareholders", checked === true)
                  }
                />
                <Label htmlFor="directors-shareholders">
                  Register of Directors/Shareholders
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={qualificationData.kycDocuments.regulatoryLicenses}
                  id="regulatory-licenses"
                  onCheckedChange={(checked) =>
                    handleKYCChange("regulatoryLicenses", checked === true)
                  }
                />
                <Label htmlFor="regulatory-licenses">Regulatory Licenses</Label>
              </div>
            </div>
          </div>
        </div>

        {/* AML Checks */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">AML Due Diligence</h3>
          <Typography className="text-sm text-muted-foreground">
            Anti-Money Laundering compliance checks
          </Typography>

          <div className="rounded-md border border-border p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={qualificationData.amlChecks.uboVerification}
                  id="ubo-verification"
                  onCheckedChange={(checked) =>
                    handleAMLChange("uboVerification", checked === true)
                  }
                />
                <Label htmlFor="ubo-verification">
                  Ultimate Beneficial Owners (UBO) Verification
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={qualificationData.amlChecks.sanctionsScreening}
                  id="sanctions-screening"
                  onCheckedChange={(checked) =>
                    handleAMLChange("sanctionsScreening", checked === true)
                  }
                />
                <Label htmlFor="sanctions-screening">
                  Sanctions Screening Completed
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={qualificationData.amlChecks.sourceFundsVerified}
                  id="source-funds"
                  onCheckedChange={(checked) =>
                    handleAMLChange("sourceFundsVerified", checked === true)
                  }
                />
                <Label htmlFor="source-funds">Source of Funds Verified</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={qualificationData.amlChecks.enhancedDueDiligence}
                  id="enhanced-due-diligence"
                  onCheckedChange={(checked) =>
                    handleAMLChange("enhancedDueDiligence", checked === true)
                  }
                />
                <Label htmlFor="enhanced-due-diligence">
                  Enhanced Due Diligence Required
                </Label>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label htmlFor="aml-notes">AML Notes</Label>
              <Textarea
                className="min-h-[80px]"
                id="aml-notes"
                placeholder="Additional information about AML procedures and requirements..."
                value={qualificationData.amlChecks.amlNotes || ""}
                onChange={(e) => handleAMLChange("amlNotes", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Compliance Officer Notes */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Compliance Notes</h3>

          <div className="space-y-2">
            <Label htmlFor="compliance-notes">
              Additional Compliance Information
            </Label>
            <Textarea
              className="min-h-[100px]"
              id="compliance-notes"
              placeholder="Any additional compliance information or special requirements..."
              value={qualificationData.complianceOfficerNotes || ""}
              onChange={(e) =>
                handleInputChange("complianceOfficerNotes", e.target.value)
              }
            />
          </div>
        </div>

        {/* Qualification Status Information */}
        <div className="rounded-md bg-muted/30 p-4">
          <h3 className="mb-2 text-lg font-medium">Qualification Status</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="qualification-status">Current Status</Label>
              <Select
                value={qualificationData.qualificationStatus}
                onValueChange={(value) =>
                  handleInputChange(
                    "qualificationStatus",
                    value as
                      | "pending"
                      | "in_progress"
                      | "qualified"
                      | "rejected"
                  )
                }
              >
                <SelectTrigger id="qualification-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button disabled={isLoading} variant="outline" onClick={onBack}>
          Back to Initial Inquiry
        </Button>
        <Button
          className="w-[300px]"
          disabled={isLoading}
          onClick={handleContinue}
        >
          {isLoading
            ? "Saving..."
            : "Continue to Due Diligence & Legal Compliance"}
        </Button>
      </CardFooter>
    </Card>
  )
}
