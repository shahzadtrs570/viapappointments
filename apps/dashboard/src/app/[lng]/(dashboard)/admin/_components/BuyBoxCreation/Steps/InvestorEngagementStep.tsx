/*eslint-disable @typescript-eslint/no-explicit-any */
/*eslint-disable react/jsx-max-depth */
/*eslint-disable max-lines */
/*eslint-disable @typescript-eslint/no-unnecessary-condition */
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

import type { BaseStepProps } from "../StepProps"
import type { InvestorEngagement } from "../types"

import { api } from "@/lib/trpc/react"

export function InvestorEngagementStep({
  wizardData,
  updateWizardData,
  onNext,
  onBack,
  setGuideMessage,
}: BaseStepProps) {
  // Set the guide message for this step
  useEffect(() => {
    setGuideMessage(
      "Configure how investors will engage with your Buy Box. Define access controls, investor communication preferences, subscription management details, and Q&A settings to ensure a smooth investor experience."
    )
  }, [setGuideMessage])

  // Initialize local state with existing data or defaults
  const [investorEngagement, setInvestorEngagement] =
    useState<InvestorEngagement>(
      () =>
        wizardData.investorEngagement || {
          accessControls: {
            restrictedAccess: true,
            allowedInvestorGroups: [],
            customInvitations: false,
          },
          investorCommunication: {
            initialAnnouncementSent: false,
            notifyMethod: "both",
          },
          subscriptionManagement: {
            minInvestmentAmount: 500000,
            maxTotalSubscription: 10000000,
            subscriptionDeadline: getDateInDays(30),
            earlyAccessPeriod: {
              enabled: false,
              groups: [],
            },
          },
          qAndASettings: {
            enableLiveQAndA: true,
            automatedResponses: true,
            designatedResponders: [],
          },
        }
    )

  const [isLoading, setIsLoading] = useState(false)

  // API mutation
  const updateInvestorEngagementMutation =
    api.admin.buyBoxCreation.updateInvestorEngagement.useMutation()

  // Helper to get date string for n days in the future
  function getDateInDays(days: number): string {
    const date = new Date()
    date.setDate(date.getDate() + days)
    return date.toISOString().split("T")[0]
  }

  // Handle access controls changes
  const handleAccessControlChange = (
    field: string,
    value: boolean | string[]
  ) => {
    setInvestorEngagement((prev) => ({
      ...prev,
      accessControls: {
        ...prev.accessControls,
        [field]: value,
      },
    }))
  }

  // Handle investor groups input
  const handleInvestorGroupsInput = (value: string) => {
    const groups = value
      .split(",")
      .map((group) => group.trim())
      .filter(Boolean)

    handleAccessControlChange("allowedInvestorGroups", groups)
  }

  // Handle investor communication changes
  const handleCommunicationChange = (field: string, value: any) => {
    setInvestorEngagement((prev) => ({
      ...prev,
      investorCommunication: {
        ...prev.investorCommunication,
        [field]: value,
      },
    }))
  }

  // Handle subscription management changes
  const handleSubscriptionChange = (field: string, value: any) => {
    setInvestorEngagement((prev) => ({
      ...prev,
      subscriptionManagement: {
        ...prev.subscriptionManagement,
        [field]: value,
      },
    }))
  }

  // Handle early access period settings
  const handleEarlyAccessChange = (field: string, value: any) => {
    setInvestorEngagement((prev) => {
      const currentEarlyAccessPeriod = prev.subscriptionManagement
        .earlyAccessPeriod || {
        enabled: false,
        groups: [],
      }

      return {
        ...prev,
        subscriptionManagement: {
          ...prev.subscriptionManagement,
          earlyAccessPeriod: {
            ...currentEarlyAccessPeriod,
            [field]: value,
          },
        },
      }
    })
  }

  // Handle early access groups input
  const handleEarlyAccessGroupsInput = (value: string) => {
    const groups = value
      .split(",")
      .map((group) => group.trim())
      .filter(Boolean)

    handleEarlyAccessChange("groups", groups)
  }

  // Handle Q&A settings changes
  const handleQAndAChange = (field: string, value: any) => {
    setInvestorEngagement((prev) => ({
      ...prev,
      qAndASettings: {
        ...prev.qAndASettings,
        [field]: value,
      },
    }))
  }

  // Handle designated responders input
  const handleDesignatedRespondersInput = (value: string) => {
    const responders = value
      .split(",")
      .map((responder) => responder.trim())
      .filter(Boolean)

    handleQAndAChange("designatedResponders", responders)
  }

  // Handle form submission
  const handleContinue = () => {
    // Validation
    if (investorEngagement.subscriptionManagement.minInvestmentAmount <= 0) {
      alert("Minimum investment amount must be greater than zero")
      return
    }

    if (investorEngagement.subscriptionManagement.maxTotalSubscription <= 0) {
      alert("Maximum total subscription must be greater than zero")
      return
    }

    if (
      investorEngagement.subscriptionManagement.minInvestmentAmount >
      investorEngagement.subscriptionManagement.maxTotalSubscription
    ) {
      alert(
        "Minimum investment amount cannot be greater than maximum total subscription"
      )
      return
    }

    // Save data and move to next step
    updateWizardData({ investorEngagement })

    // Call API to update investor engagement
    setIsLoading(true)
    updateInvestorEngagementMutation.mutate(
      {
        buyBoxId: localStorage.getItem("buyBoxId") || "", // TODO: make dynamic
        data: investorEngagement,
      },
      {
        onSuccess: () => {
          setIsLoading(false)
          onNext()
        },
        onError: (error) => {
          console.error("Error updating investor engagement:", error)
          setIsLoading(false)
          alert("Error updating investor engagement. Please try again.")
        },
      }
    )
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">
          Investor Engagement & Subscription
        </CardTitle>
        <CardDescription>
          Configure access controls, investor communications, and subscription
          management settings
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary of Buy-Box */}
        {wizardData.buyBoxTheme && (
          <div className="rounded-md border border-border bg-muted/20 p-4">
            <h3 className="mb-2 text-lg font-medium">Buy Box Summary</h3>
            <div className="grid gap-2 md:grid-cols-2">
              <div>
                <span className="font-medium">Name:</span>{" "}
                {wizardData.buyBoxTheme.name}
              </div>
              <div>
                <span className="font-medium">Total Value:</span>{" "}
                {wizardData.financialModel &&
                  formatCurrency(
                    wizardData.financialModel.pricing.totalInvestmentPrice
                  )}
              </div>
              <div>
                <span className="font-medium">Target Yield:</span>{" "}
                {wizardData.financialModel &&
                  `${wizardData.financialModel.expectedReturns.targetYield}%`}
              </div>
              <div>
                <span className="font-medium">Properties:</span>{" "}
                {wizardData.selectedProperties?.length || 0}
              </div>
            </div>
          </div>
        )}

        {/* Access Controls */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Access Controls</h3>
          <div className="rounded-md border border-border p-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={investorEngagement.accessControls.restrictedAccess}
                  id="restricted-access"
                  onCheckedChange={(checked) =>
                    handleAccessControlChange(
                      "restrictedAccess",
                      checked === true
                    )
                  }
                />
                <Label className="font-medium" htmlFor="restricted-access">
                  Restricted Access
                </Label>
              </div>
              <p className="ml-6 text-sm text-muted-foreground">
                Limit access to specific investor groups rather than making it
                available to all platform users
              </p>

              {investorEngagement.accessControls.restrictedAccess && (
                <div className="ml-6 space-y-2">
                  <Label htmlFor="investor-groups">
                    Allowed Investor Groups (comma-separated)
                  </Label>
                  <Input
                    id="investor-groups"
                    placeholder="e.g., Pension Funds, Family Offices, Institutional Investors"
                    value={
                      investorEngagement.accessControls.allowedInvestorGroups?.join(
                        ", "
                      ) || ""
                    }
                    onChange={(e) => handleInvestorGroupsInput(e.target.value)}
                  />
                </div>
              )}

              <div className="mt-4 flex items-center space-x-2">
                <Checkbox
                  checked={investorEngagement.accessControls.customInvitations}
                  id="custom-invitations"
                  onCheckedChange={(checked) =>
                    handleAccessControlChange(
                      "customInvitations",
                      checked === true
                    )
                  }
                />
                <Label className="font-medium" htmlFor="custom-invitations">
                  Enable Custom Invitations
                </Label>
              </div>
              <p className="ml-6 text-sm text-muted-foreground">
                Allow sending personalized invitations to specific investors
                outside of defined groups
              </p>
            </div>
          </div>
        </div>

        {/* Investor Communication */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Investor Communication</h3>
          <div className="rounded-md border border-border p-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="announcement-sent"
                  checked={
                    investorEngagement.investorCommunication
                      .initialAnnouncementSent
                  }
                  onCheckedChange={(checked) =>
                    handleCommunicationChange(
                      "initialAnnouncementSent",
                      checked === true
                    )
                  }
                />
                <Label className="font-medium" htmlFor="announcement-sent">
                  Initial Announcement Sent
                </Label>
              </div>

              {investorEngagement.investorCommunication
                .initialAnnouncementSent && (
                <div className="ml-6 space-y-2">
                  <Label htmlFor="announcement-date">Announcement Date</Label>
                  <Input
                    id="announcement-date"
                    type="date"
                    value={
                      investorEngagement.investorCommunication
                        .announcementDate || ""
                    }
                    onChange={(e) =>
                      handleCommunicationChange(
                        "announcementDate",
                        e.target.value
                      )
                    }
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="custom-message">Custom Message</Label>
                <Textarea
                  className="min-h-[100px]"
                  id="custom-message"
                  placeholder="Enter a custom message to send to investors about this Buy Box..."
                  value={
                    investorEngagement.investorCommunication.customMessage || ""
                  }
                  onChange={(e) =>
                    handleCommunicationChange("customMessage", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notify-method">Notification Method</Label>
                <Select
                  value={investorEngagement.investorCommunication.notifyMethod}
                  onValueChange={(value) =>
                    handleCommunicationChange("notifyMethod", value)
                  }
                >
                  <SelectTrigger id="notify-method">
                    <SelectValue placeholder="Select notification method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email Only</SelectItem>
                    <SelectItem value="platform">
                      Platform Notification Only
                    </SelectItem>
                    <SelectItem value="both">
                      Both Email and Platform
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Management */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Subscription Management</h3>
          <div className="rounded-md border border-border p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="min-investment">
                  Minimum Investment Amount (£)
                </Label>
                <Input
                  id="min-investment"
                  min={0}
                  step={10000}
                  type="number"
                  value={
                    investorEngagement.subscriptionManagement
                      .minInvestmentAmount
                  }
                  onChange={(e) =>
                    handleSubscriptionChange(
                      "minInvestmentAmount",
                      parseInt(e.target.value)
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-subscription">
                  Maximum Total Subscription (£)
                </Label>
                <Input
                  id="max-subscription"
                  min={0}
                  step={100000}
                  type="number"
                  value={
                    investorEngagement.subscriptionManagement
                      .maxTotalSubscription
                  }
                  onChange={(e) =>
                    handleSubscriptionChange(
                      "maxTotalSubscription",
                      parseInt(e.target.value)
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subscription-deadline">
                  Subscription Deadline
                </Label>
                <Input
                  id="subscription-deadline"
                  type="date"
                  value={
                    investorEngagement.subscriptionManagement
                      .subscriptionDeadline
                  }
                  onChange={(e) =>
                    handleSubscriptionChange(
                      "subscriptionDeadline",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="flex items-center space-x-2 self-end">
                <Checkbox
                  id="early-access"
                  checked={
                    investorEngagement.subscriptionManagement.earlyAccessPeriod
                      ?.enabled
                  }
                  onCheckedChange={(checked) =>
                    handleEarlyAccessChange("enabled", checked === true)
                  }
                />
                <Label className="font-medium" htmlFor="early-access">
                  Enable Early Access Period
                </Label>
              </div>
            </div>

            {investorEngagement.subscriptionManagement.earlyAccessPeriod
              ?.enabled && (
              <div className="mt-4 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="early-start">Early Access Start Date</Label>
                    <Input
                      id="early-start"
                      type="date"
                      value={
                        investorEngagement.subscriptionManagement
                          .earlyAccessPeriod?.startDate || ""
                      }
                      onChange={(e) =>
                        handleEarlyAccessChange("startDate", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="early-end">Early Access End Date</Label>
                    <Input
                      id="early-end"
                      type="date"
                      value={
                        investorEngagement.subscriptionManagement
                          .earlyAccessPeriod?.endDate || ""
                      }
                      onChange={(e) =>
                        handleEarlyAccessChange("endDate", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="early-groups">
                    Early Access Groups (comma-separated)
                  </Label>
                  <Input
                    id="early-groups"
                    placeholder="e.g., VIP Investors, Founding Members, Key Institutional Partners"
                    value={
                      investorEngagement.subscriptionManagement.earlyAccessPeriod?.groups?.join(
                        ", "
                      ) || ""
                    }
                    onChange={(e) =>
                      handleEarlyAccessGroupsInput(e.target.value)
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Q&A Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Q&A Settings</h3>
          <div className="rounded-md border border-border p-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={investorEngagement.qAndASettings.enableLiveQAndA}
                  id="live-qanda"
                  onCheckedChange={(checked) =>
                    handleQAndAChange("enableLiveQAndA", checked === true)
                  }
                />
                <Label className="font-medium" htmlFor="live-qanda">
                  Enable Live Q&A
                </Label>
              </div>
              <p className="ml-6 text-sm text-muted-foreground">
                Allow investors to ask questions directly through the platform
              </p>

              <div className="mt-2 flex items-center space-x-2">
                <Checkbox
                  checked={investorEngagement.qAndASettings.automatedResponses}
                  id="automated-responses"
                  onCheckedChange={(checked) =>
                    handleQAndAChange("automatedResponses", checked === true)
                  }
                />
                <Label className="font-medium" htmlFor="automated-responses">
                  Enable Automated Responses
                </Label>
              </div>
              <p className="ml-6 text-sm text-muted-foreground">
                Use AI to provide immediate answers to common investor questions
              </p>

              <div className="space-y-2">
                <Label htmlFor="designated-responders">
                  Designated Responders (comma-separated)
                </Label>
                <Input
                  id="designated-responders"
                  placeholder="e.g., john.smith@example.com, emma.jones@example.com"
                  value={
                    investorEngagement.qAndASettings.designatedResponders?.join(
                      ", "
                    ) || ""
                  }
                  onChange={(e) =>
                    handleDesignatedRespondersInput(e.target.value)
                  }
                />
                <p className="text-sm text-muted-foreground">
                  List team members who should receive and respond to investor
                  queries
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Platform Listing
        </Button>
        <Button
          className="w-[300px]"
          disabled={isLoading}
          onClick={handleContinue}
        >
          {isLoading ? "Saving..." : "Continue to Capital Deployment"}
        </Button>
      </CardFooter>
    </Card>
  )
}
