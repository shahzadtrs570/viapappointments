/*eslint-disable react/jsx-max-depth */
/*eslint-disable @typescript-eslint/no-explicit-any */
/*eslint-disable max-lines */
/*eslint-disable  @typescript-eslint/no-unnecessary-condition */
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
import { Textarea } from "@package/ui/textarea"
import { useToast } from "@package/ui/toast"

import type { BaseStepProps } from "../StepProps"
import type { PlatformTrainingAndOnboarding } from "../types"

import { api } from "@/lib/trpc/react"

// Add interface for API expected format
interface PlatformTrainingApiData {
  hasCompletedPlatformOrientation: boolean
  hasCompletedInvestmentWorkshop: boolean
  hasCompletedPortfolioManagementTraining: boolean
  hasSetupAccount: boolean
  hasSetupNotifications: boolean
  hasSetupAdditionalUsers: boolean
  hasCompletedDashboardTour: boolean
  technicalContactName: string
  technicalContactEmail: string
  additionalTrainingRequested?: string
  hasTestedInvestmentSimulation: boolean
  scheduledPersonalTraining: boolean
}

export function PlatformTrainingAndTechnicalOnboardingStep({
  wizardData,
  updateWizardData,
  onNext,
  onBack,
  setGuideMessage,
}: BaseStepProps) {
  // Set the guide message for this step
  useEffect(() => {
    setGuideMessage(
      "To ensure you can make the most of our platform, we'll help you set up user accounts, access permissions, and provide comprehensive training on platform features and tools."
    )
  }, [setGuideMessage])

  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Query to get existing data for this step
  const stepDataQuery = api.buyer.getStepData.useQuery({
    step: "platformTraining" as const,
  }) as any // Type assertion to bypass TypeScript error

  // Handle successful data fetch
  useEffect(() => {
    if (stepDataQuery.data) {
      // Only set the data if we don't already have it in the wizard
      if (!wizardData.platformTraining) {
        const data = stepDataQuery.data as PlatformTrainingAndOnboarding
        updateWizardData({ platformTraining: data })
        setTrainingData(data)
      }
    }
  }, [stepDataQuery.data, updateWizardData, wizardData.platformTraining])

  // Handle query errors
  useEffect(() => {
    if (stepDataQuery.error) {
      console.error(
        "Error fetching platform training data:",
        stepDataQuery.error
      )
      toast({
        title: "Error loading data",
        description: "Could not load your saved platform training information.",
        variant: "destructive",
      })
    }
  }, [stepDataQuery.error, toast])

  // Mutation to save data
  const savePlatformTraining = api.buyer.submitPlatformTraining.useMutation({
    onSuccess: () => {
      toast({
        title: "Training data saved",
        description:
          "Your platform training and technical setup information has been saved.",
      })
      onNext()
    },
    onError: (error) => {
      toast({
        title: "Error saving data",
        description:
          error.message ||
          "Could not save platform training data. Please try again.",
        variant: "destructive",
      })
    },
  })

  // Initialize local state with existing data or defaults
  const [trainingData, setTrainingData] =
    useState<PlatformTrainingAndOnboarding>(
      () =>
        wizardData.platformTraining || {
          userAccounts: {
            primaryAdminCreated: false,
            additionalUsersCreated: false,
            numberOfUsers: 1,
            rolesAssigned: false,
            twoFactorEnabled: false,
          },
          accessPermissions: {
            dataRoomAccess: true,
            reportingAccess: true,
            transactionAccess: false,
            adminRights: false,
            customPermissions: [],
          },
          trainingCompleted: {
            platformOverview: false,
            portfolioManagement: false,
            reportingDashboards: false,
            complianceTools: false,
            dataRoomUsage: false,
            analyticTools: false,
          },
          technicalContact: {
            name: "",
            email: "",
            phone: "",
          },
          onboardingNotes: "",
          portfolioMonitoring: {
            alertsConfigured: false,
          },
        }
    )

  // Update local state when wizardData changes
  useEffect(() => {
    if (wizardData.platformTraining) {
      setTrainingData(wizardData.platformTraining)
    }
  }, [wizardData.platformTraining])

  // Handle user accounts changes
  const handleUserAccountsChange = (field: string, value: boolean | number) => {
    setTrainingData((prev) => ({
      ...prev,
      userAccounts: {
        ...prev.userAccounts,
        [field]: value,
      },
    }))
  }

  // Handle access permissions changes
  const handleAccessPermissionsChange = (field: string, value: boolean) => {
    setTrainingData((prev) => ({
      ...prev,
      accessPermissions: {
        ...prev.accessPermissions,
        [field]: value,
      },
    }))
  }

  // Handle custom permissions input
  const handleCustomPermissionsInput = (value: string) => {
    const permissions = value
      .split(",")
      .map((permission) => permission.trim())
      .filter(Boolean)

    setTrainingData((prev) => ({
      ...prev,
      accessPermissions: {
        ...prev.accessPermissions,
        customPermissions: permissions,
      },
    }))
  }

  // Handle training completed changes
  const handleTrainingCompletedChange = (field: string, value: boolean) => {
    setTrainingData((prev) => ({
      ...prev,
      trainingCompleted: {
        ...prev.trainingCompleted,
        [field]: value,
      },
    }))
  }

  // Handle technical contact changes
  const handleTechnicalContactChange = (field: string, value: string) => {
    setTrainingData((prev) => ({
      ...prev,
      technicalContact: {
        ...prev.technicalContact,
        [field]: value,
      },
    }))
  }

  // Handle form submission - updated to use API
  const handleContinue = () => {
    // Validation
    if (!trainingData.technicalContact.name) {
      toast({
        title: "Contact required",
        description: "Please provide a technical contact name",
        variant: "destructive",
      })
      return
    }

    if (!trainingData.technicalContact.email) {
      toast({
        title: "Email required",
        description: "Please provide a technical contact email",
        variant: "destructive",
      })
      return
    }

    // Save data locally in the wizard
    updateWizardData({ platformTraining: trainingData })

    // Convert local data format to API expected format
    const apiData: PlatformTrainingApiData = {
      hasCompletedPlatformOrientation:
        trainingData.trainingCompleted.platformOverview,
      hasCompletedInvestmentWorkshop: false,
      hasCompletedPortfolioManagementTraining:
        trainingData.trainingCompleted.portfolioManagement,
      hasSetupAccount: trainingData.userAccounts.primaryAdminCreated,
      hasSetupNotifications:
        trainingData.portfolioMonitoring?.alertsConfigured ?? false,
      hasSetupAdditionalUsers: trainingData.userAccounts.additionalUsersCreated,
      hasCompletedDashboardTour:
        trainingData.trainingCompleted.reportingDashboards,
      technicalContactName: trainingData.technicalContact.name,
      technicalContactEmail: trainingData.technicalContact.email,
      additionalTrainingRequested: trainingData.onboardingNotes || undefined,
      hasTestedInvestmentSimulation: false,
      scheduledPersonalTraining: false,
    }

    // Save data via API
    setIsLoading(true)
    savePlatformTraining.mutate(apiData, {
      onSettled: () => setIsLoading(false),
    })
  }

  // Calculate training completion percentage
  const calculateTrainingCompletion = (): number => {
    const totalTrainingItems = Object.keys(
      trainingData.trainingCompleted
    ).length
    const completedItems = Object.values(trainingData.trainingCompleted).filter(
      (value) => value === true
    ).length

    return totalTrainingItems > 0
      ? Math.round((completedItems / totalTrainingItems) * 100)
      : 0
  }

  // Get training status based on completion percentage
  const getTrainingStatus = (): "not-started" | "in-progress" | "completed" => {
    const completion = calculateTrainingCompletion()
    if (completion === 0) return "not-started"
    if (completion === 100) return "completed"
    return "in-progress"
  }

  // Get training status badge
  const getTrainingStatusBadge = () => {
    const status = getTrainingStatus()
    switch (status) {
      case "not-started":
        return (
          <Badge className="bg-muted text-muted-foreground">Not Started</Badge>
        )
      case "in-progress":
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400">
            In Progress
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
            Completed
          </Badge>
        )
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">
          Platform Training & Technical Onboarding
        </CardTitle>
        <CardDescription>
          Set up user accounts, permissions, and complete platform training
        </CardDescription>
        {stepDataQuery.isLoading && (
          <p className="text-sm text-muted-foreground">Loading your data...</p>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* User Accounts Setup */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">User Accounts Setup</h3>
            {trainingData.userAccounts.primaryAdminCreated ? (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                Admin Created
              </Badge>
            ) : (
              <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400">
                Pending
              </Badge>
            )}
          </div>

          <div className="rounded-md border border-border p-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={trainingData.userAccounts.primaryAdminCreated}
                  id="primary-admin"
                  onCheckedChange={(checked) =>
                    handleUserAccountsChange(
                      "primaryAdminCreated",
                      checked === true
                    )
                  }
                />
                <Label className="font-medium" htmlFor="primary-admin">
                  Primary Administrator Account Created
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={trainingData.userAccounts.additionalUsersCreated}
                  id="additional-users"
                  onCheckedChange={(checked) =>
                    handleUserAccountsChange(
                      "additionalUsersCreated",
                      checked === true
                    )
                  }
                />
                <Label className="font-medium" htmlFor="additional-users">
                  Additional User Accounts Created
                </Label>
              </div>

              {trainingData.userAccounts.additionalUsersCreated && (
                <div className="ml-6 space-y-2">
                  <Label htmlFor="number-users">Total Number of Users</Label>
                  <Input
                    id="number-users"
                    max={50}
                    min={1}
                    type="number"
                    value={trainingData.userAccounts.numberOfUsers}
                    onChange={(e) =>
                      handleUserAccountsChange(
                        "numberOfUsers",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={trainingData.userAccounts.rolesAssigned}
                  id="roles-assigned"
                  onCheckedChange={(checked) =>
                    handleUserAccountsChange("rolesAssigned", checked === true)
                  }
                />
                <Label className="font-medium" htmlFor="roles-assigned">
                  User Roles & Permissions Assigned
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={trainingData.userAccounts.twoFactorEnabled}
                  id="two-factor"
                  onCheckedChange={(checked) =>
                    handleUserAccountsChange(
                      "twoFactorEnabled",
                      checked === true
                    )
                  }
                />
                <Label className="font-medium" htmlFor="two-factor">
                  Two-Factor Authentication Enabled
                </Label>
              </div>
            </div>
          </div>
        </div>

        {/* Access Permissions */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Access Permissions</h3>

          <div className="rounded-md border border-border p-4">
            <div className="mb-4 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={trainingData.accessPermissions.dataRoomAccess}
                  id="data-room"
                  onCheckedChange={(checked) =>
                    handleAccessPermissionsChange(
                      "dataRoomAccess",
                      checked === true
                    )
                  }
                />
                <Label htmlFor="data-room">Data Room Access</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={trainingData.accessPermissions.reportingAccess}
                  id="reporting-access"
                  onCheckedChange={(checked) =>
                    handleAccessPermissionsChange(
                      "reportingAccess",
                      checked === true
                    )
                  }
                />
                <Label htmlFor="reporting-access">
                  Reporting & Analytics Access
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={trainingData.accessPermissions.transactionAccess}
                  id="transaction-access"
                  onCheckedChange={(checked) =>
                    handleAccessPermissionsChange(
                      "transactionAccess",
                      checked === true
                    )
                  }
                />
                <Label htmlFor="transaction-access">
                  Transaction Management Access
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={trainingData.accessPermissions.adminRights}
                  id="admin-rights"
                  onCheckedChange={(checked) =>
                    handleAccessPermissionsChange(
                      "adminRights",
                      checked === true
                    )
                  }
                />
                <Label htmlFor="admin-rights">Admin Rights</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-permissions">
                Custom Permissions (comma-separated)
              </Label>
              <Input
                id="custom-permissions"
                placeholder="e.g., API access, developer tools, audit logs"
                value={
                  trainingData.accessPermissions.customPermissions?.join(
                    ", "
                  ) || ""
                }
                onChange={(e) => handleCustomPermissionsInput(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Training Completed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Training Completed</h3>
            {getTrainingStatusBadge()}
          </div>

          <div className="rounded-md border border-border p-4">
            <div className="mb-4 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={trainingData.trainingCompleted.platformOverview}
                  id="platform-overview"
                  onCheckedChange={(checked) =>
                    handleTrainingCompletedChange(
                      "platformOverview",
                      checked === true
                    )
                  }
                />
                <Label htmlFor="platform-overview">Platform Overview</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={trainingData.trainingCompleted.portfolioManagement}
                  id="portfolio-management"
                  onCheckedChange={(checked) =>
                    handleTrainingCompletedChange(
                      "portfolioManagement",
                      checked === true
                    )
                  }
                />
                <Label htmlFor="portfolio-management">
                  Portfolio Management
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={trainingData.trainingCompleted.reportingDashboards}
                  id="reporting-dashboards"
                  onCheckedChange={(checked) =>
                    handleTrainingCompletedChange(
                      "reportingDashboards",
                      checked === true
                    )
                  }
                />
                <Label htmlFor="reporting-dashboards">
                  Reporting Dashboards
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={trainingData.trainingCompleted.complianceTools}
                  id="compliance-tools"
                  onCheckedChange={(checked) =>
                    handleTrainingCompletedChange(
                      "complianceTools",
                      checked === true
                    )
                  }
                />
                <Label htmlFor="compliance-tools">Compliance Tools</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={trainingData.trainingCompleted.dataRoomUsage}
                  id="data-room-usage"
                  onCheckedChange={(checked) =>
                    handleTrainingCompletedChange(
                      "dataRoomUsage",
                      checked === true
                    )
                  }
                />
                <Label htmlFor="data-room-usage">Data Room Usage</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={trainingData.trainingCompleted.analyticTools}
                  id="analytic-tools"
                  onCheckedChange={(checked) =>
                    handleTrainingCompletedChange(
                      "analyticTools",
                      checked === true
                    )
                  }
                />
                <Label htmlFor="analytic-tools">
                  Analytics & Financial Tools
                </Label>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium">Training Completion</span>
                <span className="text-sm font-medium">
                  {calculateTrainingCompletion()}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: `${calculateTrainingCompletion()}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Technical Contact */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Technical Contact</h3>

          <div className="rounded-md border border-border p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contact-name">Contact Name</Label>
                <Input
                  id="contact-name"
                  placeholder="e.g., John Smith"
                  value={trainingData.technicalContact.name}
                  onChange={(e) =>
                    handleTechnicalContactChange("name", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-email">Email Address</Label>
                <Input
                  id="contact-email"
                  placeholder="e.g., john.smith@example.com"
                  type="email"
                  value={trainingData.technicalContact.email}
                  onChange={(e) =>
                    handleTechnicalContactChange("email", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-phone">Phone Number (Optional)</Label>
                <Input
                  id="contact-phone"
                  placeholder="e.g., +44 20 1234 5678"
                  value={trainingData.technicalContact.phone || ""}
                  onChange={(e) =>
                    handleTechnicalContactChange("phone", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Onboarding Notes</h3>

          <div className="space-y-2">
            <Label htmlFor="onboarding-notes">
              Additional Notes or Special Requirements
            </Label>
            <Textarea
              className="min-h-[100px]"
              id="onboarding-notes"
              placeholder="Enter any additional notes about platform requirements, training needs, or technical specifications..."
              value={trainingData.onboardingNotes || ""}
              onChange={(e) =>
                setTrainingData((prev) => ({
                  ...prev,
                  onboardingNotes: e.target.value,
                }))
              }
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button disabled={isLoading} variant="outline" onClick={onBack}>
          Back to Investor Profile
        </Button>
        <Button
          className="w-[300px]"
          disabled={isLoading}
          onClick={handleContinue}
        >
          {isLoading ? "Saving..." : "Continue to Buy Box Allocation"}
        </Button>
      </CardFooter>
    </Card>
  )
}
