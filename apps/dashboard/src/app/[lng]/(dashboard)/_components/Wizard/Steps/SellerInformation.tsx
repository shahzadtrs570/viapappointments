/* eslint-disable */
import { useEffect, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@package/ui/form"
import { useToast } from "@package/ui/toast"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"

import type { Owner } from "@/app/store/property/sellerInformation"

import { sellerInformation } from "@/app/store/property"
import {
  selectSellerInformation,
  selectSellerInformationLoading,
  setSellerInformation,
  updateOwner,
} from "@/app/store/property/sellerInformation"
import { useAuth } from "@/hooks/useAuth"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"
import { api } from "@/lib/trpc/react"

// Import all components, types, and helpers from centralized index
import {
  // Validation types and schemas
  getSellerInfoSchema,
  type SellerInfoData,
  type SellerInformationProps,
  type FormOwner,
  type WizardTFunction,
  // Helper functions
  splitUserName,
  STORED_OWNERS_KEY,
  MULTIPLE_OWNERS_COUNT_KEY,
  setStoredOwnersCount,
  // Components
  OwnershipSection,
  OwnerInformationForm,
  NavigationButtons,
  ChatBotSection,
  DataProtectionCard,
  AgeRequirementsCard,
  NextStepsCard,
} from "../components/SellerInformation"

export function SellerInformation({
  onSubmit,
  onBack,
  defaultValues,
  readOnly = false,
  mode = "create",
}: SellerInformationProps) {
  const { user } = useAuth()

  const [numberOfMultipleOwners, setNumberOfMultipleOwners] = useState(
    parseInt(localStorage.getItem(MULTIPLE_OWNERS_COUNT_KEY) || "2")
  )
  const { t } = useClientTranslation([
    "wizard_seller_information",
    "wizard_common",
  ])
  const { toast } = useToast()
  const dispatch = useDispatch()
  const sellerData = useSelector(selectSellerInformation)

  // Fix isLoading state to prevent stuck loading indicator
  // Don't use selector directly as it might be persisted incorrectly
  const [isLoading, setIsLoading] = useState(false)

  // Add reduxIsLoading at the component level, not inside useEffect
  const reduxIsLoading = useSelector(selectSellerInformationLoading)

  const [ownerType, setOwnerType] = useState<"single" | "couple" | "multiple">(
    defaultValues?.ownerType || sellerData?.ownerType || "single"
  )

  const defaultOwner: FormOwner = {
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    phone: "",
    useExistingAddress: false,
    address: "",
    postcode: "",
    town: "",
    county: "",
  }

  // Initialize form with user's name if available
  const initialOwner = user?.name
    ? {
        ...defaultOwner,
        ...splitUserName(user.name),
        email: user.email || "",
      }
    : defaultOwner

  // Initialize form earlier to avoid reference before definition
  const form = useForm<SellerInfoData>({
    resolver: zodResolver(getSellerInfoSchema(t as WizardTFunction)),
    defaultValues: defaultValues ||
      sellerData || {
        ownerType: "single",
        numberOfOwners: numberOfMultipleOwners,
        owners: [initialOwner],
      },
  })

  // Define the mutations before the useEffect that depends on them
  const createSellerInfo = api.property.sellerInformation.create.useMutation({
    onSuccess: (response) => {
      dispatch(
        sellerInformation.setSellerInformation({
          ownerType: response.ownerType,
          numberOfOwners: response.numberOfOwners,
          owners: response.owners.map((owner) => ({
            id: owner.id,
            firstName: owner.firstName,
            lastName: owner.lastName,
            email: owner.email,
            dateOfBirth: owner.dateOfBirth,
            createdAt: owner.createdAt.toISOString(),
            updatedAt: owner.updatedAt.toISOString(),
          })),
        })
      )
      toast({
        title: t("wizard_common:toasts.success.title"),
        description: t("wizard_seller_information:toasts.savedSuccess"),
      })
      onSubmit(form.getValues())
    },
    onError: (error) => {
      dispatch(sellerInformation.setError(error.message))
      toast({
        title: t("wizard_common:toasts.error.title"),
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const updateSellerInfo = api.property.sellerInformation.update.useMutation({
    onSuccess: (response) => {
      if (!response) return

      dispatch(
        sellerInformation.setSellerInformation({
          ownerType: response.ownerType,
          numberOfOwners: response.numberOfOwners,
          owners: response.owners.map((owner) => ({
            id: owner.id,
            firstName: owner.firstName,
            lastName: owner.lastName,
            email: owner.email,
            dateOfBirth: owner.dateOfBirth,
            createdAt: owner.createdAt.toISOString(),
            updatedAt: owner.updatedAt.toISOString(),
          })),
        })
      )
      toast({
        title: t("wizard_common:toasts.success.title"),
        description: t("wizard_seller_information:toasts.updatedSuccess"),
      })
      onSubmit(form.getValues())
    },
    onError: (error) => {
      dispatch(sellerInformation.setError(error.message))
      toast({
        title: t("wizard_common:toasts.error.title"),
        description: error.message,
        variant: "destructive",
      })
    },
  })

  // Add a more comprehensive effect to handle loading states
  useEffect(() => {
    // Force reset loading states when component mounts
    dispatch(sellerInformation.resetMetaFlags())

    // In continue-again mode, explicitly ensure we're not showing loading states
    if (readOnly) {
      setIsLoading(false)
      // Force Redux state to reflect non-loading state as well
      dispatch(sellerInformation.setLoading(false))
    }

    // Return cleanup function to reset loading states when unmounting
    return () => {
      dispatch(sellerInformation.resetMetaFlags())
    }
  }, [
    dispatch,
    readOnly,
    isLoading,
    reduxIsLoading,
    createSellerInfo.isPending,
    updateSellerInfo.isPending,
  ])

  const [isMounted, setIsMounted] = useState(false)

  // Add a watch effect to trigger validation whenever any DOB changes
  useEffect(() => {
    if (!isMounted) return

    // Get all owner DOBs from form
    const subscription = form.watch(
      (value: unknown, { name }: { name?: string }) => {
        // Only trigger validation if a date of birth field changed
        if (name && name.includes("dateOfBirth")) {
          // Use setTimeout to allow the field value to be set first
          setTimeout(() => {
            // Trigger validation on all fields to update errors
            void form.trigger()
          }, 0)
        }
      }
    ) as { unsubscribe: () => void }

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [form, isMounted])

  // Update the allOwners state initialization
  const [allOwners, setAllOwners] = useState<FormOwner[]>(() => {
    // Try to get stored owners from localStorage
    const storedOwners = localStorage.getItem(STORED_OWNERS_KEY)
    if (storedOwners) {
      try {
        return JSON.parse(storedOwners)
      } catch (e) {
        console.error(
          t("wizard_seller_information:errors.parsingStoredOwners"),
          e
        )
        return []
      }
    }
    return []
  })

  // Add an effect to save to localStorage whenever allOwners changes
  useEffect(() => {
    if (allOwners.length > 0) {
      localStorage.setItem(STORED_OWNERS_KEY, JSON.stringify(allOwners))
    }
  }, [allOwners])

  // Update the useEffect for initialization
  useEffect(() => {
    if (sellerData) {
      const owners = sellerData.owners.map((owner) => ({
        ...owner,
        email: owner.email || "", // Ensure email is always a string
        useExistingAddress: owner.useExistingAddress || false,
      }))
      setAllOwners((prev) => {
        // Merge with existing stored owners, preferring Redux data for overlapping indices
        const merged = [...prev]
        owners.forEach((owner: FormOwner, index: number) => {
          if (owner.firstName || owner.lastName) {
            merged[index] = owner
          }
        })
        return merged
      })
    } else if (defaultValues) {
      const owners = defaultValues.owners.map((owner: FormOwner) => ({
        ...owner,
        email: owner.email || "", // Ensure email is always a string
        useExistingAddress: owner.useExistingAddress || false,
      }))
      setAllOwners((prev) => {
        // Merge with existing stored owners, preferring default values for overlapping indices
        const merged = [...prev]
        owners.forEach((owner: FormOwner, index: number) => {
          if (owner.firstName || owner.lastName) {
            merged[index] = owner
          }
        })
        return merged
      })
    }
  }, [sellerData, defaultValues])

  // Add a cleanup function when the component unmounts
  useEffect(() => {
    return () => {
      // Only clear localStorage if we're actually submitting the form
      // We'll set this flag in handleFormSubmit
      if (form.formState.isSubmitSuccessful) {
        localStorage.removeItem(STORED_OWNERS_KEY)
      }
    }
  }, [form.formState.isSubmitSuccessful])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Additional effect to sync with Redux state
  useEffect(() => {
    if (sellerData && !defaultValues) {
      const formData = {
        ownerType: sellerData.ownerType,
        numberOfOwners: sellerData.numberOfOwners,
        owners: sellerData.owners.map((owner) => ({
          ...defaultOwner,
          ...owner,
          dateOfBirth: owner.dateOfBirth || "",
          useExistingAddress: owner.useExistingAddress || false,
        })),
      }
      form.reset(formData)
      setOwnerType(sellerData.ownerType)
    }
  }, [sellerData, defaultValues, form])

  // Add an effect to sync the state with localStorage changes
  useEffect(() => {
    const storedValue = localStorage.getItem(MULTIPLE_OWNERS_COUNT_KEY)
    if (storedValue) {
      const num = parseInt(storedValue)
      setNumberOfMultipleOwners(num)
    }
  }, [])

  // Update the helper function
  const createOwnerWithDefaults = (
    existingOwner?: Partial<Owner>
  ): FormOwner => ({
    ...defaultOwner,
    ...existingOwner,
    email: existingOwner?.email || "",
    useExistingAddress: existingOwner?.useExistingAddress || false,
  })

  // Update the handleNumberOfOwnersChange function
  const handleNumberOfOwnersChange = (value: string) => {
    const num = parseInt(value)

    // Get current owners and update historical data
    const existingOwners = form.getValues("owners")
    setAllOwners((prev) => {
      const newAll = [...prev]
      existingOwners.forEach((owner: FormOwner, index: number) => {
        if (owner.firstName || owner.lastName) {
          newAll[index] = {
            ...owner,
            useExistingAddress: owner.useExistingAddress || false,
          }
        }
      })
      // Update localStorage with the new data
      if (newAll.length > 0) {
        localStorage.setItem(STORED_OWNERS_KEY, JSON.stringify(newAll))
      }
      return newAll
    })

    // Create new array using historical data when available
    const newOwners: FormOwner[] = Array(num)
      .fill(null)
      .map((_, index) => allOwners[index] || createOwnerWithDefaults())

    // Update form
    form.setValue("owners", newOwners)

    // Update Redux state
    if (sellerData) {
      dispatch(
        setSellerInformation({
          ...sellerData,
          owners: newOwners.map((owner) => ({
            ...owner,
            email: owner.email || "", // Ensure email is always a string
            useExistingAddress: owner.useExistingAddress || false,
          })),
          numberOfOwners: num,
        })
      )
    } else {
      const ownerType = form.getValues("ownerType")
      dispatch(
        setSellerInformation({
          ownerType: ownerType as "single" | "couple" | "multiple",
          numberOfOwners: num,
          owners: newOwners.map((owner) => ({
            ...owner,
            email: owner.email || "", // Ensure email is always a string
            useExistingAddress: owner.useExistingAddress || false,
          })),
        })
      )
    }
  }

  // Update handleOwnerTypeChange
  const handleOwnerTypeChange = (value: "single" | "couple" | "multiple") => {
    setOwnerType(value)

    // Get current owners from form or Redux
    const existingOwners = form.getValues("owners")

    // Update allOwners with current data
    setAllOwners((prev) => {
      const newAll = [...prev]
      existingOwners.forEach((owner: FormOwner, index: number) => {
        if (owner.firstName || owner.lastName) {
          newAll[index] = {
            ...owner,
            useExistingAddress: owner.useExistingAddress || false,
          }
        }
      })
      return newAll
    })

    let newOwners: FormOwner[] = []
    let newNumberOfOwners

    if (value === "single") {
      newNumberOfOwners = 1
    } else if (value === "couple") {
      newNumberOfOwners = 2
    } else {
      newNumberOfOwners = numberOfMultipleOwners
    }

    // Use historical data when available, otherwise use defaults
    if (value === "single") {
      newOwners = [allOwners[0] || createOwnerWithDefaults()]
    } else if (value === "couple") {
      newOwners = [
        allOwners[0] || createOwnerWithDefaults(),
        allOwners[1] || createOwnerWithDefaults(),
      ]
    } else {
      newOwners = Array(newNumberOfOwners)
        .fill(null)
        .map((_, index) => allOwners[index] || createOwnerWithDefaults())
    }

    // Update form
    form.setValue("owners", newOwners)
    form.setValue("ownerType", value)
    form.setValue("numberOfOwners", newNumberOfOwners)

    // Update Redux state
    if (sellerData) {
      dispatch(
        setSellerInformation({
          ownerType: value,
          numberOfOwners: newNumberOfOwners,
          owners: newOwners.map((owner) => ({
            ...owner,
            email: owner.email || "", // Ensure email is always a string
            useExistingAddress: owner.useExistingAddress || false,
          })),
          ...(sellerData.id ? { id: sellerData.id } : {}),
          ...(sellerData.userId ? { userId: sellerData.userId } : {}),
          ...(sellerData.sellerIds ? { sellerIds: sellerData.sellerIds } : {}),
          ...(sellerData.createdAt ? { createdAt: sellerData.createdAt } : {}),
          ...(sellerData.updatedAt ? { updatedAt: sellerData.updatedAt } : {}),
        })
      )
    }
  }

  // Modified handleFormSubmit to handle edit mode
  const handleFormSubmit = async (data: SellerInfoData) => {
    if (readOnly) {
      onSubmit(data)
      return
    }

    setIsLoading(true)

    try {
      // If we're in edit mode or have defaultValues.id, use update
      if (mode === "edit" || defaultValues?.id) {
        // Get the existing seller IDs from Redux state
        const existingOwners = sellerData?.owners || []
        const primarySellerId = existingOwners[0]?.id || defaultValues?.id

        if (!primarySellerId) {
          throw new Error("No seller ID found for update")
        }

        await updateSellerInfo.mutateAsync({
          sellerId: primarySellerId,
          data: {
            ownerType: data.ownerType,
            numberOfOwners: data.owners.length,
            owners: data.owners.map((owner: FormOwner, index: number) => ({
              id: existingOwners[index]?.id,
              firstName: owner.firstName,
              lastName: owner.lastName,
              dateOfBirth: owner.dateOfBirth,
              email: owner.email || "",
              phone: owner.phone || undefined,
              address: owner.address || undefined,
              postcode: owner.postcode || undefined,
              town: owner.town || undefined,
              county: owner.county || undefined,
            })),
          },
        })
      } else {
        // Create new sellers
        await createSellerInfo.mutateAsync({
          data: {
            ownerType: data.ownerType,
            numberOfOwners: data.owners.length,
            owners: data.owners.map((owner: FormOwner) => ({
              firstName: owner.firstName,
              lastName: owner.lastName,
              dateOfBirth: owner.dateOfBirth,
              email: owner.email || "",
              phone: owner.phone || undefined,
              address: owner.address || undefined,
              postcode: owner.postcode || undefined,
              town: owner.town || undefined,
              county: owner.county || undefined,
            })),
          },
        })
      }
      // Clear localStorage only on successful submission
      localStorage.removeItem(STORED_OWNERS_KEY)
    } catch (error) {
      console.error(
        t("wizard_seller_information:errors.parsingStoredOwners"),
        error
      )
      toast({
        title: t("wizard_common:toasts.error.title"),
        description:
          error instanceof Error
            ? error.message
            : "Failed to save seller information",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Update handleFieldChange
  const handleFieldChange = (
    index: number,
    field: keyof Owner,
    value: string
  ) => {
    const currentOwners = form.getValues("owners")
    if (currentOwners[index]) {
      // Get the existing owner data from Redux if available
      const existingOwner = sellerData?.owners[index]

      // Create updated owner preserving all existing data
      const updatedOwner = {
        ...(existingOwner || {}), // Keep all existing data if available
        ...currentOwners[index], // Apply current form data
        [field]: value, // Apply new field value
        // Preserve important metadata
        id: existingOwner?.id,
        email: field === "email" ? value : currentOwners[index].email || "", // Ensure email is always a string
        createdAt: existingOwner?.createdAt,
        updatedAt: existingOwner?.updatedAt,
        useExistingAddress:
          currentOwners[index].useExistingAddress ||
          existingOwner?.useExistingAddress ||
          false,
      }

      const updatedOwners = [...currentOwners]
      updatedOwners[index] = updatedOwner

      // Update form state
      form.setValue(`owners.${index}`, updatedOwner)

      // If date of birth changed, trigger validation immediately
      if (field === "dateOfBirth") {
        setTimeout(() => {
          void form.trigger("owners")
        }, 0)
      }

      // Update historical data preserving existing data
      setAllOwners((prev) => {
        const newAll = [...prev]
        newAll[index] = {
          ...prev[index], // Keep existing historical data
          ...updatedOwner, // Apply updates
          email: updatedOwner.email || "", // Ensure email is always a string
        }
        return newAll
      })

      // If there's no data in Redux yet, initialize it
      if (!sellerData) {
        dispatch(
          setSellerInformation({
            ownerType: form.getValues("ownerType"),
            numberOfOwners: updatedOwners.length,
            owners: updatedOwners.map((owner) => ({
              ...owner,
              email: owner.email || "", // Ensure email is always a string
              useExistingAddress: owner.useExistingAddress || false,
            })),
          })
        )
      } else {
        // Update specific owner in Redux preserving existing data
        dispatch(
          updateOwner({
            index,
            owner: {
              ...updatedOwner,
              email: updatedOwner.email || "", // Ensure email is always a string
            },
          })
        )

        // Also update the full state to ensure consistency
        dispatch(
          setSellerInformation({
            ...sellerData, // Keep all existing seller data
            owners: updatedOwners.map((owner, i) => {
              const existingOwnerData = sellerData.owners[i]
              return {
                ...existingOwnerData, // Keep existing data for each owner
                ...owner, // Apply updates
                id: existingOwnerData.id, // Ensure ID is preserved
                email: owner.email || "", // Ensure email is always a string
                createdAt: existingOwnerData.createdAt,
                updatedAt: existingOwnerData.updatedAt,
                useExistingAddress:
                  owner.useExistingAddress ||
                  existingOwnerData.useExistingAddress ||
                  false,
              }
            }),
            numberOfOwners: updatedOwners.length,
          })
        )
      }
    }
  }

  // Add this effect after the other useEffect hooks
  useEffect(() => {
    // Only auto-fill if we're in create mode and don't have default values or seller data
    if (mode === "create" && !defaultValues && !sellerData && user?.name) {
      const { firstName, lastName } = splitUserName(user.name)
      form.setValue("owners.0.firstName", firstName)
      form.setValue("owners.0.lastName", lastName)
      if (user.email) {
        form.setValue("owners.0.email", user.email)
      }
    }
  }, [user, mode, defaultValues, sellerData, form])

  return (
    <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:gap-8">
      <div className="w-full lg:w-2/3">
        <div className="h-fit rounded-lg border border-border bg-card/90 p-4 shadow-md backdrop-blur-sm transition-all duration-300 hover:shadow-lg sm:p-6 lg:p-8">
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <h2 className="mb-2 text-xl font-bold text-card-foreground sm:mb-4 sm:text-2xl">
              {t("wizard_seller_information:pageTitle")}
            </h2>
            <p className="mb-4 text-sm text-muted-foreground sm:mb-6 sm:text-base">
              {t("wizard_seller_information:pageDescription")}
            </p>
          </div>

          {isMounted && (
            <Form {...form}>
              <form
                className="space-y-4 sm:space-y-6"
                onSubmit={form.handleSubmit(handleFormSubmit)}
              >
                {/* Owner Type Selection */}
                <OwnershipSection
                  form={form}
                  ownerType={ownerType}
                  numberOfMultipleOwners={numberOfMultipleOwners}
                  onOwnerTypeChange={handleOwnerTypeChange}
                  onNumberOfOwnersChange={handleNumberOfOwnersChange}
                  setStoredOwnersCount={setStoredOwnersCount}
                  setNumberOfMultipleOwners={setNumberOfMultipleOwners}
                />

                {/* Owner Information */}
                <OwnerInformationForm
                  form={form}
                  owners={form.getValues("owners")}
                  readOnly={readOnly}
                  onFieldChange={handleFieldChange}
                />

                {/* Navigation buttons */}
                <NavigationButtons
                  onBack={onBack}
                  readOnly={readOnly}
                  mode={mode}
                  isLoading={isLoading}
                  createSellerInfoPending={createSellerInfo.isPending}
                  updateSellerInfoPending={updateSellerInfo.isPending}
                />
              </form>
            </Form>
          )}
        </div>
      </div>

      {/* Assistant and additional info */}
      <div className="w-full lg:w-1/3">
        <ChatBotSection />
        <DataProtectionCard />
        <AgeRequirementsCard />
        <NextStepsCard />
      </div>
    </div>
  )
}
