/*eslint-disable react/jsx-max-depth */
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

import type { BaseStepProps } from "../StepProps"
import type { InitialInquiry } from "../types"

import { api } from "@/lib/trpc/react"

export function InitialInquiryAndPlatformIntroductionStep({
  wizardData,
  updateWizardData,
  onNext,
  onBack,
  setGuideMessage,
}: BaseStepProps) {
  // Set the guide message for this step
  useEffect(() => {
    setGuideMessage(
      "Welcome to the first step of your onboarding journey. Please provide your organization's information and initial interest details. This helps us tailor the Srenova platform experience to your specific investment needs."
    )
  }, [setGuideMessage])

  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Query to get existing data for this step
  const stepDataQuery = api.buyer.getStepData.useQuery({
    step: "initialInquiry",
  })

  // Handle successful data fetch
  useEffect(() => {
    const queryData = stepDataQuery.data as unknown
    if (queryData && !wizardData.initialInquiry) {
      // Cast to the expected type with runtime check
      if (typeof queryData === "object") {
        updateWizardData({ initialInquiry: queryData as InitialInquiry })
        setInitialInquiry(queryData as InitialInquiry)
      }
    }
  }, [stepDataQuery.data, updateWizardData, wizardData.initialInquiry])

  // Handle query errors
  useEffect(() => {
    if (stepDataQuery.error) {
      console.error("Error fetching initial inquiry data:", stepDataQuery.error)
    }
  }, [stepDataQuery.error])

  // Mutation to save data
  const saveInitialInquiry = api.buyer.submitInitialInquiry.useMutation({
    onSuccess: () => {
      toast({
        title: "Information saved",
        description: "Your initial inquiry information has been saved.",
      })
      onNext()
    },
    onError: (error) => {
      toast({
        title: "Error saving data",
        description:
          error.message || "Could not save your information. Please try again.",
        variant: "destructive",
      })
    },
  })

  // Initialize local state with existing data or defaults
  const [initialInquiry, setInitialInquiry] = useState<InitialInquiry>(
    () =>
      wizardData.initialInquiry || {
        organisationName: "",
        contactName: "",
        contactPosition: "",
        contactEmail: "",
        contactPhone: "",
        referralSource: "",
        initialInterestLevel: "medium",
        preferredContactMethod: "email",
        introductoryCallScheduled: false,
        platformOverviewProvided: false,
        initialQuestionsNotes: "",
      }
  )

  // Update local state when wizardData changes
  useEffect(() => {
    if (wizardData.initialInquiry) {
      setInitialInquiry(wizardData.initialInquiry)
    }
  }, [wizardData.initialInquiry])

  // Handle form field changes
  const handleInputChange = (
    field: keyof InitialInquiry,
    value: string | boolean
  ) => {
    setInitialInquiry((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

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

  // Handle form submission - updated to use API
  const handleContinue = () => {
    // Validation
    if (!initialInquiry.organisationName) {
      toast({
        title: "Missing information",
        description: "Please provide your organisation name",
        variant: "destructive",
      })
      return
    }

    if (!initialInquiry.contactName) {
      toast({
        title: "Missing information",
        description: "Please provide a contact name",
        variant: "destructive",
      })
      return
    }

    if (!initialInquiry.contactEmail) {
      toast({
        title: "Missing information",
        description: "Please provide a contact email",
        variant: "destructive",
      })
      return
    }

    if (!initialInquiry.contactPhone) {
      toast({
        title: "Missing information",
        description: "Please provide a contact phone number",
        variant: "destructive",
      })
      return
    }

    // Save data locally in the wizard
    updateWizardData({ initialInquiry })

    // Map data to API expected format
    const apiData = {
      investmentGoals:
        initialInquiry.initialQuestionsNotes || "General investment inquiry",
      estimatedInvestmentAmount: 1000000, // Default value, consider adding this field to the form
      preferredContactMethod: ((): "video" | "email" | "phone" => {
        if (initialInquiry.preferredContactMethod === "video_call")
          return "video"
        if (
          initialInquiry.preferredContactMethod === "in_person" ||
          initialInquiry.preferredContactMethod === "phone"
        )
          return "phone"
        return "email"
      })(),
      preferredContactTime: initialInquiry.introductoryCallDate,
      questions: initialInquiry.initialQuestionsNotes,
      referralSource: initialInquiry.referralSource,
    }

    // Save data via API
    setIsLoading(true)
    saveInitialInquiry.mutate(apiData, {
      onSettled: () => setIsLoading(false),
    })
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">
          Initial Inquiry & Platform Introduction
        </CardTitle>
        <CardDescription>
          Provide your contact information and initial investment interests
        </CardDescription>
        {stepDataQuery.isLoading && (
          <p className="text-sm text-muted-foreground">Loading your data...</p>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Organisation Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Organisation Information</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="organisation-name">Organisation Name</Label>
              <Input
                id="organisation-name"
                placeholder="e.g., Srenova Investment Partners"
                value={initialInquiry.organisationName}
                onChange={(e) =>
                  handleInputChange("organisationName", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="referral-source">
                How did you hear about us?
              </Label>
              <Input
                id="referral-source"
                placeholder="e.g., Industry event, referral, online search"
                value={initialInquiry.referralSource || ""}
                onChange={(e) =>
                  handleInputChange("referralSource", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        {/* Primary Contact */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Primary Contact</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Contact Name</Label>
              <Input
                id="contact-name"
                placeholder="e.g., Jane Smith"
                value={initialInquiry.contactName}
                onChange={(e) =>
                  handleInputChange("contactName", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-position">Position</Label>
              <Input
                id="contact-position"
                placeholder="e.g., Investment Director"
                value={initialInquiry.contactPosition}
                onChange={(e) =>
                  handleInputChange("contactPosition", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-email">Email Address</Label>
              <Input
                id="contact-email"
                placeholder="e.g., jane.smith@example.com"
                type="email"
                value={initialInquiry.contactEmail}
                onChange={(e) =>
                  handleInputChange("contactEmail", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-phone">Phone Number</Label>
              <Input
                id="contact-phone"
                placeholder="e.g., +44 20 1234 5678"
                value={initialInquiry.contactPhone}
                onChange={(e) =>
                  handleInputChange("contactPhone", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        {/* Communication Preferences */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Communication Preferences</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="preferred-contact">
                Preferred Contact Method
              </Label>
              <Select
                value={initialInquiry.preferredContactMethod}
                onValueChange={(value) =>
                  handleInputChange(
                    "preferredContactMethod",
                    value as "email" | "phone" | "video_call" | "in_person"
                  )
                }
              >
                <SelectTrigger id="preferred-contact">
                  <SelectValue placeholder="Select contact method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="video_call">Video Call</SelectItem>
                  <SelectItem value="in_person">In-Person Meeting</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interest-level">Initial Interest Level</Label>
              <Select
                value={initialInquiry.initialInterestLevel}
                onValueChange={(value) =>
                  handleInputChange(
                    "initialInterestLevel",
                    value as "low" | "medium" | "high"
                  )
                }
              >
                <SelectTrigger id="interest-level">
                  <SelectValue placeholder="Select interest level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    Exploratory - Just learning about the platform
                  </SelectItem>
                  <SelectItem value="medium">
                    Interested - Considering investment options
                  </SelectItem>
                  <SelectItem value="high">
                    Very Interested - Ready to proceed soon
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Platform Introduction */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Platform Introduction</h3>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={initialInquiry.introductoryCallScheduled}
                id="intro-call"
                onCheckedChange={(checked) =>
                  handleInputChange(
                    "introductoryCallScheduled",
                    checked === true
                  )
                }
              />
              <Label className="font-medium" htmlFor="intro-call">
                Introductory Call Scheduled
              </Label>
            </div>

            {initialInquiry.introductoryCallScheduled && (
              <div className="space-y-2">
                <Label htmlFor="intro-call-date">Scheduled Call Date</Label>
                <Input
                  id="intro-call-date"
                  type="date"
                  value={
                    formatDateForInput(initialInquiry.introductoryCallDate) ||
                    getDateInDays(3)
                  }
                  onChange={(e) =>
                    handleInputChange("introductoryCallDate", e.target.value)
                  }
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={initialInquiry.platformOverviewProvided}
                id="platform-overview"
                onCheckedChange={(checked) =>
                  handleInputChange(
                    "platformOverviewProvided",
                    checked === true
                  )
                }
              />
              <Label className="font-medium" htmlFor="platform-overview">
                Platform Overview & Materials Provided
              </Label>
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Initial Questions & Notes</h3>

          <div className="space-y-2">
            <Label htmlFor="initial-questions">
              Any specific questions or areas of interest?
            </Label>
            <Textarea
              className="min-h-[100px]"
              id="initial-questions"
              placeholder="Please share any specific questions or interests regarding property investments, return profiles, or platform capabilities..."
              value={initialInquiry.initialQuestionsNotes || ""}
              onChange={(e) =>
                handleInputChange("initialQuestionsNotes", e.target.value)
              }
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button disabled={true} variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          className="w-[300px]"
          disabled={isLoading}
          onClick={handleContinue}
        >
          {isLoading ? "Saving..." : "Continue to Qualification & KYC/AML"}
        </Button>
      </CardFooter>
    </Card>
  )
}
