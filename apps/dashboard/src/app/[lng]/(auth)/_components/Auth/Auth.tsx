/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Button } from "@package/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@package/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@package/ui/dialog"
import { useTurnstile } from "@package/ui/hooks"
import { Input } from "@package/ui/input"
import { Label } from "@package/ui/label"
import { TurnstileDialog } from "@package/ui/turnstile-dialog"
import Link from "next/link"

import type { TFunction } from "i18next"

import { useClientTranslation } from "@/lib/i18n/I18nProvider"

import { useSignIn } from "../../_hooks/useSignIn"

type AuthProps = {
  isSignUp?: boolean
}

type TranslationParams = {
  email: string | string[]
}

export function Auth({ isSignUp = false }: AuthProps) {
  const { t } = useClientTranslation("auth_signin_signup") as { t: TFunction }

  const {
    email,
    setEmail,
    error,
    showModal,
    setshowModal,
    // handleLoginWithEmail,
    // handleLoginWithProvider,
    loading,
    submitWithTurnstileToken,
  } = useSignIn({ isSignUp })

  const {
    token: turnstileToken,
    isShowing: isTurnstileShowing,
    showTurnstile,
    handleVerify: handleTurnstileVerify,
    reset: resetTurnstile,
  } = useTurnstile()

  const handleSubmitWithTurnstile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // await submitWithTurnstileToken()
      if (turnstileToken) {
        // If we already have a token, use it directly
        await submitWithTurnstileToken(turnstileToken)
      } else {
        // Otherwise show the turnstile dialog
        showTurnstile()
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error during form submission:", error)
      // You might want to show an error toast or handle the error in some way
    }
  }

  return (
    <>
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">
            {isSignUp ? t("cardTitle.signUp") : t("cardTitle.signIn")}
          </CardTitle>
          <CardDescription>
            {isSignUp
              ? t("cardDescription.signUp")
              : t("cardDescription.signIn")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <form className="space-y-4" onSubmit={handleSubmitWithTurnstile}>
              <div className="grid gap-2">
                <Label htmlFor="email">{t("form.emailLabel")}</Label>
                <Input
                  required
                  id="email"
                  placeholder="m@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {error && <p className="text-destructive">{error}</p>}
              </div>
              <div className="grid gap-2" />
              <Button
                className="w-full"
                disabled={loading}
                isLoading={loading}
                type="submit"
              >
                {isSignUp
                  ? t("buttons.submit.signUp")
                  : t("buttons.submit.signIn")}
              </Button>
            </form>
            <section className="flex items-center gap-4">
              <hr className="flex-1 border-foregroundGrey" />
              <p className="text-center text-foregroundGrey">
                {t("form.orSeparator")}
              </p>
              <hr className="flex-1 border-foregroundGrey" />
            </section>
            {/* <Button
              className="w-full"
              disabled={loading}
              isLoading={loading}
              variant="outline"
              onClick={() => handleLoginWithProvider("google")}
            >
              {isSignUp
                ? t("buttons.google.signUp")
                : t("buttons.google.signIn")}
            </Button>
            <Button
              className="w-full"
              disabled={loading}
              isLoading={loading}
              variant="outline"
              onClick={() => handleLoginWithProvider("github")}
            >
              {isSignUp
                ? t("buttons.github.signUp")
                : t("buttons.github.signIn")}
            </Button> */}
          </div>
          <div className="mt-4 text-center text-sm">
            {isSignUp
              ? t("linkText.prompt.signUp")
              : t("linkText.prompt.signIn")}{" "}
            <Link className="underline" href={isSignUp ? "/signin" : "signup"}>
              {isSignUp
                ? t("linkText.action.signUp")
                : t("linkText.action.signIn")}
            </Link>
          </div>
        </CardContent>
      </Card>
      <Dialog open={showModal} onOpenChange={setshowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("emailDialog.title")}</DialogTitle>
            <DialogDescription>
              {isSignUp
                ? t("emailDialog.description.signUp", {
                    email,
                  } as TranslationParams)
                : t("emailDialog.description.signIn", {
                    email,
                  } as TranslationParams)}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <TurnstileDialog
        description={t("turnstileDialog.description")}
        open={isTurnstileShowing}
        size="compact"
        theme="auto"
        title={t("turnstileDialog.title")}
        onError={() => resetTurnstile()}
        onExpire={() => resetTurnstile()}
        onOpenChange={(open: boolean) => {
          if (!open) {
            resetTurnstile()
          }
        }}
        onVerify={async (token: string) => {
          handleTurnstileVerify(token)
          // Submit the form with the token
          await submitWithTurnstileToken(token)
        }}
      />
    </>
  )
}
