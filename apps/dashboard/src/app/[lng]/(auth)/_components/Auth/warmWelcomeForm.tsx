/*eslint-disable jsx-a11y/anchor-is-valid*/
/*eslint-disable react/no-unescaped-entities*/
/*eslint-disable @typescript-eslint/no-explicit-any*/
"use client"

import { useEffect, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@package/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@package/ui/card"
import { Checkbox } from "@package/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@package/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@package/ui/form"
import { Input } from "@package/ui/input"
import { toast } from "@package/ui/toast"
import { useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"

import type { TFunction } from "i18next"

import { useClientTranslation } from "@/lib/i18n/I18nProvider"

import { useWarmWelcome } from "../../_hooks/useWarmWelcome"

type TranslationParams = {
  email: string | string[]
}

export function WarmWelcomeForm() {
  const { t } = useClientTranslation("auth_warm_welcome") as { t: TFunction }
  const { lng } = useParams<{ lng: string }>()

  const warmWelcomeFormSchema = z.object({
    firstName: z.string().min(1, t("formSchema.firstNameRequired")),
    lastName: z.string().min(1, t("formSchema.lastNameRequired")),
    email: z.string().email(t("formSchema.emailInvalid")),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: t("formSchema.acceptTermsRequired"),
    }),
    acceptMarketing: z.boolean().default(false),
  })

  type WarmWelcomeData = z.infer<typeof warmWelcomeFormSchema>

  const {
    warmWelcome,
    isLoading,
    error: hookError,
    errorCode,
  } = useWarmWelcome()
  const [showModal, setShowModal] = useState(false)
  const [showExistingEmailModal, setShowExistingEmailModal] = useState(false)

  // Add effect to watch for errorCode changes
  useEffect(() => {
    if (errorCode === "EMAIL_EXISTS") {
      setShowExistingEmailModal(true)
    }
  }, [errorCode])

  const form = useForm<WarmWelcomeData>({
    resolver: zodResolver(warmWelcomeFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      acceptTerms: false,
      acceptMarketing: false,
    },
  })

  const navigateToSignin = () => {
    window.location.href = `/${lng}/signin`
  }

  const onSubmit = async (data: WarmWelcomeData) => {
    if (!data.acceptTerms) {
      toast({
        title: t("toastMessages.errorTitle"),
        description: t("toastMessages.mustAcceptTerms"),
        variant: "destructive",
      })
      return
    }

    try {
      await warmWelcome(data)
    } catch (err: any) {
      // Error will be handled by the useEffect hook that watches errorCode
      // Other errors will be displayed through the error state from the hook
    }
  }

  return (
    <>
      <Card className="w-full max-w-[600px] shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl font-semibold">
            {t("cardHeader.title")}
          </CardTitle>
          <CardDescription className="text-sm">
            {t("cardHeader.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...(form as any)}>
            <form className="space-y-1" onSubmit={form.handleSubmit(onSubmit)}>
              {hookError && !errorCode && (
                <div className="rounded-md bg-destructive/10 p-1 text-xs text-destructive">
                  {hookError}
                </div>
              )}

              {/* Personal Information */}
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <FormField
                  control={form.control as any}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.firstNameLabel")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("form.firstNamePlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as any}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.lastNameLabel")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("form.lastNamePlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control as any}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.emailLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.emailPlaceholder")}
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      {t("form.emailHint")}
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Terms and Privacy */}
              <div className="space-y-1">
                <FormField
                  control={form.control as any}
                  name="acceptTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-0 leading-none">
                        <FormLabel>
                          {t("form.termsLabelPart1")}{" "}
                          <a
                            className="text-primary hover:underline"
                            href={`${process.env.NEXT_PUBLIC_MARKETING_URL}/legal/terms-of-service`}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            {t("form.termsOfServiceLink")}
                          </a>{" "}
                          {t("form.termsAnd")}{" "}
                          <a
                            className="text-primary hover:underline"
                            href={`${process.env.NEXT_PUBLIC_MARKETING_URL}/legal/privacy-policy`}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            {t("form.privacyPolicyLink")}
                          </a>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control as any}
                  name="acceptMarketing"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-0 leading-none">
                        <FormLabel>{t("form.marketingLabel")}</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-1">
                <Button
                  disabled={isLoading}
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                >
                  {t("buttons.back")}
                </Button>
                <Button
                  className="w-[200px]"
                  disabled={isLoading || !form.watch("acceptTerms")}
                  type="submit"
                  variant="default"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="mr-2 size-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          fill="currentColor"
                        />
                      </svg>
                      {t("buttons.loading")}
                    </span>
                  ) : (
                    t("buttons.getStarted")
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Email verification dialog */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("emailDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("emailDialog.description", {
                email: form.watch("email"),
              } as TranslationParams)}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Existing email dialog */}
      <Dialog
        open={showExistingEmailModal}
        onOpenChange={setShowExistingEmailModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Account Already Exists</DialogTitle>
            <DialogDescription>
              This email is already registered. Please verify your email if you
              haven't already, or go to the signin page to log in to your
              account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={navigateToSignin}>Go to Sign In</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
