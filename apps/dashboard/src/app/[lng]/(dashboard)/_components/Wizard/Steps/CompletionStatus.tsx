/* eslint-disable */
import { useEffect, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@package/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@package/ui/form"
import { Input } from "@package/ui/input"
import { RadioGroup, RadioGroupItem } from "@package/ui/radio-group"
import { Textarea } from "@package/ui/textarea"
import { useToast } from "@package/ui/toast"
import { Typography } from "@package/ui/typography"
import { useParams, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { z } from "zod"

import type { RootState } from "@/app/store"
import type { TRPCClientError } from "@trpc/client"
import config from "../../../../../../../../../rain.config"

// Import all components, types, and schemas from centralized index
import {
  // Types and schemas
  type CompletionStatusProps,
  type FinalStatus,
  type SolicitorFormData,
  type SolicitorDetails,
  type KeyContacts,
  type ProcessStatus,
  type Document,
  solicitorSchema,
  // Components
  SolicitorChoiceSection,
  SolicitorForm,
  RecommendedSolicitors,
  SavedSolicitorDetails,
  ConveyancingStatusSection,
  DocumentChecklistSection,
  KeyContactsSection,
  CustomerSupportChat,
  TimelineCard,
  NavigationButtons,
} from "../components/CompletionStatus"

import {
  clearCompletion,
  initializeCompletionIfNeeded,
  setChoice,
  updateCompletion,
  updateSolicitor,
} from "@/app/store/property/completion/slice"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"
import { api } from "@/lib/trpc/react"

export function CompletionStatus({
  onClose,
  defaultValues,
  onUpdate,
  onDelete,
  propertyId,
}: CompletionStatusProps) {
  const params = useParams()
  const searchParams = useSearchParams()
  const lng = (params?.lng as string) || "en"
  const { toast } = useToast()
  const dispatch = useDispatch()
  const { t } = useClientTranslation([
    "wizard_completion_status",
    "wizard_common",
  ])

  // All selectors must be called before any conditional returns
  const ownersInformation = useSelector(
    (state: RootState) => state.property.sellerInformation.data
  ) as {
    ownerType: string
    numberOfOwners: number
    owners: Array<{
      id?: string
      firstName: string
      lastName: string
      dateOfBirth: string
      email?: string
    }>
  } | null

  const propertyDetails = useSelector(
    (state: RootState) => state.property.propertyDetails.apiData
  )

  const completionState = useSelector(
    (state: RootState) => state.property.completion.data
  )

  // States for loading dashboard status
  const [isLoadingDashboardStatus, setIsLoadingDashboardStatus] =
    useState(false)
  const [dashboardStatusError, setDashboardStatusError] = useState<
    string | null
  >(null)
  const [dashboardData, setDashboardData] = useState<Record<
    string,
    any
  > | null>(null)
  const [keyContacts, setKeyContacts] = useState<KeyContacts | null>(null)
  const [processStatus, setProcessStatus] = useState<ProcessStatus | null>(null)
  const [documentChecklist, setDocumentChecklist] = useState<Document[] | null>(
    null
  )

  // Get propertyId from query params if in continue-again mode
  const queryPropertyId = searchParams.get("propertyId") || ""

  const resolvedPropertyId = propertyId || propertyDetails?.id || ""

  if (!resolvedPropertyId) {
    throw new Error("Property ID is required")
  }

  // Use API to fetch the dashboard status
  const dashboardStatusQuery =
    api.property.finalStatus.getDashboardStatusDetails.useQuery(
      { propertyId: resolvedPropertyId },
      {
        enabled: !!resolvedPropertyId,
      }
    )

  // Update state based on the dashboard status query
  useEffect(() => {
    if (dashboardStatusQuery.isLoading) {
      setIsLoadingDashboardStatus(true)
    }

    if (dashboardStatusQuery.isSuccess) {
      setIsLoadingDashboardStatus(false)
      const result = dashboardStatusQuery.data
      if (result) {
        setDashboardData(result?.dashboardStatus)
        // Update all states from the statusData
        if (result?.dashboardStatus?.statusData) {
          const statusData = JSON.parse(
            JSON.stringify(result.dashboardStatus.statusData)
          ) as {
            ProcessStatus: ProcessStatus
            documentChecklist: Document[]
            keyContacts: KeyContacts
          }
          const { ProcessStatus, documentChecklist, keyContacts } = statusData
          setProcessStatus(ProcessStatus)
          setDocumentChecklist(documentChecklist)
          setKeyContacts(keyContacts)
        }
      }
    }

    if (dashboardStatusQuery.isError && dashboardStatusQuery.error) {
      setIsLoadingDashboardStatus(false)
      const error = dashboardStatusQuery.error as TRPCClientError<any>
      setDashboardStatusError(
        `Error loading dashboard status: ${error.message}`
      )
      console.error("Error fetching dashboard status:", error)
    }
  }, [
    dashboardStatusQuery.status,
    dashboardStatusQuery.data,
    dashboardStatusQuery.error,
  ])

  // If still checking eligibility or user is not eligible,
  // the redirect will happen in the hook, so we can just return null

  const sellerId = ownersInformation?.owners?.[0]?.id || ""
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [solicitorChoice, setSolicitorChoice] = useState<string>(
    completionState?.choice || defaultValues?.choice || ""
  )
  const [showSolicitorForm, setShowSolicitorForm] = useState(false)
  const [showRecommendedSolicitors, setShowRecommendedSolicitors] =
    useState(false)
  const [showSavedSolicitorDetails, setShowSavedSolicitorDetails] = useState(
    !!(
      defaultValues?.solicitor ||
      (completionState?.solicitor.name &&
        completionState.solicitor.name.trim() !== "")
    )
  )

  // Define form before using it in any callbacks
  const form = useForm<SolicitorFormData>({
    resolver: zodResolver(solicitorSchema),
    mode: "all",
    defaultValues: {
      name:
        completionState?.solicitor.name || defaultValues?.solicitor.name || "",
      firmName:
        completionState?.solicitor.firmName ||
        defaultValues?.solicitor.firmName ||
        "",
      email:
        completionState?.solicitor.email ||
        defaultValues?.solicitor.email ||
        "",
      phone:
        completionState?.solicitor.phone ||
        defaultValues?.solicitor.phone ||
        "",
      address:
        completionState?.solicitor.address ||
        defaultValues?.solicitor.address ||
        "",
    },
  })

  // Define mutations after form is defined
  const createFinalStatus = api.property.finalStatus.create.useMutation({
    onSuccess: () => {
      setIsSaving(false)
      toast({
        title: t("wizard_common:toasts.success.title"),
        description: t("wizard_completion_status:toasts.statusSavedSuccess"),
      })
      const formData = form.getValues()
      onUpdate({
        choice: solicitorChoice,
        solicitor: {
          name: formData.name,
          firmName: formData.firmName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        },
        propertyId: resolvedPropertyId,
        sellerId,
      })

      dispatch(updateSolicitor(formData))
      dispatch(setChoice(solicitorChoice))
    },
    onError: (error) => {
      setIsSaving(false)
      toast({
        title: t("wizard_common:toasts.error.title"),
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const updateFinalStatus = api.property.finalStatus.update.useMutation({
    onSuccess: () => {
      setIsSaving(false)
      toast({
        title: t("wizard_common:toasts.success.title"),
        description: t("wizard_completion_status:toasts.statusUpdatedSuccess"),
      })
      const formData = form.getValues()
      onUpdate({
        choice: solicitorChoice,
        solicitor: {
          name: formData.name,
          firmName: formData.firmName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        },
        propertyId: resolvedPropertyId,
        sellerId: defaultValues?.sellerId || sellerId,
      })

      dispatch(updateSolicitor(formData))
      dispatch(setChoice(solicitorChoice))
    },
    onError: (error) => {
      setIsSaving(false)
      toast({
        title: t("wizard_common:toasts.error.title"),
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const deleteFinalStatus = api.property.finalStatus.delete.useMutation({
    onSuccess: () => {
      toast({
        title: t("wizard_common:toasts.success.title"),
        description: t("wizard_completion_status:toasts.statusDeletedSuccess"),
      })
      if (onDelete) onDelete()

      dispatch(
        updateSolicitor({
          name: "",
          firmName: "",
          email: "",
          phone: "",
          address: "",
        })
      )
    },
    onError: (error) => {
      toast({
        title: t("wizard_common:toasts.error.title"),
        description: error.message,
        variant: "destructive",
      })
    },
  })

  useEffect(() => {
    if (resolvedPropertyId && sellerId) {
      dispatch(
        initializeCompletionIfNeeded({
          propertyId: resolvedPropertyId,
          sellerId,
        })
      )
    }
  }, [dispatch, resolvedPropertyId, sellerId])

  // Add an effect to sync defaultValues with Redux on first mount
  useEffect(() => {
    // Only sync if we have defaultValues and no existing completion state
    if (
      defaultValues?.solicitor &&
      (!completionState || !completionState.solicitor?.name) &&
      // Add check to prevent unnecessary dispatches
      (!completionState?.id || completionState.id !== defaultValues.id)
    ) {
      // Store the current values to compare after dispatch
      const currentSolicitor = completionState?.solicitor || {
        name: "",
        firmName: "",
        email: "",
        phone: "",
        address: "",
      }
      const newSolicitor = defaultValues.solicitor

      // Only dispatch if the values are actually different
      const hasChanged =
        currentSolicitor.name !== newSolicitor.name ||
        currentSolicitor.firmName !== newSolicitor.firmName ||
        currentSolicitor.email !== newSolicitor.email ||
        currentSolicitor.phone !== newSolicitor.phone ||
        currentSolicitor.address !== newSolicitor.address

      if (hasChanged) {
        dispatch(
          updateCompletion({
            id: defaultValues.id,
            propertyId: defaultValues.propertyId,
            sellerId: defaultValues.sellerId,
            choice: defaultValues.choice,
            solicitor: defaultValues.solicitor,
          })
        )
      }
    }
  }, [defaultValues, completionState, dispatch])

  // First useEffect for form data
  useEffect(() => {
    if (completionState) {
      const solicitor = completionState.solicitor || {}

      // Check if we already have the same values to avoid unnecessary resets
      const currentValues = form.getValues()
      const hasFormChanged =
        currentValues.name !== (solicitor.name || "") ||
        currentValues.firmName !== (solicitor.firmName || "") ||
        currentValues.email !== (solicitor.email || "") ||
        currentValues.phone !== (solicitor.phone || "") ||
        currentValues.address !== (solicitor.address || "")

      // Only reset if values actually changed
      if (hasFormChanged) {
        form.reset(
          {
            name: solicitor.name || "",
            firmName: solicitor.firmName || "",
            email: solicitor.email || "",
            phone: solicitor.phone || "",
            address: solicitor.address || "",
          },
          { keepDirty: false, keepTouched: true }
        )
      }

      // Only update solicitorChoice if it's different from current value
      if (
        completionState.choice &&
        completionState.choice !== solicitorChoice
      ) {
        setSolicitorChoice(completionState.choice)
      }
    }
  }, [completionState, solicitorChoice, form])

  // Second useEffect for UI state updates
  useEffect(() => {
    if (!completionState) return

    const solicitor = completionState.solicitor || {}
    const hasSavedSolicitor = !!(solicitor.name && solicitor.name.trim() !== "")

    // Only update UI states if they would actually change
    if (hasSavedSolicitor !== showSavedSolicitorDetails) {
      setShowSavedSolicitorDetails(hasSavedSolicitor)
    }

    const shouldShowRecommendedSolicitors =
      completionState.choice === "recommend-solicitor" && !hasSavedSolicitor
    if (shouldShowRecommendedSolicitors !== showRecommendedSolicitors) {
      setShowRecommendedSolicitors(shouldShowRecommendedSolicitors)
    }

    // Update solicitor choice visibility
    const solicitorChoiceElement = document.getElementById("solicitor-choice")
    if (solicitorChoiceElement) {
      solicitorChoiceElement.style.display = hasSavedSolicitor
        ? "none"
        : "block"
    }
  }, [
    completionState,
    showSavedSolicitorDetails,
    showSolicitorForm,
    showRecommendedSolicitors,
  ])

  const hasSolicitor = Boolean(
    completionState?.solicitor?.name &&
      completionState.solicitor.name.trim() !== ""
  )

  const handleSolicitorChoiceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const choice = event.target.id
    setSolicitorChoice(choice)

    setShowSolicitorForm(false)
    setShowRecommendedSolicitors(false)
    setShowSavedSolicitorDetails(false)

    switch (choice) {
      case "has-solicitor":
        setShowSolicitorForm(true)
        break
      case "recommend-solicitor":
        setShowRecommendedSolicitors(true)
        break
    }

    // Update the Redux store with the user's choice
    dispatch(setChoice(choice))

    // We don't call API here anymore - just update local state and Redux
    // The API call is only made when the user actually saves their solicitor details
  }

  const handleFormInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target
    form.setValue(name as keyof SolicitorFormData, value)
  }

  // Define a form submission handler
  const onSubmit = form.handleSubmit(async (formData: SolicitorFormData) => {
    // Let React Hook Form and Zod handle validation - no manual validation needed

    setIsSaving(true)

    // Extract coSellerIds from additional owners if they exist
    const coSellerIds =
      (ownersInformation?.owners
        .slice(1) // Skip the first owner (main seller)
        .map((owner) => owner.id)
        .filter(Boolean) as string[]) || []

    const finalStatusData: FinalStatus = {
      choice: solicitorChoice,
      solicitor: {
        name: formData.name,
        firmName: formData.firmName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      },
      propertyId: resolvedPropertyId,
      sellerId,
      coSellerIds, // Add coSellerIds to the final status data
    }

    try {
      if (defaultValues?.id) {
        await updateFinalStatus.mutateAsync({
          id: defaultValues.id,
          data: finalStatusData,
        })
      } else {
        await createFinalStatus.mutateAsync(finalStatusData)
      }

      dispatch(updateSolicitor(formData))

      // Use React state instead of direct DOM manipulation
      setShowSolicitorForm(false)
      setShowSavedSolicitorDetails(true)
    } catch (error) {
      console.error("Error saving final status:", error)
      toast({
        title: "Error",
        description: "Failed to save solicitor details",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  })

  const handleEditSolicitorDetails = () => {
    // Reset form with current values before showing
    form.reset({
      name: completionState?.solicitor?.name || "",
      firmName: completionState?.solicitor?.firmName || "",
      email: completionState?.solicitor?.email || "",
      phone: completionState?.solicitor?.phone || "",
      address: completionState?.solicitor?.address || "",
    })

    // Just trigger the form visibility
    setShowSolicitorForm(true)
  }

  const handleCancelSolicitorForm = () => {
    setShowSolicitorForm(false)

    // Check if there's already solicitor data in Redux
    const hasSavedSolicitor = !!(
      completionState?.solicitor?.name &&
      completionState.solicitor.name.trim() !== ""
    )

    if (hasSavedSolicitor) {
      // If we have saved solicitor data, show it and reset form to original values
      setShowSavedSolicitorDetails(true)

      // Reset form to the original values from Redux
      form.reset({
        name: completionState.solicitor.name || "",
        firmName: completionState.solicitor.firmName || "",
        email: completionState.solicitor.email || "",
        phone: completionState.solicitor.phone || "",
        address: completionState.solicitor.address || "",
      })
    } else {
      // If no saved solicitor data, go back to selection
      setSolicitorChoice("recommend-solicitor")
      setShowRecommendedSolicitors(true)
    }
  }

  // Update the handleDeleteSolicitor to properly clear Redux state and UI
  const handleDeleteSolicitor = async () => {
    setIsDeleting(true)

    try {
      // If we have a database ID, delete from backend first
      if (defaultValues?.id) {
        await deleteFinalStatus.mutateAsync({ id: defaultValues.id })
      }

      // Always clear Redux state
      dispatch(clearCompletion())

      // Reset form data
      form.reset({
        name: "",
        firmName: "",
        email: "",
        phone: "",
        address: "",
      })

      // Reset UI state
      setShowSolicitorForm(false)
      setShowSavedSolicitorDetails(false)
      setSolicitorChoice("recommend-solicitor")
      setShowRecommendedSolicitors(true)

      // Notify parent about deletion
      if (onDelete) onDelete()

      toast({
        title: "Success",
        description: "Solicitor details deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting solicitor details:", error)
      toast({
        title: "Error",
        description: "Failed to delete solicitor details",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSelectRecommendedSolicitor = (firmName: string) => {
    form.setValue("firmName" as keyof SolicitorFormData, firmName)
    setShowRecommendedSolicitors(false)
    setShowSolicitorForm(true)

    const formData = form.getValues()
    onUpdate({
      choice: solicitorChoice,
      solicitor: {
        name: formData.name as string,
        firmName: formData.firmName as string,
        email: formData.email as string,
        phone: formData.phone as string,
        address: formData.address as string,
      },
      propertyId: resolvedPropertyId,
      sellerId,
    })

    dispatch(
      updateSolicitor({
        firmName: firmName,
      })
    )
  }

  // Update the showDeleteButton logic to only depend on Redux state
  const showDeleteButton = Boolean(
    completionState?.solicitor?.name &&
      completionState.solicitor.name.trim() !== "" &&
      (solicitorChoice === "has-solicitor" ||
        solicitorChoice === "i_have_solicitor") &&
      showSolicitorForm
  )

  // Get the query client
  const utils = api.useUtils()

  // Use the proper query with React hooks to handle success/error
  const { refetch: refreshFinalStatusFn } =
    api.property.finalStatus.getByProperty.useQuery(
      { propertyId: resolvedPropertyId },
      {
        enabled: false,
      }
    )

  const handleRefreshStatus = async () => {
    if (!resolvedPropertyId) {
      toast({
        title: "Error",
        description: "Property ID is required to refresh status",
        variant: "destructive",
      })
      return
    }

    setIsRefreshing(true)
    try {
      const { data } = await refreshFinalStatusFn()

      if (data) {
        dispatch(
          updateCompletion({
            id: data.id,
            propertyId: data.propertyId,
            sellerId: data.sellerId,
            choice: data.choice,
            solicitor: data.solicitor,
          })
        )

        // Update the form values with the latest data
        form.reset({
          name: data.solicitor.name,
          firmName: data.solicitor.firmName,
          email: data.solicitor.email,
          phone: data.solicitor.phone,
          address: data.solicitor.address,
        })

        // Update UI state
        setSolicitorChoice(data.choice)
        setShowSolicitorForm(false)
        setShowRecommendedSolicitors(false)
        setShowSavedSolicitorDetails(
          !!(data.solicitor?.name && data.solicitor.name.trim() !== "")
        )

        toast({
          title: "Success",
          description: "Status refreshed successfully",
        })
      } else {
        toast({
          title: "No solicitor details found",
          description:
            "Please select 'Yes, I have a solicitor' and add your solicitor's details to get started.",
        })

        setSolicitorChoice("has-solicitor")
        setShowSolicitorForm(true)
        setShowRecommendedSolicitors(false)
        setShowSavedSolicitorDetails(false)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  // Add this useEffect near other useEffects at the top of the component
  useEffect(() => {
    if (showSolicitorForm) {
      setShowSavedSolicitorDetails(false)
      setShowRecommendedSolicitors(false)
      setSolicitorChoice("has-solicitor")
    }
  }, [showSolicitorForm])

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:gap-8">
        <div className="w-full lg:w-2/3">
          <div className="space-y-4 rounded-lg border border-border bg-card p-3 shadow-lg sm:space-y-6 sm:p-4 md:p-6">
            <div className="mb-4 sm:mb-8">
              <Typography
                className="mb-3 text-base font-medium text-card-foreground sm:mb-4 sm:text-lg"
                variant="h3"
              >
                {t("wizard_completion_status:solicitorDetails.title")}
              </Typography>
              <Typography
                className="mb-3 text-xs text-muted-foreground sm:mb-4 sm:text-sm"
                variant="body"
              >
                {t("wizard_completion_status:solicitorDetails.description")}
              </Typography>

              {/* Solicitor Choice Section */}
              <SolicitorChoiceSection
                solicitorChoice={solicitorChoice}
                showSavedSolicitorDetails={showSavedSolicitorDetails}
                onSolicitorChoiceChange={handleSolicitorChoiceChange}
              />

              {/* Solicitor Form */}
              {showSolicitorForm && (
                <SolicitorForm
                  form={form}
                  onSubmit={onSubmit}
                  onCancel={handleCancelSolicitorForm}
                  onDelete={handleDeleteSolicitor}
                  isSaving={isSaving}
                  isDeleting={isDeleting}
                  showDeleteButton={showDeleteButton}
                  hasSolicitor={hasSolicitor}
                />
              )}

              {/* Recommended Solicitors */}
              <RecommendedSolicitors
                showRecommendedSolicitors={showRecommendedSolicitors}
                onSelectRecommendedSolicitor={handleSelectRecommendedSolicitor}
              />

              {/* Saved Solicitor Details */}
              <SavedSolicitorDetails
                form={form}
                showSavedSolicitorDetails={showSavedSolicitorDetails}
                showSolicitorForm={showSolicitorForm}
                onEditSolicitorDetails={handleEditSolicitorDetails}
              />
            </div>

            {/* Conveyancing Status Section */}
            <ConveyancingStatusSection
              processStatus={processStatus}
              isLoadingDashboardStatus={isLoadingDashboardStatus}
              dashboardStatusError={dashboardStatusError}
            />

            {/* Document Checklist Section */}
            <DocumentChecklistSection
              documentChecklist={documentChecklist}
              isLoadingDashboardStatus={isLoadingDashboardStatus}
              dashboardStatusError={dashboardStatusError}
            />

            {/* Key Contacts Section */}
            <KeyContactsSection
              keyContacts={keyContacts}
              isLoadingDashboardStatus={isLoadingDashboardStatus}
              dashboardStatusError={dashboardStatusError}
            />

            {/* Navigation Buttons */}
            <NavigationButtons
              isRefreshing={isRefreshing}
              onRefreshStatus={handleRefreshStatus}
            />
          </div>
        </div>

        <div className="w-full lg:w-1/3">
          {/* Customer Support Chat */}
          <CustomerSupportChat />

          {/* Timeline Card */}
          <TimelineCard />
        </div>
      </div>
    </div>
  )
}
