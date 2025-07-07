/*eslint-disable no-nested-ternary */
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
import { PlusCircle, Trash2 } from "lucide-react"

import type { BaseStepProps } from "../StepProps"
import type { PlatformListing } from "../types"

import { api } from "@/lib/trpc/react"

export function PlatformListingStep({
  wizardData,
  updateWizardData,
  onNext,
  onBack,
  setGuideMessage,
}: BaseStepProps) {
  // Set the guide message for this step
  useEffect(() => {
    setGuideMessage(
      "Craft a compelling listing for your Buy Box that will attract institutional investors. Clear descriptions, compelling investment highlights, and transparent risk disclosures are key to successful Buy Box offerings."
    )
  }, [setGuideMessage])

  // Local state for the platform listing
  const [platformListing, setPlatformListing] = useState<PlatformListing>(
    () => {
      // Initialize with existing data or defaults
      return (
        wizardData.platformListing || {
          buyBoxName: wizardData.buyBoxTheme?.name || "",
          shortDescription: "",
          longDescription: "",
          highlightFeatures: [],
          investmentHighlights: [],
          riskDisclosures: [],
          documents: [],
          publishStatus: "draft",
        }
      )
    }
  )

  // API mutation
  const updatePlatformListingMutation =
    api.admin.buyBoxCreation.updatePlatformListing.useMutation()

  // Handle input changes for string fields
  const handleInputChange = (field: string, value: string) => {
    setPlatformListing((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle array item addition (for highlights, features, disclosures)
  const handleAddArrayItem = (field: string, value: string) => {
    if (!value.trim()) return

    setPlatformListing((prev) => ({
      ...prev,
      [field]: [
        ...(prev[field as keyof PlatformListing] as string[]),
        value.trim(),
      ],
    }))
  }

  // Handle array item removal
  const handleRemoveArrayItem = (field: string, index: number) => {
    setPlatformListing((prev) => {
      const updatedArray = [
        ...(prev[field as keyof PlatformListing] as string[]),
      ]
      updatedArray.splice(index, 1)
      return {
        ...prev,
        [field]: updatedArray,
      }
    })
  }

  // Handle document upload
  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      // In a real app, this would upload the file to a server
      // Here we'll just simulate adding it to our local state
      const file = event.target.files[0]
      const newDocument = {
        id: `doc-${Date.now()}`,
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file), // In a real app, this would be the server URL
        isPublic: true,
      }

      setPlatformListing((prev) => ({
        ...prev,
        documents: [...prev.documents, newDocument],
      }))
    }
  }

  // Handle document removal
  const handleRemoveDocument = (documentId: string) => {
    setPlatformListing((prev) => ({
      ...prev,
      documents: prev.documents.filter((doc) => doc.id !== documentId),
    }))
  }

  // Handle document visibility toggle
  const handleDocumentVisibilityChange = (
    documentId: string,
    isPublic: boolean
  ) => {
    setPlatformListing((prev) => ({
      ...prev,
      documents: prev.documents.map((doc) =>
        doc.id === documentId ? { ...doc, isPublic } : doc
      ),
    }))
  }

  // Handle publish status change
  const handlePublishStatusChange = (
    status: "draft" | "pending_review" | "approved" | "published"
  ) => {
    setPlatformListing((prev) => ({
      ...prev,
      publishStatus: status,
      publishDate:
        status === "published"
          ? new Date().toISOString().split("T")[0]
          : prev.publishDate,
    }))
  }

  // Array field input components
  const [newHighlightFeature, setNewHighlightFeature] = useState("")
  const [newInvestmentHighlight, setNewInvestmentHighlight] = useState("")
  const [newRiskDisclosure, setNewRiskDisclosure] = useState("")

  // Handle form submission
  const handleContinue = () => {
    // Validation
    if (!platformListing.buyBoxName) {
      alert("Buy Box name is required")
      return
    }

    if (!platformListing.shortDescription) {
      alert("Short description is required")
      return
    }

    if (!platformListing.longDescription) {
      alert("Detailed description is required")
      return
    }

    if (platformListing.investmentHighlights.length === 0) {
      alert("At least one investment highlight is required")
      return
    }

    if (platformListing.riskDisclosures.length === 0) {
      alert("At least one risk disclosure is required")
      return
    }

    // Save data and move to next step
    updateWizardData({ platformListing })

    // Call API to update platform listing
    setIsLoading(true)
    updatePlatformListingMutation.mutate(
      {
        buyBoxId: localStorage.getItem("buyBoxId") || "", // TODO: make dynamic
        data: platformListing,
      },
      {
        onSuccess: () => {
          setIsLoading(false)
          onNext()
        },
        onError: (error) => {
          console.error("Error updating platform listing:", error)
          setIsLoading(false)
          alert("Error updating platform listing. Please try again.")
        },
      }
    )
  }

  // Get Buy Box stats from previous steps
  const getPropertyCount = () => {
    return wizardData.selectedProperties?.length || 0
  }

  const getTotalValue = () => {
    if (!wizardData.financialModel) return 0
    return wizardData.financialModel.pricing.totalInvestmentPrice
  }

  const getTargetYield = () => {
    if (!wizardData.financialModel) return 0
    return wizardData.financialModel.expectedReturns.targetYield
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(value)
  }

  const [isLoading, setIsLoading] = useState(false)

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">
          Platform Listing & Publication
        </CardTitle>
        <CardDescription>
          Create a compelling Buy Box listing for institutional investors
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Basic Listing Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Buy Box Information</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="buy-box-name">Buy Box Name</Label>
              <Input
                id="buy-box-name"
                placeholder="e.g., London Luxury Property Portfolio"
                value={platformListing.buyBoxName}
                onChange={(e) =>
                  handleInputChange("buyBoxName", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="publish-status">Publication Status</Label>
              <Select
                value={platformListing.publishStatus}
                onValueChange={(value) =>
                  handlePublishStatusChange(
                    value as
                      | "draft"
                      | "pending_review"
                      | "approved"
                      | "published"
                  )
                }
              >
                <SelectTrigger id="publish-status">
                  <SelectValue placeholder="Select publication status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending_review">Pending Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="short-description">
              Short Description (150 characters)
            </Label>
            <Input
              id="short-description"
              maxLength={150}
              placeholder="Brief summary of the Buy Box offering"
              value={platformListing.shortDescription}
              onChange={(e) =>
                handleInputChange("shortDescription", e.target.value)
              }
            />
            <p className="text-xs text-muted-foreground">
              {platformListing.shortDescription.length}/150 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="long-description">Detailed Description</Label>
            <Textarea
              className="min-h-[150px]"
              id="long-description"
              placeholder="Provide a comprehensive description of the Buy Box offering, its strategy, and value proposition..."
              value={platformListing.longDescription}
              onChange={(e) =>
                handleInputChange("longDescription", e.target.value)
              }
            />
          </div>
        </div>

        {/* Highlight Features */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Key Features</h3>

          <div className="flex gap-2">
            <Input
              placeholder="e.g., Luxury London properties, High-yield portfolio"
              value={newHighlightFeature}
              onChange={(e) => setNewHighlightFeature(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddArrayItem("highlightFeatures", newHighlightFeature)
                  setNewHighlightFeature("")
                }
              }}
            />
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                handleAddArrayItem("highlightFeatures", newHighlightFeature)
                setNewHighlightFeature("")
              }}
            >
              <PlusCircle className="size-4" />
            </Button>
          </div>

          {platformListing.highlightFeatures.length > 0 ? (
            <div className="rounded-md border border-border">
              <ul className="divide-y divide-border">
                {platformListing.highlightFeatures.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-3"
                  >
                    <span>{feature}</span>
                    <Button
                      className="size-8 text-muted-foreground hover:text-destructive"
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        handleRemoveArrayItem("highlightFeatures", index)
                      }
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              No features added yet
            </p>
          )}
        </div>

        {/* Investment Highlights */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Investment Highlights</h3>

          <div className="flex gap-2">
            <Input
              placeholder="e.g., Target 5.2% annual yield, 15-year minimum guaranteed term"
              value={newInvestmentHighlight}
              onChange={(e) => setNewInvestmentHighlight(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddArrayItem(
                    "investmentHighlights",
                    newInvestmentHighlight
                  )
                  setNewInvestmentHighlight("")
                }
              }}
            />
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                handleAddArrayItem(
                  "investmentHighlights",
                  newInvestmentHighlight
                )
                setNewInvestmentHighlight("")
              }}
            >
              <PlusCircle className="size-4" />
            </Button>
          </div>

          {platformListing.investmentHighlights.length > 0 ? (
            <div className="rounded-md border border-border">
              <ul className="divide-y divide-border">
                {platformListing.investmentHighlights.map(
                  (highlight, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between p-3"
                    >
                      <span>{highlight}</span>
                      <Button
                        className="size-8 text-muted-foreground hover:text-destructive"
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          handleRemoveArrayItem("investmentHighlights", index)
                        }
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </li>
                  )
                )}
              </ul>
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              No investment highlights added yet
            </p>
          )}
        </div>

        {/* Risk Disclosures */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Risk Disclosures</h3>

          <div className="flex gap-2">
            <Input
              placeholder="e.g., Property values may fluctuate with market conditions"
              value={newRiskDisclosure}
              onChange={(e) => setNewRiskDisclosure(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddArrayItem("riskDisclosures", newRiskDisclosure)
                  setNewRiskDisclosure("")
                }
              }}
            />
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                handleAddArrayItem("riskDisclosures", newRiskDisclosure)
                setNewRiskDisclosure("")
              }}
            >
              <PlusCircle className="size-4" />
            </Button>
          </div>

          {platformListing.riskDisclosures.length > 0 ? (
            <div className="rounded-md border border-border">
              <ul className="divide-y divide-border">
                {platformListing.riskDisclosures.map((disclosure, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-3"
                  >
                    <span>{disclosure}</span>
                    <Button
                      className="size-8 text-muted-foreground hover:text-destructive"
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        handleRemoveArrayItem("riskDisclosures", index)
                      }
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              No risk disclosures added yet
            </p>
          )}
        </div>

        {/* Document Upload */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Investor Documents</h3>

          <div className="space-y-2">
            <Label htmlFor="investor-documents">Upload Documents</Label>
            <Input
              id="investor-documents"
              type="file"
              onChange={handleDocumentUpload}
            />
            <p className="text-sm text-muted-foreground">
              Upload documents that will be available to investors
            </p>
          </div>

          {platformListing.documents.length > 0 ? (
            <div className="rounded-md border border-border">
              <table className="w-full">
                <thead className="border-b border-border bg-muted">
                  <tr>
                    <th className="p-2 text-left">Document</th>
                    <th className="p-2 text-center">Public</th>
                    <th className="p-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {platformListing.documents.map((document) => (
                    <tr key={document.id} className="border-b border-border">
                      <td className="p-2">
                        <div className="font-medium">{document.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {document.type}
                        </div>
                      </td>
                      <td className="p-2 text-center">
                        <Checkbox
                          checked={document.isPublic}
                          onCheckedChange={(checked) =>
                            handleDocumentVisibilityChange(
                              document.id,
                              checked === true
                            )
                          }
                        />
                      </td>
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
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              No documents uploaded yet
            </p>
          )}
        </div>

        {/* Preview Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Listing Preview</h3>

          <div className="rounded-md border border-border p-4">
            <div className="mb-4 border-b border-border pb-3">
              <h2 className="text-xl font-bold text-primary">
                {platformListing.buyBoxName || "Buy Box Name"}
              </h2>
              <p className="mt-1 text-muted-foreground">
                {platformListing.shortDescription ||
                  "Short description will appear here"}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-md bg-muted/20 p-3 text-center">
                <div className="text-sm font-medium text-muted-foreground">
                  Properties
                </div>
                <div className="text-xl font-bold">{getPropertyCount()}</div>
              </div>

              <div className="rounded-md bg-muted/20 p-3 text-center">
                <div className="text-sm font-medium text-muted-foreground">
                  Investment Value
                </div>
                <div className="text-xl font-bold">
                  {formatCurrency(getTotalValue())}
                </div>
              </div>

              <div className="rounded-md bg-muted/20 p-3 text-center">
                <div className="text-sm font-medium text-muted-foreground">
                  Target Yield
                </div>
                <div className="text-xl font-bold">{getTargetYield()}%</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-sm font-medium">Status:</div>
              <div className="mt-1">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    platformListing.publishStatus === "published"
                      ? "bg-green-100 text-green-800"
                      : platformListing.publishStatus === "approved"
                        ? "bg-blue-100 text-blue-800"
                        : platformListing.publishStatus === "pending_review"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {platformListing.publishStatus === "published"
                    ? "Published"
                    : platformListing.publishStatus === "approved"
                      ? "Approved"
                      : platformListing.publishStatus === "pending_review"
                        ? "Pending Review"
                        : "Draft"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Compliance & Legal
        </Button>
        <Button
          className="w-[300px]"
          disabled={isLoading}
          onClick={handleContinue}
        >
          {isLoading ? "Saving..." : "Continue to Final Configuration"}
        </Button>
      </CardFooter>
    </Card>
  )
}
