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
import { Separator } from "@package/ui/separator"
import { Textarea } from "@package/ui/textarea"

import type { BaseStepProps } from "../StepProps"
import type { ComplianceInfo } from "../types"

import { api } from "@/lib/trpc/react"

export function ComplianceLegalStep({
  wizardData,
  updateWizardData,
  onNext,
  onBack,
  setGuideMessage,
}: BaseStepProps) {
  // Set the guide message for this step
  useEffect(() => {
    setGuideMessage(
      "Regulatory compliance is critical for your Buy Box. Ensure all FCA and MiFID requirements are met, all property legal checks are completed, and all necessary documents are attached."
    )
  }, [setGuideMessage])

  // Local state for the compliance info
  const [complianceInfo, setComplianceInfo] = useState<ComplianceInfo>(() => {
    // Initialize with existing data or defaults
    return (
      wizardData.complianceInfo || {
        regulatoryCompliance: {
          fcaCompliant: false,
          mifidCompliant: false,
          otherRegulations: [],
        },
        legalChecks: {
          propertyLiensCleared: false,
          sellerRightsReviewed: false,
          contractObligationsReviewed: false,
        },
        documents: [],
        internalApproval: {},
      }
    )
  })

  // API mutation
  const updateComplianceInfoMutation =
    api.admin.buyBoxCreation.updateComplianceInfo.useMutation()

  // Handle regulatory compliance changes
  const handleRegulatoryChange = (field: string, value: boolean) => {
    setComplianceInfo((prev) => ({
      ...prev,
      regulatoryCompliance: {
        ...prev.regulatoryCompliance,
        [field]: value,
      },
    }))
  }

  // Handle legal checks changes
  const handleLegalChange = (field: string, value: boolean) => {
    setComplianceInfo((prev) => ({
      ...prev,
      legalChecks: {
        ...prev.legalChecks,
        [field]: value,
      },
    }))
  }

  // Handle other regulations input
  const handleOtherRegulationsInput = (value: string) => {
    const regulations = value
      .split(",")
      .map((reg) => reg.trim())
      .filter(Boolean)
    setComplianceInfo((prev) => ({
      ...prev,
      regulatoryCompliance: {
        ...prev.regulatoryCompliance,
        otherRegulations: regulations,
      },
    }))
  }

  // Handle legal issues input
  const handleLegalIssuesInput = (value: string) => {
    setComplianceInfo((prev) => ({
      ...prev,
      legalChecks: {
        ...prev.legalChecks,
        issues: value,
      },
    }))
  }

  // Handle document upload
  const handleDocumentUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      // In a real app, this would upload the file to a server
      // Here we'll just simulate adding it to our local state
      const file = event.target.files[0]
      const newDocument = {
        id: `doc-${Date.now()}`,
        name: file.name,
        type: type as
          | "valuation"
          | "legal"
          | "actuarial"
          | "risk"
          | "compliance"
          | "other",
        url: URL.createObjectURL(file), // In a real app, this would be the server URL
      }

      setComplianceInfo((prev) => ({
        ...prev,
        documents: [...prev.documents, newDocument],
      }))
    }
  }

  // Handle document removal
  const handleRemoveDocument = (documentId: string) => {
    setComplianceInfo((prev) => ({
      ...prev,
      documents: prev.documents.filter((doc) => doc.id !== documentId),
    }))
  }

  // Handle internal approval changes
  const handleApprovalChange = (field: string, value: string) => {
    setComplianceInfo((prev) => ({
      ...prev,
      internalApproval: {
        ...prev.internalApproval,
        [field]: value,
      },
    }))
  }

  const [isLoading, setIsLoading] = useState(false)

  // Handle form submission
  const handleContinue = () => {
    // Validation
    if (!complianceInfo.regulatoryCompliance.fcaCompliant) {
      alert("FCA compliance is required before proceeding")
      return
    }

    if (!complianceInfo.regulatoryCompliance.mifidCompliant) {
      alert("MiFID compliance is required before proceeding")
      return
    }

    const legalChecksComplete =
      complianceInfo.legalChecks.propertyLiensCleared &&
      complianceInfo.legalChecks.sellerRightsReviewed &&
      complianceInfo.legalChecks.contractObligationsReviewed

    if (!legalChecksComplete) {
      alert("All legal checks must be completed before proceeding")
      return
    }

    if (complianceInfo.documents.length === 0) {
      alert("At least one compliance document must be uploaded")
      return
    }

    // Save data and move to next step
    updateWizardData({ complianceInfo })

    // Call API to update compliance info
    setIsLoading(true)
    updateComplianceInfoMutation.mutate(
      {
        buyBoxId: localStorage.getItem("buyBoxId") || "", // TODO: make dynamic
        data: complianceInfo,
      },
      {
        onSuccess: () => {
          setIsLoading(false)
          onNext()
        },
        onError: (error) => {
          console.error("Error updating compliance info:", error)
          setIsLoading(false)
          alert("Error updating compliance info. Please try again.")
        },
      }
    )
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">
          Compliance & Legal Review
        </CardTitle>
        <CardDescription>
          Ensure all regulatory requirements are met and legal checks are
          completed
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Regulatory Compliance Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Regulatory Compliance</h3>

          <div className="rounded-md border border-border p-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={complianceInfo.regulatoryCompliance.fcaCompliant}
                  id="fca-compliant"
                  onCheckedChange={(checked) =>
                    handleRegulatoryChange("fcaCompliant", checked === true)
                  }
                />
                <Label className="font-medium" htmlFor="fca-compliant">
                  FCA Compliant
                </Label>
              </div>
              <p className="ml-6 text-sm text-muted-foreground">
                The Buy Box meets all Financial Conduct Authority requirements
                for regulated investment products
              </p>

              <Separator className="my-2" />

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={complianceInfo.regulatoryCompliance.mifidCompliant}
                  id="mifid-compliant"
                  onCheckedChange={(checked) =>
                    handleRegulatoryChange("mifidCompliant", checked === true)
                  }
                />
                <Label className="font-medium" htmlFor="mifid-compliant">
                  MiFID II Compliant
                </Label>
              </div>
              <p className="ml-6 text-sm text-muted-foreground">
                The Buy Box meets all Markets in Financial Instruments Directive
                II requirements
              </p>

              <Separator className="my-2" />

              <div className="space-y-2">
                <Label htmlFor="other-regulations">
                  Other Regulations (comma-separated)
                </Label>
                <Input
                  id="other-regulations"
                  placeholder="e.g., AML, KYC, GDPR"
                  value={
                    complianceInfo.regulatoryCompliance.otherRegulations?.join(
                      ", "
                    ) || ""
                  }
                  onChange={(e) => handleOtherRegulationsInput(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Legal Checks Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Legal Checks</h3>

          <div className="rounded-md border border-border p-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={complianceInfo.legalChecks.propertyLiensCleared}
                  id="liens-cleared"
                  onCheckedChange={(checked) =>
                    handleLegalChange("propertyLiensCleared", checked === true)
                  }
                />
                <Label className="font-medium" htmlFor="liens-cleared">
                  Property Liens Cleared
                </Label>
              </div>
              <p className="ml-6 text-sm text-muted-foreground">
                All properties have been checked for existing liens and
                encumbrances
              </p>

              <Separator className="my-2" />

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={complianceInfo.legalChecks.sellerRightsReviewed}
                  id="seller-rights"
                  onCheckedChange={(checked) =>
                    handleLegalChange("sellerRightsReviewed", checked === true)
                  }
                />
                <Label className="font-medium" htmlFor="seller-rights">
                  Seller Rights Reviewed
                </Label>
              </div>
              <p className="ml-6 text-sm text-muted-foreground">
                All seller rights and obligations have been reviewed by legal
                counsel
              </p>

              <Separator className="my-2" />

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="contract-obligations"
                  checked={
                    complianceInfo.legalChecks.contractObligationsReviewed
                  }
                  onCheckedChange={(checked) =>
                    handleLegalChange(
                      "contractObligationsReviewed",
                      checked === true
                    )
                  }
                />
                <Label className="font-medium" htmlFor="contract-obligations">
                  Contract Obligations Reviewed
                </Label>
              </div>
              <p className="ml-6 text-sm text-muted-foreground">
                All contractual obligations and terms have been reviewed by
                legal counsel
              </p>

              <Separator className="my-2" />

              <div className="space-y-2">
                <Label htmlFor="legal-issues">Legal Issues or Concerns</Label>
                <Textarea
                  id="legal-issues"
                  placeholder="Describe any legal issues, concerns, or special considerations..."
                  value={complianceInfo.legalChecks.issues || ""}
                  onChange={(e) => handleLegalIssuesInput(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Document Upload Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Documentation</h3>

          <div className="rounded-md border border-border p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="valuation-doc">Valuation Reports</Label>
                <Input
                  accept=".pdf,.doc,.docx"
                  id="valuation-doc"
                  type="file"
                  onChange={(e) => handleDocumentUpload(e, "valuation")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="legal-doc">Legal Summaries</Label>
                <Input
                  accept=".pdf,.doc,.docx"
                  id="legal-doc"
                  type="file"
                  onChange={(e) => handleDocumentUpload(e, "legal")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="actuarial-doc">Actuarial Analysis</Label>
                <Input
                  accept=".pdf,.doc,.docx,.xlsx"
                  id="actuarial-doc"
                  type="file"
                  onChange={(e) => handleDocumentUpload(e, "actuarial")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="risk-doc">Risk Assessments</Label>
                <Input
                  accept=".pdf,.doc,.docx"
                  id="risk-doc"
                  type="file"
                  onChange={(e) => handleDocumentUpload(e, "risk")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="compliance-doc">Compliance Documents</Label>
                <Input
                  accept=".pdf,.doc,.docx"
                  id="compliance-doc"
                  type="file"
                  onChange={(e) => handleDocumentUpload(e, "compliance")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="other-doc">Other Documents</Label>
                <Input
                  accept=".pdf,.doc,.docx,.xlsx,.jpg,.png"
                  id="other-doc"
                  type="file"
                  onChange={(e) => handleDocumentUpload(e, "other")}
                />
              </div>
            </div>

            {/* Document List */}
            {complianceInfo.documents.length > 0 && (
              <div className="mt-4">
                <h4 className="mb-2 font-medium">Uploaded Documents</h4>
                <div className="max-h-[200px] overflow-y-auto rounded-md border border-border">
                  <table className="w-full">
                    <thead className="sticky top-0 border-b border-border bg-muted">
                      <tr>
                        <th className="p-2 text-left">Document Name</th>
                        <th className="p-2 text-left">Type</th>
                        <th className="p-2 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complianceInfo.documents.map((document) => (
                        <tr
                          key={document.id}
                          className="border-b border-border"
                        >
                          <td className="p-2">{document.name}</td>
                          <td className="p-2">{document.type}</td>
                          <td className="p-2 text-center">
                            <Button
                              className="text-destructive hover:text-destructive/90"
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveDocument(document.id)}
                            >
                              Remove
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Internal Approval Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Internal Approval</h3>

          <div className="rounded-md border border-border p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="approved-by">Approved By</Label>
                <Input
                  id="approved-by"
                  placeholder="e.g., John Smith, Head of Compliance"
                  value={complianceInfo.internalApproval.approvedBy || ""}
                  onChange={(e) =>
                    handleApprovalChange("approvedBy", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="approval-date">Approval Date</Label>
                <Input
                  id="approval-date"
                  type="date"
                  value={complianceInfo.internalApproval.approvalDate || ""}
                  onChange={(e) =>
                    handleApprovalChange("approvalDate", e.target.value)
                  }
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="approval-notes">Approval Notes</Label>
                <Textarea
                  id="approval-notes"
                  placeholder="Add any notes or comments about the approval..."
                  value={complianceInfo.internalApproval.approvalNotes || ""}
                  onChange={(e) =>
                    handleApprovalChange("approvalNotes", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Checklist Summary */}
        <div className="rounded-md border border-border bg-muted/20 p-4">
          <h3 className="mb-2 text-lg font-medium">
            Compliance Checklist Summary
          </h3>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>FCA Compliance:</span>
              <span
                className={`font-medium ${complianceInfo.regulatoryCompliance.fcaCompliant ? "text-green-600" : "text-red-500"}`}
              >
                {complianceInfo.regulatoryCompliance.fcaCompliant
                  ? "Complete"
                  : "Incomplete"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span>MiFID II Compliance:</span>
              <span
                className={`font-medium ${complianceInfo.regulatoryCompliance.mifidCompliant ? "text-green-600" : "text-red-500"}`}
              >
                {complianceInfo.regulatoryCompliance.mifidCompliant
                  ? "Complete"
                  : "Incomplete"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span>Legal Checks:</span>
              <span
                className={`font-medium ${
                  complianceInfo.legalChecks.propertyLiensCleared &&
                  complianceInfo.legalChecks.sellerRightsReviewed &&
                  complianceInfo.legalChecks.contractObligationsReviewed
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {complianceInfo.legalChecks.propertyLiensCleared &&
                complianceInfo.legalChecks.sellerRightsReviewed &&
                complianceInfo.legalChecks.contractObligationsReviewed
                  ? "Complete"
                  : "Incomplete"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span>Documentation:</span>
              <span
                className={`font-medium ${complianceInfo.documents.length > 0 ? "text-green-600" : "text-red-500"}`}
              >
                {complianceInfo.documents.length > 0
                  ? `${complianceInfo.documents.length} Documents Uploaded`
                  : "No Documents Uploaded"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span>Internal Approval:</span>
              <span
                className={`font-medium ${complianceInfo.internalApproval.approvedBy ? "text-green-600" : "text-amber-500"}`}
              >
                {complianceInfo.internalApproval.approvedBy
                  ? "Approved"
                  : "Pending Approval"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Financial Modeling
        </Button>
        <Button
          className="w-[300px]"
          disabled={isLoading}
          onClick={handleContinue}
        >
          {isLoading ? "Saving..." : "Continue to Platform Listing"}
        </Button>
      </CardFooter>
    </Card>
  )
}
