/*eslint-disable react/jsx-max-depth */
/*eslint-disable @typescript-eslint/no-unused-vars*/
/*eslint-disable max-lines */
/*eslint-disable  @typescript-eslint/no-explicit-any */
/*eslint-disable  import/order */
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@package/ui/tabs"
import { Textarea } from "@package/ui/textarea"
import { useToast } from "@package/ui/toast"

// Import SurveyJS
import "survey-core/defaultV2.min.css"
import { Model } from "survey-core"
import { Survey } from "survey-react-ui"

import { ddqaSurveyJson } from "./ddqa-survey-config"

import type { BaseStepProps } from "../StepProps"
import type { DueDiligenceAndLegal } from "../types"
import { api } from "@/lib/trpc/react"

// Extend the Model type to include missing properties for TypeScript
interface SurveyModel extends Model {
  onValueChanged: {
    add: (callback: (sender: any) => void) => void
    clear: () => void
  }
  onComplete: {
    add: (callback: (sender: any) => void) => void
    clear: () => void
  }
}

export function DueDiligenceAndLegalComplianceStep({
  wizardData,
  updateWizardData,
  onNext,
  onBack,
  setGuideMessage,
  fillDemoData,
}: BaseStepProps) {
  // Set the guide message for this step
  useEffect(() => {
    setGuideMessage(
      "Legal documentation and compliance are essential before engaging in property investments. We need to ensure all master agreements are signed and compliance checks are completed to protect both your interests and regulatory requirements."
    )
  }, [setGuideMessage])

  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Query to get existing data for this step
  const stepDataQuery = api.buyer.getStepData.useQuery({
    step: "dueDiligenceLegal",
  })

  // Handle successful data fetch
  useEffect(() => {
    const queryData = stepDataQuery.data as unknown
    if (queryData && !wizardData.dueDiligenceLegal) {
      // First cast to unknown, then to the expected type
      const apiData = queryData as DueDiligenceAndLegal

      // Verify the data has the expected structure before using it
      if (
        apiData &&
        typeof apiData === "object" &&
        "legalDocuments" in apiData &&
        "platformAgreements" in apiData
      ) {
        updateWizardData({ dueDiligenceLegal: apiData })
        setDueDiligenceData(apiData)
      }
    }
  }, [stepDataQuery.data, updateWizardData, wizardData.dueDiligenceLegal])

  // Handle query errors
  useEffect(() => {
    if (stepDataQuery.error) {
      console.error("Error fetching due diligence data:", stepDataQuery.error)
      toast({
        title: "Error loading data",
        description: "Could not load your saved due diligence information.",
        variant: "destructive",
      })
    }
  }, [stepDataQuery.error, toast])

  // Mutation to save data
  const saveDueDiligenceLegal = api.buyer.submitDueDiligenceLegal.useMutation({
    onSuccess: () => {
      toast({
        title: "Due diligence data saved",
        description: "Your legal compliance information has been saved.",
      })
      onNext()
    },
    onError: (error) => {
      toast({
        title: "Error saving data",
        description:
          error.message ||
          "Could not save due diligence data. Please try again.",
        variant: "destructive",
      })
    },
  })

  // Initialize local state with existing data or defaults
  const [dueDiligenceData, setDueDiligenceData] =
    useState<DueDiligenceAndLegal>(
      () =>
        wizardData.dueDiligenceLegal || {
          legalDocuments: {
            ddqCompleted: false,
            legalReviewCompleted: false,
            complianceChecksCompleted: false,
            outstandingIssues: [],
          },
          platformAgreements: {
            masterInvestmentAgreementSigned: false,
            confidentialityAgreementSigned: false,
            ndaSigned: false,
          },
          liabilityFramework: {
            rolesResponsibilitiesAcknowledged: false,
            limitationsAcknowledged: false,
            disputeResolutionAcknowledged: false,
          },
          dueDiligenceNotes: "",
        }
    )

  // State for SurveyJS
  const [surveyModel] = useState<SurveyModel>(
    () => new Model(ddqaSurveyJson) as SurveyModel
  )
  const [surveyResult, setSurveyResult] = useState<Record<string, any>>({})
  const [selectedTab, setSelectedTab] = useState("simple-form")
  const [hasSurveyBeenStarted, setHasSurveyBeenStarted] = useState(false)

  // Initialize SurveyJS event handlers
  useEffect(() => {
    // Handle survey completion
    surveyModel.onComplete.add((sender) => {
      const results = sender.data
      setSurveyResult(results)
      // Update the regular form when survey is completed
      setDueDiligenceData((prev) => ({
        ...prev,
        legalDocuments: {
          ...prev.legalDocuments,
          ddqCompleted: true,
          ddqSubmissionDate: new Date().toISOString().split("T")[0],
        },
      }))
    })

    // Handle any value change to mark survey as started
    surveyModel.onValueChanged.add(() => {
      setHasSurveyBeenStarted(true)
    })

    return () => {
      surveyModel.onComplete.clear()
      surveyModel.onValueChanged.clear()
    }
  }, [surveyModel])

  // Update local state when wizardData changes
  useEffect(() => {
    if (wizardData.dueDiligenceLegal) {
      setDueDiligenceData(wizardData.dueDiligenceLegal)
    }
  }, [wizardData.dueDiligenceLegal])

  // Format date for input fields
  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toISOString().split("T")[0]
  }

  // Handle legal documents changes
  const handleLegalDocumentsChange = (
    field: string,
    value: boolean | string
  ) => {
    setDueDiligenceData((prev) => ({
      ...prev,
      legalDocuments: {
        ...prev.legalDocuments,
        [field]: value,
      },
    }))
  }

  // Handle platform agreements changes
  const handlePlatformAgreementsChange = (
    field: string,
    value: boolean | string
  ) => {
    setDueDiligenceData((prev) => ({
      ...prev,
      platformAgreements: {
        ...prev.platformAgreements,
        [field]: value,
      },
    }))
  }

  // Handle liability framework changes
  const handleLiabilityFrameworkChange = (field: string, value: boolean) => {
    setDueDiligenceData((prev) => ({
      ...prev,
      liabilityFramework: {
        ...prev.liabilityFramework,
        [field]: value,
      },
    }))
  }

  // Handle outstanding issues input
  const handleOutstandingIssuesInput = (value: string) => {
    const issues = value
      .split(",")
      .map((issue) => issue.trim())
      .filter(Boolean)

    setDueDiligenceData((prev) => ({
      ...prev,
      legalDocuments: {
        ...prev.legalDocuments,
        outstandingIssues: issues,
      },
    }))
  }

  // Handle auto-fill for demo data
  const handleAutoFill = () => {
    const demoData = {
      legalDocuments: {
        ddqCompleted: true,
        ddqSubmissionDate: new Date().toISOString().split("T")[0],
        legalReviewCompleted: true,
        complianceChecksCompleted: true,
        outstandingIssues: ["Pending board approval signature"],
      },
      platformAgreements: {
        masterInvestmentAgreementSigned: true,
        signatureDate: new Date().toISOString().split("T")[0],
        confidentialityAgreementSigned: true,
        ndaSigned: true,
      },
      liabilityFramework: {
        rolesResponsibilitiesAcknowledged: true,
        limitationsAcknowledged: true,
        disputeResolutionAcknowledged: true,
      },
      dueDiligenceNotes:
        "All documentation is in order pending final executive sign-off.",
    }

    setDueDiligenceData(demoData)

    // Comprehensive demo data for the DDQA survey
    const demoSurveyResult = {
      // Section 1: Institutional Information
      institutionName: "Global Capital Partners Ltd",
      registeredAddress: "123 Finsbury Pavement, London EC2A 1NQ",
      leiNumber: "549300X8SRHW47X9TB24",
      registrationNumber: "12345678",
      countryOfIncorporation: "United Kingdom",
      institutionType: "Asset Manager",

      // Section 2: Contact Information
      primaryContactName: "James Wilson",
      jobTitle: "Chief Investment Officer",
      emailAddress: "james.wilson@gcp.example.com",
      phoneNumber: "+44 20 7123 4567",
      secondaryContact: "Sarah Thompson, Compliance Officer",

      // Section 3: Regulatory and Compliance Information
      regulatoryStatus:
        "Regulated by Financial Conduct Authority (FCA), United Kingdom",
      regulatoryLicenses:
        "FCA Authorization Number: 123456\nMiFID II Compliant\nAIFMD Compliant",
      regulatoryAction: false,
      complianceProcedures:
        "GCP maintains a comprehensive compliance framework overseen by our dedicated Compliance Department. Our AML procedures include:\n- Client onboarding KYC/KYB procedures\n- Annual AML training for all staff\n- Regular risk assessments\n- Transaction monitoring systems\n- Suspicious activity reporting protocols\n- Regular independent audits",

      // Section 4: Ownership and Governance
      majorShareholders:
        "- Riverstone Holdings (25%)\n- Wilson Family Office (15%)\n- Blackrock Investment Partners (12%)",
      ultimateBeneficialOwners:
        "- James Wilson (18% through Wilson Family Office)\n- Alexander Thompson (11% through Riverstone Holdings)",
      keyManagement:
        "- James Wilson, Chief Investment Officer\n- Sarah Thompson, Chief Compliance Officer\n- Michael Chen, Chief Financial Officer\n- Elizabeth Grant, Head of Real Estate Investments\n- Robert Johnson, Chief Risk Officer",

      // Section 5: Financial Information
      aum: "£4.7 billion",
      creditRating: "Moody's: A2 / S&P: A",

      // Section 6: Investment Objectives and Strategy
      investmentObjectives: [
        "Income Generation",
        "Capital Preservation",
        "Portfolio Diversification",
      ],
      investmentHorizon: "Long-term (7-15 years)",
      assetAllocation:
        "- Fixed Income: 35%\n- Equities: 30%\n- Real Estate: 20%\n- Alternative Investments: 10%\n- Cash & Equivalents: 5%",
      investmentRestrictions:
        "- No direct investments in tobacco, gambling, or weapons manufacturing\n- Maximum exposure to any single asset class limited to 40%\n- Minimum credit rating of BBB- for fixed income investments\n- Restrictions on investments in certain emerging markets",

      // Section 7: Real Estate Experience
      priorRealEstateInvestment: true,
      realEstateDetails:
        "Our institution has a 15-year track record in real estate investments across the UK and Europe. Portfolio includes:\n- Commercial office spaces in London, Frankfurt, and Paris\n- Multi-family residential developments in major UK cities\n- Retirement living communities\n- Limited exposure to retail properties\n\nTotal real estate AUM: £950 million",
      riskAssessment:
        "We assess real estate investments through a detailed risk framework that considers:\n- Location quality and market dynamics\n- Tenant quality and diversity\n- Lease term structure\n- Asset quality and capital requirements\n- Exit strategy\n- Environmental and regulatory risks\n- Manager quality and track record",
      approvalProcess:
        "New investment types require a multi-stage approval process:\n1. Initial screening by Investment Team\n2. Detailed due diligence and risk assessment\n3. Review by Investment Committee\n4. Presentation to Risk Committee\n5. Final approval by Executive Board for significant allocations",

      // Section 8: Operational Information
      decisionMakingProcess:
        "Investment decisions follow a structured governance framework:\n1. Strategy set by Investment Committee (meets quarterly)\n2. Opportunity sourcing and initial screening by specialist teams\n3. Due diligence conducted by combined team of internal specialists and external advisors\n4. Investment Committee approval required for all investments >£10m\n5. Board approval required for investments >£50m",
      dueDiligenceApproach:
        "Our real estate due diligence process includes:\n- Legal title and ownership verification\n- Environmental assessment and compliance\n- Technical building surveys\n- Financial analysis and stress testing\n- Tenant creditworthiness assessment\n- Market analysis and valuation verification\n- Regulatory compliance review\n- Tax structuring assessment",
      thirdPartyAdvisers:
        "- Legal: Clifford Chance LLP\n- Financial/Tax: PwC\n- Technical/Environmental: Arup\n- Valuation: Knight Frank\n- Risk: Deloitte Risk Advisory",

      // Section 9: Legal and Reputational Information
      currentLitigation: false,
      historicalLitigation:
        "In the past five years, our institution has been involved in one regulatory matter regarding trade reporting discrepancies under MiFID II reporting requirements. This was resolved with the FCA in 2021 with implementation of enhanced reporting systems and procedures. No financial penalty was imposed.",

      // Section 10: Documentation Checklist
      documentationProvided: [
        "Certificate of Incorporation",
        "Articles of Association or equivalent",
        "Proof of Regulatory Licences",
        "Audited Financial Statements (latest fiscal year)",
        "AML/Compliance Policy Documents",
      ],

      // Section 11: Declaration
      signatureName: "James Wilson",
      signatureTitle: "Chief Investment Officer",
      declarationConfirmation: true,
    }

    setSurveyResult(demoSurveyResult)
    surveyModel.data = demoSurveyResult
    setHasSurveyBeenStarted(true)
  }

  // Handle form submission
  const handleContinue = () => {
    // Validation
    if (!dueDiligenceData.legalDocuments.ddqCompleted) {
      toast({
        title: "Form incomplete",
        description: "Please complete the Due Diligence Questionnaire (DDQ)",
        variant: "destructive",
      })
      return
    }

    if (!dueDiligenceData.platformAgreements.masterInvestmentAgreementSigned) {
      toast({
        title: "Agreement required",
        description: "Please ensure the Master Investment Agreement is signed",
        variant: "destructive",
      })
      return
    }

    const hasLiabilityAcknowledgement = Object.values(
      dueDiligenceData.liabilityFramework
    ).some((value) => value === true)
    if (!hasLiabilityAcknowledgement) {
      toast({
        title: "Acknowledgement required",
        description: "Please acknowledge at least one liability framework item",
        variant: "destructive",
      })
      return
    }

    // Save data and move to next step
    updateWizardData({
      dueDiligenceLegal: {
        ...dueDiligenceData,
        ddqaSurveyResults: surveyResult,
      },
    })
    onNext()
  }

  // Calculate completion percentage
  const calculateCompletionPercentage = (): number => {
    let totalItems = 0
    let completedItems = 0

    // Count legal documents items
    const legalDocItems = Object.entries(
      dueDiligenceData.legalDocuments
    ).filter(
      ([key]) => key !== "outstandingIssues" && key !== "ddqSubmissionDate"
    )
    totalItems += legalDocItems.length
    completedItems += legalDocItems.filter(
      ([_, value]) => value === true
    ).length

    // Count platform agreements items
    const agreementItems = Object.entries(
      dueDiligenceData.platformAgreements
    ).filter(([key]) => key !== "signatureDate")
    totalItems += agreementItems.length
    completedItems += agreementItems.filter(
      ([_, value]) => value === true
    ).length

    // Count liability framework items
    totalItems += Object.keys(dueDiligenceData.liabilityFramework).length
    completedItems += Object.values(dueDiligenceData.liabilityFramework).filter(
      (value) => value === true
    ).length

    // Add survey completion to percentage
    if (hasSurveyBeenStarted) {
      totalItems += 1
      if (Object.keys(surveyResult).length > 0) {
        completedItems += 1
      }
    }

    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
  }

  const completionPercentage = calculateCompletionPercentage()

  return (
    <Card className="w-full max-w-full border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-semibold text-primary">
            Due Diligence & Legal Compliance
          </CardTitle>
          <CardDescription>
            Complete legal documentation and compliance requirements
          </CardDescription>
        </div>

        <Button
          className="border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100 hover:text-amber-900 dark:border-amber-900 dark:bg-amber-900/20 dark:text-amber-100"
          size="sm"
          variant="outline"
          onClick={handleAutoFill}
        >
          Auto-Fill DDQA
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        <Tabs
          defaultValue="simple-form"
          value={selectedTab}
          onValueChange={setSelectedTab}
        >
          <TabsList className="mb-4 grid w-full grid-cols-2">
            <TabsTrigger value="simple-form">Simple Form</TabsTrigger>
            <TabsTrigger value="detailed-ddq">Detailed DDQA</TabsTrigger>
          </TabsList>

          <TabsContent value="simple-form">
            {/* Legal Documents */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Legal Documentation & Review
              </h3>

              <div className="rounded-md border border-border p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={dueDiligenceData.legalDocuments.ddqCompleted}
                        id="ddq-completed"
                        onCheckedChange={(checked) =>
                          handleLegalDocumentsChange(
                            "ddqCompleted",
                            checked === true
                          )
                        }
                      />
                      <Label className="font-medium" htmlFor="ddq-completed">
                        Due Diligence Questionnaire (DDQ) Completed
                      </Label>
                    </div>

                    {dueDiligenceData.legalDocuments.ddqCompleted && (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                        Completed
                      </Badge>
                    )}
                  </div>

                  {dueDiligenceData.legalDocuments.ddqCompleted && (
                    <div className="space-y-2">
                      <Label htmlFor="ddq-date">DDQ Submission Date</Label>
                      <Input
                        id="ddq-date"
                        type="date"
                        value={formatDateForInput(
                          dueDiligenceData.legalDocuments.ddqSubmissionDate
                        )}
                        onChange={(e) =>
                          handleLegalDocumentsChange(
                            "ddqSubmissionDate",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="legal-review"
                        checked={
                          dueDiligenceData.legalDocuments.legalReviewCompleted
                        }
                        onCheckedChange={(checked) =>
                          handleLegalDocumentsChange(
                            "legalReviewCompleted",
                            checked === true
                          )
                        }
                      />
                      <Label className="font-medium" htmlFor="legal-review">
                        Legal Review Completed
                      </Label>
                    </div>

                    {dueDiligenceData.legalDocuments.legalReviewCompleted && (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                        Completed
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="compliance-checks"
                        checked={
                          dueDiligenceData.legalDocuments
                            .complianceChecksCompleted
                        }
                        onCheckedChange={(checked) =>
                          handleLegalDocumentsChange(
                            "complianceChecksCompleted",
                            checked === true
                          )
                        }
                      />
                      <Label
                        className="font-medium"
                        htmlFor="compliance-checks"
                      >
                        Compliance Checks Completed
                      </Label>
                    </div>

                    {dueDiligenceData.legalDocuments
                      .complianceChecksCompleted && (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                        Completed
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="outstanding-issues">
                      Outstanding Issues (comma-separated)
                    </Label>
                    <Input
                      id="outstanding-issues"
                      placeholder="e.g., missing board resolution, additional verification required"
                      value={
                        dueDiligenceData.legalDocuments.outstandingIssues?.join(
                          ", "
                        ) || ""
                      }
                      onChange={(e) =>
                        handleOutstandingIssuesInput(e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Agreements */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Platform Agreements</h3>

              <div className="rounded-md border border-border p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="master-agreement"
                        checked={
                          dueDiligenceData.platformAgreements
                            .masterInvestmentAgreementSigned
                        }
                        onCheckedChange={(checked) =>
                          handlePlatformAgreementsChange(
                            "masterInvestmentAgreementSigned",
                            checked === true
                          )
                        }
                      />
                      <Label className="font-medium" htmlFor="master-agreement">
                        Master Investment Agreement Signed
                      </Label>
                    </div>

                    {dueDiligenceData.platformAgreements
                      .masterInvestmentAgreementSigned && (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                        Signed
                      </Badge>
                    )}
                  </div>

                  {dueDiligenceData.platformAgreements
                    .masterInvestmentAgreementSigned && (
                    <div className="space-y-2">
                      <Label htmlFor="signature-date">Signature Date</Label>
                      <Input
                        id="signature-date"
                        type="date"
                        value={formatDateForInput(
                          dueDiligenceData.platformAgreements.signatureDate
                        )}
                        onChange={(e) =>
                          handlePlatformAgreementsChange(
                            "signatureDate",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="confidentiality-agreement"
                        checked={
                          dueDiligenceData.platformAgreements
                            .confidentialityAgreementSigned
                        }
                        onCheckedChange={(checked) =>
                          handlePlatformAgreementsChange(
                            "confidentialityAgreementSigned",
                            checked === true
                          )
                        }
                      />
                      <Label
                        className="font-medium"
                        htmlFor="confidentiality-agreement"
                      >
                        Confidentiality Agreement Signed
                      </Label>
                    </div>

                    {dueDiligenceData.platformAgreements
                      .confidentialityAgreementSigned && (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                        Signed
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={dueDiligenceData.platformAgreements.ndaSigned}
                        id="nda-signed"
                        onCheckedChange={(checked) =>
                          handlePlatformAgreementsChange(
                            "ndaSigned",
                            checked === true
                          )
                        }
                      />
                      <Label className="font-medium" htmlFor="nda-signed">
                        Non-Disclosure Agreement (NDA) Signed
                      </Label>
                    </div>

                    {dueDiligenceData.platformAgreements.ndaSigned && (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                        Signed
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Liability Framework */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Liability Framework</h3>

              <div className="rounded-md border border-border p-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="roles-responsibilities"
                      checked={
                        dueDiligenceData.liabilityFramework
                          .rolesResponsibilitiesAcknowledged
                      }
                      onCheckedChange={(checked) =>
                        handleLiabilityFrameworkChange(
                          "rolesResponsibilitiesAcknowledged",
                          checked === true
                        )
                      }
                    />
                    <Label
                      className="font-medium"
                      htmlFor="roles-responsibilities"
                    >
                      Roles & Responsibilities Acknowledged
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="limitations"
                      checked={
                        dueDiligenceData.liabilityFramework
                          .limitationsAcknowledged
                      }
                      onCheckedChange={(checked) =>
                        handleLiabilityFrameworkChange(
                          "limitationsAcknowledged",
                          checked === true
                        )
                      }
                    />
                    <Label className="font-medium" htmlFor="limitations">
                      Liability Limitations Acknowledged
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="dispute-resolution"
                      checked={
                        dueDiligenceData.liabilityFramework
                          .disputeResolutionAcknowledged
                      }
                      onCheckedChange={(checked) =>
                        handleLiabilityFrameworkChange(
                          "disputeResolutionAcknowledged",
                          checked === true
                        )
                      }
                    />
                    <Label className="font-medium" htmlFor="dispute-resolution">
                      Dispute Resolution Process Acknowledged
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Additional Notes</h3>

              <div className="space-y-2">
                <Label htmlFor="due-diligence-notes">
                  Additional Due Diligence Notes
                </Label>
                <Textarea
                  className="min-h-[100px]"
                  id="due-diligence-notes"
                  placeholder="Enter any additional notes, concerns or special requirements related to due diligence and legal compliance..."
                  value={dueDiligenceData.dueDiligenceNotes || ""}
                  onChange={(e) =>
                    setDueDiligenceData((prev) => ({
                      ...prev,
                      dueDiligenceNotes: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="detailed-ddq">
            <div className="rounded-md border border-border p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  Institutional Investor Due Diligence Questionnaire (DDQA)
                </h3>
                {Object.keys(surveyResult).length > 0 && (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                    Completed
                  </Badge>
                )}
              </div>

              <p className="mb-4 text-sm text-muted-foreground">
                Please complete this detailed questionnaire to help us
                understand your institution better and ensure compliance with
                all regulatory requirements.
              </p>

              <div className="survey-container w-full max-w-full">
                <Survey model={surveyModel} />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Completion Status */}
        <div className="rounded-md bg-muted/30 p-4">
          <h3 className="mb-2 text-lg font-medium">
            Due Diligence Completion Status
          </h3>
          <div className="flex items-center gap-4">
            <div className="grow">
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{
                    width: `${completionPercentage}%`,
                  }}
                />
              </div>
            </div>
            <div className="text-sm font-medium">{completionPercentage}%</div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button disabled={isLoading} variant="outline" onClick={onBack}>
          Back to Qualification & KYC/AML
        </Button>
        <Button
          className="w-[300px]"
          disabled={isLoading}
          onClick={handleContinue}
        >
          {isLoading ? "Saving..." : "Continue to Investor Profile Setup"}
        </Button>
      </CardFooter>
    </Card>
  )
}
