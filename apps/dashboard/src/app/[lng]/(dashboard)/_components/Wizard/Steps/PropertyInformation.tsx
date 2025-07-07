/* eslint-disable */

import { useEffect, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@package/ui/form"
import { useToast } from "@package/ui/toast"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"

import type { RootState } from "@/app/store"

import {
  addFeature,
  addPhoto,
  addTempDocument,
  clearTempDocuments,
  convertTempToPermanent,
  removeDocument,
  removeFeature,
  setAddress,
  setAddressData,
  setApiData,
  setBathrooms,
  setBedrooms,
  setCondition,
  setConditionNotes,
  setCounty,
  setEstimatedValue,
  setLeaseLength,
  setPostcode,
  setPropertySize,
  setPropertyStatus,
  setPropertyType,
  setTown,
  setYearBuilt,
} from "@/app/store/property/propertyDetails"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"
import { api } from "@/lib/trpc/react"

// Import all components, types, and helpers from centralized index
import {
  // Validation types and schemas
  getPropertySchema,
  type PropertyInfoData,
  type PropertyInformationProps,
  type PropertyInfoTFunction,
  type PropertyDetailsForm,
  type PropertyTypeInput,
  type PropertyStatusInput,
  type BedroomCountInput,
  type BathroomCountInput,
  type PropertyConditionInput,
  type PropertyFeatureInput,
  // Helper functions
  convertSqMeterToSqFeet,
  convertSqFeetToSqMeter,
  formatApiDataForRedux,
  updateManualAddressData,
  mapRightmovePropertyType,
  mapRightmoveTenure,
  mapRightmoveCondition,
  // Document helpers
  fileToBase64,
  TEMP_FILES_STORAGE_KEY,
  loadTempFilesFromStorage,
  saveTempFilesToStorage,
  clearTempFilesStorage,
  formatFileName,
  isDuplicateDocument,
  // Components
  AddressSearchSection,
  PropertyLocationSection,
  PropertyTypeSection,
  PropertyStatusSection,
  PropertyDetailsSection,
  PropertyConditionSection,
  DocumentUploadSection,
  NavigationButtons,
  ChatBotSection,
  SidebarCards,
  // Additional types
  type StoredTempFile,
  type RightmoveResponse,
} from "../components/PropertyInformation"

export function PropertyInformation({
  onSubmit,
  onBack,
  defaultValues,
  readOnly = false,
  mode = "create",
}: PropertyInformationProps) {
  const { toast } = useToast()
  const { t } = useClientTranslation([
    "wizard_property_information",
    "wizard_common",
  ])
  const dispatch = useDispatch()
  const formData = useSelector(
    (state: RootState) => state.property.propertyDetails.formData
  )

  // State for square feet property size
  const [propertySizeSqFt, setPropertySizeSqFt] = useState("")

  // Get owner IDs from the Redux store
  const ownersInformation = useSelector(
    (state: RootState) => state.property.sellerInformation.data
  )

  // Get API data to check for existing seller relationships
  const existingApiData = useSelector(
    (state: RootState) => state.property.propertyDetails.apiData
  )

  const [showDocumentUpload, setShowDocumentUpload] = useState(() => {
    if (existingApiData?.showDocumentUpload !== undefined) {
      return existingApiData.showDocumentUpload
    }
    if (typeof window !== "undefined") {
      const savedPreference = localStorage.getItem(
        "property_document_upload_preference"
      )
      return savedPreference === "true"
    }
    return false
  })

  const [showLeaseholdDetails, setShowLeaseholdDetails] = useState(
    formData.propertyStatus === "leasehold"
  )
  const [isManualEntry, setIsManualEntry] = useState(false)
  const [addressSearch, setAddressSearch] = useState("")
  const [fullAddressData, setFullAddressData] = useState<Record<
    string,
    unknown
  > | null>(null)
  const [manualAddressData, setManualAddressData] = useState<Record<
    string,
    unknown
  > | null>(null)

  const form = useForm<PropertyDetailsForm>({
    resolver: zodResolver(getPropertySchema(t as PropertyInfoTFunction)),
    defaultValues: {
      ...defaultValues,
      features: defaultValues?.features || [],
    },
  })
  const { setValue } = form

  const createProperty = api.property.details.create.useMutation({
    onSuccess: (data) => {
      const formattedData = formatApiDataForRedux(data)
      dispatch(setApiData(formattedData))
      toast({
        title: "Success",
        description: "Property details saved successfully",
      })
      onSubmit(formData as PropertyInfoData)
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const updateProperty = api.property.details.update.useMutation({
    onSuccess: (data) => {
      const formattedData = formatApiDataForRedux(data)
      dispatch(setApiData(formattedData))
      toast({
        title: "Success",
        description: "Property details updated successfully",
      })
      onSubmit(formData as PropertyInfoData)
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  // Handler functions
  const handlePostcodeChange = (value: string) => {
    dispatch(setPostcode(value))
    updateManualAddressData(setManualAddressData, "postcode", value)
  }

  const handleTownChange = (value: string) => {
    dispatch(setTown(value))
    updateManualAddressData(setManualAddressData, "town", value)
  }

  const handleCountyChange = (value: string) => {
    dispatch(setCounty(value))
    updateManualAddressData(setManualAddressData, "county", value)
  }

  const handlePropertyTypeChange = (value: PropertyTypeInput) => {
    dispatch(setPropertyType(value))
    updateManualAddressData(setManualAddressData, "propertyType", value)
  }

  const handlePropertyStatusChange = (value: PropertyStatusInput) => {
    dispatch(setPropertyStatus(value))
    updateManualAddressData(setManualAddressData, "propertyStatus", value)
  }

  const handleLeaseLengthChange = (value: string) => {
    dispatch(setLeaseLength(value))
    updateManualAddressData(setManualAddressData, "leaseLength", value)
  }

  const handleBedroomsChange = (value: BedroomCountInput) => {
    dispatch(setBedrooms(value))
    updateManualAddressData(setManualAddressData, "bedrooms", value)
  }

  const handleBathroomsChange = (value: BathroomCountInput) => {
    dispatch(setBathrooms(value))
    updateManualAddressData(setManualAddressData, "bathrooms", value)
  }

  const handleYearBuiltChange = (value: string) => {
    dispatch(setYearBuilt(value))
    updateManualAddressData(setManualAddressData, "yearBuilt", value)
  }

  const handlePropertySizeChange = (value: string) => {
    dispatch(setPropertySize(value))
    updateManualAddressData(setManualAddressData, "propertySize", value)

    if (value) {
      const sqFt = convertSqMeterToSqFeet(Number(value))
      setPropertySizeSqFt(Math.round(sqFt).toString())
    } else {
      setPropertySizeSqFt("")
    }
  }

  const handleEstimatedValueChange = (value: string) => {
    dispatch(setEstimatedValue(value))
    updateManualAddressData(setManualAddressData, "estimatedValue", value)
  }

  const handleConditionChange = (value: PropertyConditionInput) => {
    dispatch(setCondition(value))
    updateManualAddressData(setManualAddressData, "condition", value)
  }

  const handleConditionNotesChange = (value: string) => {
    dispatch(setConditionNotes(value))
    updateManualAddressData(setManualAddressData, "conditionNotes", value)
  }

  const handleDocumentUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    documentType: string
  ) => {
    if (readOnly) return

    if (event.target.files) {
      const files = Array.from(event.target.files)

      try {
        const tempDocsPromises = files.map(async (file) => {
          if (isDuplicateDocument(file.name, documentType, documents)) {
            toast({
              title: "Warning",
              description: `${file.name} already exists. Skipping duplicate.`,
              variant: "default",
            })
            return null
          }

          const base64Data = await fileToBase64(file)
          const id = Math.random().toString()
          const formattedName = formatFileName(file.name)

          const tempDoc: StoredTempFile = {
            id,
            filename: formattedName,
            base64Data,
            documentType,
          }

          dispatch(
            addTempDocument({
              id,
              filename: formattedName,
              fileUrl: base64Data,
              documentType,
              verified: false,
              isTemp: true,
            })
          )

          return tempDoc
        })

        const newTempFiles = (await Promise.all(tempDocsPromises)).filter(
          Boolean
        )

        const existingFiles = loadTempFilesFromStorage()
        const updatedFiles = [...existingFiles, ...newTempFiles]
        saveTempFilesToStorage(updatedFiles as StoredTempFile[])

        event.target.value = ""
      } catch (error) {
        console.error("Error uploading documents:", error)
        toast({
          title: "Error",
          description: "Failed to upload documents",
          variant: "destructive",
        })
      }
    }
  }

  const handleFormSubmit = async (data: PropertyDetailsForm) => {
    if (readOnly) {
      onSubmit(data as PropertyInfoData)
      return
    }

    try {
      if (
        !data.propertyType ||
        !data.propertyStatus ||
        !data.bedrooms ||
        !data.bathrooms ||
        !data.condition
      ) {
        toast({
          title: t("wizard_property_information:toasts.errorTitle"),
          description: t("wizard_property_information:toasts.formError"),
          variant: "destructive",
        })
        return
      }

      const ownerIds =
        ownersInformation?.owners
          .map((owner) => owner.id)
          .filter((id): id is string => id !== undefined) || []

      if (!ownerIds.length) {
        toast({
          title: "Error",
          description:
            "No property owners found. Please add owners before proceeding.",
          variant: "destructive",
        })
        return
      }

      const formattedData = {
        ...data,
        propertyType: data.propertyType as
          | "house"
          | "flat"
          | "bungalow"
          | "other",
        propertyStatus: data.propertyStatus as "freehold" | "leasehold",
        bedrooms: data.bedrooms as "1" | "2" | "3" | "4" | "5+",
        bathrooms: data.bathrooms as "1" | "2" | "3+",
        condition: data.condition as
          | "excellent"
          | "good"
          | "fair"
          | "needs_renovation",
        fullAddressData: {
          lookup: fullAddressData || null,
          manual: {
            ...data,
            ...(manualAddressData || {}),
            fullAddressData: undefined,
          },
        },
        ownerIds,
        documents: undefined,
        showDocumentUpload: showDocumentUpload,
      }

      const propertyId = existingApiData?.id
      let result

      if (propertyId && mode === "edit") {
        result = await updateProperty.mutateAsync({
          id: propertyId,
          data: formattedData,
        })
      } else {
        result = await createProperty.mutateAsync(formattedData)
      }

      // Handle Document Uploads
      if (result.id) {
        const documentsToUpload = documents.filter(
          (doc) =>
            (doc.isTemp || doc.fileUrl.startsWith("data:")) &&
            !isDuplicateDocument(
              doc.filename,
              doc.documentType as string,
              documents.filter((d) => !d.isTemp)
            )
        )

        if (documentsToUpload.length > 0) {
          for (const doc of documentsToUpload) {
            try {
              let file: File
              if (doc.fileUrl.startsWith("data:")) {
                const response = await fetch(doc.fileUrl)
                const blob = await response.blob()
                const formattedName = formatFileName(doc.filename)
                file = new File([blob], formattedName, { type: blob.type })
              } else {
                continue
              }

              const uploadFormData = new FormData()
              uploadFormData.append("file", file)
              uploadFormData.append("propertyId", result.id)
              uploadFormData.append("documentType", doc.documentType)

              const response = await fetch("/api/documents/upload", {
                method: "POST",
                body: uploadFormData,
              })

              if (!response.ok) {
                throw new Error(`Failed to upload ${doc.filename}`)
              }

              await response.json()

              dispatch(
                convertTempToPermanent({
                  documentType: doc.documentType,
                  propertyId: result.id,
                })
              )
            } catch (error) {
              console.error(`Error uploading ${doc.filename}:`, error)
              toast({
                title: "Error",
                description: `Failed to upload ${doc.filename}. You can try uploading it again later.`,
                variant: "destructive",
              })
            }

            await new Promise((resolve) => setTimeout(resolve, 500))
          }
        }

        clearTempFilesStorage()
        onSubmit(data as PropertyInfoData)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to submit form",
        variant: "destructive",
      })
    }
  }

  // UI state management
  useEffect(() => {
    if (readOnly) {
      setIsManualEntry(true)
      return
    }

    if (typeof window !== "undefined") {
      const savedEntryMode = localStorage.getItem("property_entry_mode")
      if (savedEntryMode === "manual") {
        setIsManualEntry(true)
      } else {
        setIsManualEntry(false)
      }
    }
  }, [readOnly])

  const updateEntryMode = (isManual: boolean) => {
    setIsManualEntry(isManual)
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "property_entry_mode",
        isManual ? "manual" : "postcode"
      )
    }
  }

  const handleManualEntry = () => {
    if (addressSearch.trim()) {
      dispatch(setAddress(addressSearch))
      updateManualAddressData(setManualAddressData, "address", addressSearch)
      form.setValue("address", addressSearch, {
        shouldValidate: true,
        shouldDirty: true,
      })
    }

    updateEntryMode(true)

    setTimeout(() => {
      const addressInput = document.querySelector(
        'input[name="address"]'
      ) as HTMLInputElement
      if (addressSearch.trim()) {
        addressInput.value = addressSearch
      }
    }, 50)
  }

  const handleSwitchToAddressSearch = () => {
    if (formData.address && !addressSearch) {
      setAddressSearch(formData.address)
    }
    updateEntryMode(false)
  }

  // Initialize form with defaultValues or formData
  useEffect(() => {
    const initialData = formData
    const currentValues = form.getValues() as Record<string, any>
    const hasFormValues = Object.keys(currentValues).some(
      (key) => currentValues[key] !== undefined && currentValues[key] !== ""
    )

    if (!hasFormValues) {
      form.reset(initialData, {
        keepDirty: false,
        keepErrors: false,
        keepTouched: false,
        keepIsValid: false,
        keepDefaultValues: false,
      })

      if (initialData.address && !isManualEntry) {
        setIsManualEntry(true)
      }

      if (initialData.propertyStatus === "leasehold" && !showLeaseholdDetails) {
        setShowLeaseholdDetails(true)
      }

      if (
        initialData.address &&
        (!manualAddressData ||
          manualAddressData.address !== initialData.address)
      ) {
        setManualAddressData({
          ...initialData,
          address: initialData.address,
          postcode: initialData.postcode || "",
          town: initialData.town || "",
          county: initialData.county || "",
        })
      }

      if (initialData.address && !addressSearch) {
        setAddressSearch(initialData.address)
      }
    }
  }, [
    defaultValues,
    formData,
    form,
    isManualEntry,
    showLeaseholdDetails,
    manualAddressData,
    addressSearch,
    setIsManualEntry,
    setShowLeaseholdDetails,
    setManualAddressData,
    setAddressSearch,
  ])

  useEffect(() => {
    if (formData.address && !addressSearch) {
      setAddressSearch(formData.address)
    }
  }, [])

  useEffect(() => {
    if (!formData.photos.length && typeof localStorage !== "undefined") {
      const savedPhotos = localStorage.getItem("property_photos")
      if (savedPhotos) {
        try {
          const photoUrls = JSON.parse(savedPhotos)
          if (Array.isArray(photoUrls) && photoUrls.length > 0) {
            photoUrls.forEach((url) => dispatch(addPhoto(url)))
          }
        } catch (e) {
          console.error("Error parsing saved photos:", e)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (formData.address && isManualEntry) {
      updateManualAddressData(setManualAddressData, "address", formData.address)
    }
  }, [formData.address, isManualEntry])

  useEffect(() => {
    setManualAddressData({
      ...formData,
      address: formData.address || "",
      postcode: formData.postcode || "",
      town: formData.town || "",
      county: formData.county || "",
    })
  }, [formData])

  // Get documents from Redux store for display
  const documents = useSelector(
    (state: RootState) => state.property.propertyDetails.formData.documents
  )

  const handleRemoveDocument = (documentId: string, documentType: string) => {
    if (readOnly) return

    dispatch(removeDocument({ id: documentId, documentType }))

    const existingFiles = loadTempFilesFromStorage()
    const updatedFiles = existingFiles.filter((file) => file.id !== documentId)
    saveTempFilesToStorage(updatedFiles)
  }

  useEffect(() => {
    if (!formData.id) {
      dispatch(clearTempDocuments("OTHER"))

      const savedTempFiles = loadTempFilesFromStorage()

      savedTempFiles.forEach((file) => {
        dispatch(
          addTempDocument({
            id: file.id,
            filename: file.filename,
            fileUrl: file.base64Data,
            documentType: file.documentType,
            verified: false,
            isTemp: true,
          })
        )
      })
    } else {
      clearTempFilesStorage()
    }
  }, [formData.id])

  useEffect(() => {
    return () => {
      if (formData.id) {
        clearTempFilesStorage()
      }
    }
  }, [formData.id])

  useEffect(() => {
    if (formData.propertySize) {
      const sqFt = convertSqMeterToSqFeet(Number(formData.propertySize))
      setPropertySizeSqFt(Math.round(sqFt).toString())
    }
  }, [formData.propertySize])

  const handleRightmoveData = (data: RightmoveResponse | null) => {
    if (!data || data.error) {
      dispatch(
        setApiData({
          propertyType: undefined,
          bedroomCount: undefined,
          bathroomCount: undefined,
          totalAreaSqM: undefined,
          condition: undefined,
          estimatedValue: undefined,
        })
      )

      setValue("propertyType", undefined)
      handlePropertyTypeChange(undefined as unknown as PropertyTypeInput)
      setValue("propertyStatus", undefined)
      handlePropertyStatusChange(undefined as unknown as PropertyStatusInput)
      setValue("bedrooms", undefined)
      handleBedroomsChange(undefined as unknown as BedroomCountInput)
      setValue("bathrooms", undefined)
      handleBathroomsChange(undefined as unknown as BathroomCountInput)
      setValue("propertySize", "")
      handlePropertySizeChange("")
      setValue("estimatedValue", "")
      handleEstimatedValueChange("")
      setValue("yearBuilt", "")
      handleYearBuiltChange("")
      setValue("condition", undefined)
      handleConditionChange(undefined as unknown as PropertyConditionInput)
      setValue("features", [])
      return
    }

    // Update Redux state with Rightmove data
    dispatch(
      setApiData({
        propertyType: data.propertyDetails.type
          ? mapRightmovePropertyType(data.propertyDetails.type)
          : undefined,
        bedroomCount: data.propertyDetails.beds || undefined,
        bathroomCount: data.propertyDetails.baths || undefined,
        totalAreaSqM: data.propertyDetails.floorArea || undefined,
        condition: data.propertyDetails.condition
          ? mapRightmoveCondition(data.propertyDetails.condition)
          : undefined,
        estimatedValue: data.estimatedValue.sales || undefined,
        features: [
          ...(data.features.centralHeating ? ["Central Heating"] : []),
          ...(data.features.parking ? ["Parking"] : []),
          ...(data.features.conservatories ? ["Conservatory"] : []),
        ] as string[],
      })
    )

    // Update form fields using setValue
    if (data.propertyDetails.type) {
      const propertyType = mapRightmovePropertyType(data.propertyDetails.type)
      setValue("propertyType", propertyType)
      handlePropertyTypeChange(propertyType)
    } else {
      setValue("propertyType", undefined)
      handlePropertyTypeChange(undefined as unknown as PropertyTypeInput)
    }

    if (data.propertyDetails.tenure) {
      const propertyStatus = mapRightmoveTenure(data.propertyDetails.tenure)
      setValue("propertyStatus", propertyStatus)
      handlePropertyStatusChange(propertyStatus)
    } else {
      setValue("propertyStatus", undefined)
      handlePropertyStatusChange(undefined as unknown as PropertyStatusInput)
    }

    if (data.propertyDetails.beds) {
      const beds =
        data.propertyDetails.beds <= 4
          ? (String(data.propertyDetails.beds) as BedroomCountInput)
          : "5+"
      setValue("bedrooms", beds)
      handleBedroomsChange(beds)
    } else {
      setValue("bedrooms", undefined)
      handleBedroomsChange(undefined as unknown as BedroomCountInput)
    }

    if (data.propertyDetails.baths) {
      const baths =
        data.propertyDetails.baths <= 2
          ? (String(data.propertyDetails.baths) as BathroomCountInput)
          : "3+"
      setValue("bathrooms", baths)
      handleBathroomsChange(baths)
    } else {
      setValue("bathrooms", undefined)
      handleBathroomsChange(undefined as unknown as BathroomCountInput)
    }

    if (data.propertyDetails.floorArea) {
      const size = String(data.propertyDetails.floorArea)
      setValue("propertySize", size)
      handlePropertySizeChange(size)
    } else {
      setValue("propertySize", "")
      handlePropertySizeChange("")
    }

    if (data.estimatedValue.sales) {
      const value = String(data.estimatedValue.sales)
      setValue("estimatedValue", value)
      handleEstimatedValueChange(value)
    } else {
      setValue("estimatedValue", "")
      handleEstimatedValueChange("")
    }

    if (data.propertyDetails.yearBuilt) {
      const year = String(data.propertyDetails.yearBuilt)
      setValue("yearBuilt", year)
      handleYearBuiltChange(year)
    } else {
      setValue("yearBuilt", "")
      handleYearBuiltChange("")
    }

    if (data.propertyDetails.condition) {
      const condition = mapRightmoveCondition(data.propertyDetails.condition)
      setValue("condition", condition)
      handleConditionChange(condition)
    } else {
      setValue("condition", undefined)
      handleConditionChange(undefined as unknown as PropertyConditionInput)
    }

    const features = [
      ...(data.features.centralHeating ? ["Central Heating"] : []),
      ...(data.features.parking ? ["Parking"] : []),
      ...(data.features.conservatories ? ["Conservatory"] : []),
    ] as PropertyFeatureInput[]
    setValue("features", features)
  }

  useEffect(() => {
    if (formData.address) {
      setValue("address", formData.address)
      updateManualAddressData(setManualAddressData, "address", formData.address)
    }

    if (formData.postcode) {
      setValue("postcode", formData.postcode)
      handlePostcodeChange(formData.postcode)
      updateManualAddressData(
        setManualAddressData,
        "postcode",
        formData.postcode
      )
    }

    if (formData.town) {
      setValue("town", formData.town)
      handleTownChange(formData.town)
      updateManualAddressData(setManualAddressData, "town", formData.town)
    }

    if (formData.county) {
      setValue("county", formData.county)
      handleCountyChange(formData.county)
      updateManualAddressData(setManualAddressData, "county", formData.county)
    }

    if (formData.propertyType) {
      setValue("propertyType", formData.propertyType as PropertyTypeInput)
      handlePropertyTypeChange(formData.propertyType as PropertyTypeInput)
    }

    if (formData.bedrooms) {
      const beds = formData.bedrooms
      setValue("bedrooms", beds)
      handleBedroomsChange(beds)
    }

    if (formData.bathrooms) {
      const baths = formData.bathrooms
      setValue("bathrooms", baths)
      handleBathroomsChange(baths)
    }

    if (formData.propertySize) {
      setValue("propertySize", formData.propertySize)
      handlePropertySizeChange(formData.propertySize)
    }

    if (formData.estimatedValue) {
      setValue("estimatedValue", formData.estimatedValue)
      handleEstimatedValueChange(formData.estimatedValue)
    }

    if (formData.condition) {
      setValue("condition", formData.condition as PropertyConditionInput)
      handleConditionChange(formData.condition as PropertyConditionInput)
    }

    if (formData.features.length > 0) {
      setValue("features", formData.features as PropertyFeatureInput[])
    }

    if (formData.leaseLength) {
      setValue("leaseLength", formData.leaseLength)
      handleLeaseLengthChange(formData.leaseLength)
    }

    if (formData.yearBuilt) {
      setValue("yearBuilt", formData.yearBuilt)
      handleYearBuiltChange(formData.yearBuilt)
    }

    if (formData.conditionNotes) {
      setValue("conditionNotes", formData.conditionNotes)
      handleConditionNotesChange(formData.conditionNotes)
    }
  }, [formData, setValue])

  useEffect(() => {
    if (existingApiData?.showDocumentUpload !== undefined) {
      setShowDocumentUpload(existingApiData.showDocumentUpload)
      form.setValue("showDocumentUpload", existingApiData.showDocumentUpload)
    }
  }, [existingApiData, form])

  return (
    <div className="relative w-full">
      <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:gap-8">
        {/* Main Content */}
        <div className="w-full rounded-lg border border-border bg-card p-3 shadow-md transition-all duration-200 hover:shadow-lg sm:p-4 md:p-6 lg:w-2/3">
          <div className="mb-4 border-b border-border/60 pb-3 sm:mb-6 sm:pb-4 lg:mb-8">
            <h2 className="mb-1 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-xl font-bold text-transparent sm:mb-2 sm:text-2xl">
              {t("wizard_property_information:pageTitle")}
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              {t("wizard_property_information:pageDescription")}
            </p>
          </div>

          {!isManualEntry ? (
            <AddressSearchSection
              readOnly={readOnly}
              onAddressSet={(formattedAddress: string) => {
                dispatch(setAddress(formattedAddress))
                setAddressSearch(formattedAddress)
              }}
              onRightmoveData={handleRightmoveData}
              onAddressSelected={(completeAddress: any) => {
                setFullAddressData(completeAddress)
                dispatch(setAddressData(completeAddress as any))

                const { line1, line2, line3, postTown, postcode } =
                  completeAddress
                const formattedAddress = [
                  line1,
                  line2,
                  line3,
                  postTown,
                  postcode,
                ]
                  .filter(Boolean)
                  .join(", ")

                dispatch(setAddress(formattedAddress))
                setAddressSearch(formattedAddress)

                const countyValue =
                  completeAddress.county || completeAddress.admin_county || ""

                if (postcode) {
                  dispatch(setPostcode(postcode))
                }

                if (postTown) {
                  dispatch(setTown(postTown))
                }

                if (countyValue) {
                  dispatch(setCounty(countyValue))
                }

                updateManualAddressData(
                  setManualAddressData,
                  "address",
                  formattedAddress
                )
                if (postcode) {
                  updateManualAddressData(
                    setManualAddressData,
                    "postcode",
                    postcode
                  )
                }
                if (postTown) {
                  updateManualAddressData(
                    setManualAddressData,
                    "town",
                    postTown
                  )
                }
                if (countyValue) {
                  updateManualAddressData(
                    setManualAddressData,
                    "county",
                    countyValue
                  )
                }

                form.setValue("address", formattedAddress, {
                  shouldValidate: false,
                  shouldDirty: true,
                })
                if (postcode) {
                  form.setValue("postcode", postcode, {
                    shouldValidate: false,
                    shouldDirty: true,
                  })
                }
                if (postTown) {
                  form.setValue("town", postTown, {
                    shouldValidate: false,
                    shouldDirty: true,
                  })
                }
                if (countyValue) {
                  form.setValue("county", countyValue, {
                    shouldValidate: false,
                    shouldDirty: true,
                  })
                }

                void form.trigger(["address", "postcode", "town", "county"])
              }}
              onGoButtonClick={() => {
                const currentFormValues = form.getValues()
                const latestAddress = currentFormValues.address || addressSearch

                if (latestAddress.trim()) {
                  dispatch(setAddress(latestAddress))
                  if (currentFormValues.postcode)
                    dispatch(setPostcode(currentFormValues.postcode))
                  if (currentFormValues.town)
                    dispatch(setTown(currentFormValues.town))
                  if (currentFormValues.county)
                    dispatch(setCounty(currentFormValues.county))

                  updateManualAddressData(
                    setManualAddressData,
                    "address",
                    latestAddress
                  )
                  if (currentFormValues.postcode) {
                    updateManualAddressData(
                      setManualAddressData,
                      "postcode",
                      currentFormValues.postcode
                    )
                  }
                  if (currentFormValues.town) {
                    updateManualAddressData(
                      setManualAddressData,
                      "town",
                      currentFormValues.town
                    )
                  }
                  if (currentFormValues.county) {
                    updateManualAddressData(
                      setManualAddressData,
                      "county",
                      currentFormValues.county
                    )
                  }

                  form.setValue("address", latestAddress, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }

                updateEntryMode(true)
              }}
              onBack={onBack}
              onManualEntry={handleManualEntry}
            />
          ) : (
            <Form {...(form as any)}>
              <form
                className="space-y-4 sm:space-y-6"
                onSubmit={form.handleSubmit(handleFormSubmit)}
              >
                {/* Property Location Section */}
                <PropertyLocationSection
                  form={form}
                  readOnly={readOnly}
                  onAddressChange={(value: string) => {
                    dispatch(setAddress(value))
                    updateManualAddressData(
                      setManualAddressData,
                      "address",
                      value
                    )
                  }}
                  onPostcodeChange={handlePostcodeChange}
                  onTownChange={handleTownChange}
                  onCountyChange={handleCountyChange}
                  onSwitchToAddressSearch={handleSwitchToAddressSearch}
                />

                {/* Property Type */}
                <PropertyTypeSection
                  form={form}
                  readOnly={readOnly}
                  onPropertyTypeChange={handlePropertyTypeChange}
                />

                {/* Property Status */}
                <PropertyStatusSection
                  form={form}
                  readOnly={readOnly}
                  showLeaseholdDetails={showLeaseholdDetails}
                  onPropertyStatusChange={handlePropertyStatusChange}
                  onLeaseLengthChange={handleLeaseLengthChange}
                  setShowLeaseholdDetails={setShowLeaseholdDetails}
                />

                {/* Property Details Section */}
                <PropertyDetailsSection
                  form={form}
                  readOnly={readOnly}
                  propertySizeSqFt={propertySizeSqFt}
                  setPropertySizeSqFt={setPropertySizeSqFt}
                  onBedroomsChange={handleBedroomsChange}
                  onBathroomsChange={handleBathroomsChange}
                  onYearBuiltChange={handleYearBuiltChange}
                  onPropertySizeChange={handlePropertySizeChange}
                  onEstimatedValueChange={handleEstimatedValueChange}
                  onFeatureAdd={(feature: PropertyFeatureInput) => {
                    dispatch(addFeature(feature))
                  }}
                  onFeatureRemove={(feature: PropertyFeatureInput) => {
                    dispatch(removeFeature(feature))
                  }}
                  manualAddressData={manualAddressData}
                  updateManualAddressData={(
                    field: string,
                    value: string | string[]
                  ) => {
                    updateManualAddressData(setManualAddressData, field, value)
                  }}
                />

                {/* Property Condition Section */}
                <PropertyConditionSection
                  form={form}
                  readOnly={readOnly}
                  onConditionChange={handleConditionChange}
                  onConditionNotesChange={handleConditionNotesChange}
                />

                {/* Document Upload Section */}
                <DocumentUploadSection
                  showDocumentUpload={showDocumentUpload}
                  setShowDocumentUpload={setShowDocumentUpload}
                  documents={documents}
                  readOnly={readOnly}
                  onDocumentUpload={handleDocumentUpload}
                  onRemoveDocument={handleRemoveDocument}
                  form={form}
                />

                {/* Navigation buttons */}
                <NavigationButtons
                  onBack={onBack}
                  readOnly={readOnly}
                  mode={mode}
                  isCreatePending={createProperty.isPending}
                  isUpdatePending={updateProperty.isPending}
                />
              </form>
            </Form>
          )}
        </div>

        {/* Assistant and additional info */}
        <div className="w-full space-y-4 sm:space-y-6 lg:w-1/3">
          <ChatBotSection />
          <SidebarCards />
        </div>
      </div>
    </div>
  )
}
