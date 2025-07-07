"use client"

import { useEffect, useState } from "react"

import { cn } from "@package/utils"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

import { Button } from "@package/ui/button"
import { Card } from "@package/ui/card"
import { useTurnstile } from "@package/ui/hooks"
import { type ToastActionElement } from "@package/ui/toast"
import { TurnstileDialog } from "@package/ui/turnstile-dialog"

import {
  type WaitlistField,
  type WaitlistFormConfig,
  type WaitlistFormData,
} from "./types"
import { WaitlistFormField } from "./WaitlistFormField"
import { WaitlistSuccessMessage } from "./WaitlistSuccessMessage"

export interface WaitlistFormProps {
  config: WaitlistFormConfig
  isLoading: boolean
  setIsLoading: (value: boolean) => void
  isSuccess: boolean
  setIsSuccess: (value: boolean) => void
  getTrackingData: () => Record<string, string | null>
  onSubmit: (data: WaitlistFormData) => Promise<void>
  toast: (props: {
    variant: "default" | "destructive" | "success"
    title?: string
    description: string | React.ReactNode
    className?: string
    action?: ToastActionElement
  }) => void
}

export function WaitlistForm({
  config,
  isLoading,
  setIsLoading,
  isSuccess,
  setIsSuccess,
  getTrackingData,
  onSubmit,
  toast,
}: WaitlistFormProps) {
  const [isClientSide, setIsClientSide] = useState(false)

  useEffect(() => {
    setIsClientSide(true)
  }, [])

  const {
    token: turnstileToken,
    isShowing: isTurnstileShowing,
    showTurnstile,
    handleVerify: handleTurnstileVerify,
    reset: resetTurnstile,
  } = useTurnstile()

  const schemaFields = [
    "name",
    "email",
    "source",
    "referralCode",
    "waitlistType",
    "status",
  ] as const

  type SchemaField = (typeof schemaFields)[number]

  const isSchemaField = (field: string): field is SchemaField => {
    return schemaFields.includes(field as SchemaField)
  }

  const [errors, setErrors] = useState<Record<string, string[]>>(() => {
    return config.fields.reduce(
      (acc, field) => {
        acc[field.name] = []
        return acc
      },
      {} as Record<string, string[]>
    )
  })

  const [formData, setFormData] = useState<
    Record<string, string | boolean | number>
  >(() => {
    return config.fields.reduce(
      (acc, field) => {
        const fieldName = field.name
        if (isSchemaField(fieldName)) {
          acc[fieldName] =
            field.defaultValue ?? (field.type === "checkbox" ? false : "")
        } else if (field.defaultValue != null && field.defaultValue !== "") {
          acc[fieldName] = field.defaultValue
        } else if (field.type === "text" || field.type === "select") {
          acc[fieldName] = ""
        }
        return acc
      },
      {} as Record<string, string | boolean | number>
    )
  })

  const validateField = (
    field: WaitlistField,
    value: string | boolean | number
  ): string[] => {
    const fieldErrors: string[] = []

    try {
      if (
        field.required &&
        (!value || (typeof value === "string" && !value.trim()))
      ) {
        fieldErrors.push(`${field.label || field.name} is required`)
      }

      if (field.type === "email" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value as string)) {
          fieldErrors.push("Please enter a valid email address")
        }
      }

      if (field.validation) {
        const error = field.validation(value)
        if (error) fieldErrors.push(error)
      }
    } catch (error) {
      if (error instanceof Error) {
        fieldErrors.push(error.message)
      }
    }

    return fieldErrors
  }

  const handleFieldChange = (
    name: string,
    value: string | boolean | number
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    const field = config.fields.find((f) => f.name === name)
    if (field) {
      const fieldErrors = validateField(field, value)
      setErrors((prev) => ({ ...prev, [name]: fieldErrors }))
    }
  }

  const handleFieldBlur = (name: string) => {
    const field = config.fields.find((f) => f.name === name)
    if (field) {
      const fieldErrors = validateField(field, formData[name])
      setErrors((prev) => ({ ...prev, [name]: fieldErrors }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string[]> = {}
    let hasErrors = false

    config.fields.forEach((field) => {
      const fieldErrors = validateField(field, formData[field.name])
      if (fieldErrors.length > 0) {
        hasErrors = true
        newErrors[field.name] = fieldErrors
      } else {
        newErrors[field.name] = []
      }
    })

    setErrors(newErrors)
    return !hasErrors
  }

  const submitFormWithToken = async (token: string) => {
    const isValid = validateForm()
    if (!isValid) {
      throw new Error("Please check the form for errors")
    }

    // Initialize root data with schema fields
    const rootData: Record<string, string | boolean | number> = {
      name: formData.name || "",
      email: formData.email || "",
      waitlistType: formData.waitlistType || "standard",
      source: formData.source || "",
      referralCode: formData.referralCode || "",
      turnstileToken: token,
    }

    const trackingData = getTrackingData()

    // Handle metadata fields
    const metadataFields: Record<string, string | null> = {}

    // Add non-schema form fields to metadata
    // config.fields.forEach((field) => {
    //   if (!isSchemaField(field.name) && field.name !== "turnstileToken") {
    //     const value = formData[field.name]

    //   }
    // })

    // Add tracking data to metadata
    Object.entries(trackingData).forEach(([key, value]) => {
      if (!isSchemaField(key) && key !== "turnstileToken" && value !== null) {
        metadataFields[key] = value
      }
    })

    // Construct final submit data
    const submitData = {
      ...rootData,
      metadata: metadataFields,
    }

    // Submit the form data
    await onSubmit(submitData)
    setIsSuccess(true)
    resetTurnstile()

    toast({
      variant: "success",
      title: config.successMessage?.title ?? "Success!",
      description:
        config.successMessage?.description ?? "You're now on our waitlist.",
      className:
        "p-6 gap-4 bg-gradient-to-br from-primary/20 to-primary/10 border-primary/20 shadow-lg backdrop-blur-sm",
    })

    // Reset form after success
    setTimeout(() => {
      setFormData(
        config.fields.reduce(
          (acc, field) => {
            acc[field.name] =
              field.defaultValue ?? (field.type === "checkbox" ? false : "")
            return acc
          },
          {} as Record<string, string | boolean | number>
        )
      )
      setIsSuccess(false)
    }, 2000)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!turnstileToken) {
      showTurnstile()
      return
    }

    setIsLoading(true)
    setIsSuccess(false)

    try {
      await submitFormWithToken(turnstileToken)
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
          className:
            "p-6 gap-4 bg-gradient-to-br from-destructive/20 to-destructive/10 border-destructive/20 shadow-lg backdrop-blur-sm",
        })
      }
      resetTurnstile()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={config.customStyles?.formWrapper}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card
        className={cn(
          "border-t-primary relative mx-auto max-w-4xl overflow-hidden border-t-4 p-8 shadow-lg md:p-12",
          config.customStyles?.card
        )}
      >
        {isSuccess && <WaitlistSuccessMessage config={config} />}

        {isClientSide && (
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {config.fields.map((field) => {
                if (field.type === "hidden") {
                  return (
                    <WaitlistFormField
                      key={field.name}
                      errors={errors}
                      field={field}
                      formData={formData}
                      isLoading={isLoading}
                      onFieldBlur={handleFieldBlur}
                      onFieldChange={handleFieldChange}
                    />
                  )
                }

                return (
                  <div
                    key={field.name}
                    className={cn(
                      "space-y-2",
                      field.type === "checkbox" && "col-span-2",
                      field.type === "textarea" && "col-span-2",
                      field.columnSpan === 2 && "col-span-2",
                      field.columnSpan === 1 && "col-span-1"
                    )}
                  >
                    {field.type !== "checkbox" && (
                      <label
                        className="flex items-center justify-between text-sm font-medium"
                        htmlFor={field.name}
                      >
                        {field.label}
                        {errors[field.name].length > 0 && (
                          <span className="text-xs text-destructive">
                            {errors[field.name][0]}
                          </span>
                        )}
                      </label>
                    )}
                    <WaitlistFormField
                      errors={errors}
                      field={field}
                      formData={formData}
                      isLoading={isLoading}
                      onFieldBlur={handleFieldBlur}
                      onFieldChange={handleFieldChange}
                    />
                  </div>
                )
              })}
            </div>

            <Button
              disabled={isLoading}
              type="submit"
              className={cn(
                "group relative w-full overflow-hidden",
                config.customStyles?.submitButton
              )}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading && <Loader2 className="size-4 animate-spin" />}
                {isLoading ? "Processing..." : config.submitButtonText}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </Button>
          </form>
        )}

        {!isClientSide && (
          <div className="flex items-center justify-center py-8">
            <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}
      </Card>

      <TurnstileDialog
        open={isTurnstileShowing}
        size="compact"
        theme="auto"
        onOpenChange={(open) => {
          if (!open) {
            resetTurnstile()
          }
        }}
        onVerify={async (token) => {
          handleTurnstileVerify(token)

          try {
            setIsLoading(true)
            setIsSuccess(false)
            await submitFormWithToken(token)
          } catch (error) {
            if (error instanceof Error) {
              toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
                className:
                  "p-6 gap-4 bg-gradient-to-br from-destructive/20 to-destructive/10 border-destructive/20 shadow-lg backdrop-blur-sm",
              })
            }
            resetTurnstile()
          } finally {
            setIsLoading(false)
          }
        }}
      />
    </motion.div>
  )
}
