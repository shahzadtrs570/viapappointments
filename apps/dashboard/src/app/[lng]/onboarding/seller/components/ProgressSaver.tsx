/*eslint-disable import/order*/
/*eslint-disable react/function-component-definition*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/
"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@package/ui/button"
import { Input } from "@package/ui/input"
import { Label } from "@package/ui/label"
import { Send, ArrowRight, InfoIcon } from "lucide-react"
import { Alert, AlertDescription } from "@package/ui/alert"

interface ProgressSaverProps {
  onSave: (email: string, name?: string) => void
  onSkip: () => void
  initialEmail?: string
  initialName?: string
}

export function ProgressSaver({
  onSave,
  onSkip,
  initialEmail = "",
  initialName = "",
}: ProgressSaverProps) {
  const [email, setEmail] = useState(initialEmail)
  const [name, setName] = useState(initialName)
  const [isValidEmail, setIsValidEmail] = useState(false)
  const [attempted, setAttempted] = useState(false)

  // Use a memoized email validation function
  const validateEmail = useCallback((emailToValidate: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(emailToValidate)
  }, [])

  // Update email validation state when email changes
  useEffect(() => {
    setIsValidEmail(validateEmail(email))
  }, [email, validateEmail])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      setAttempted(true)

      if (validateEmail(email)) {
        onSave(email, name || undefined)
      }
    },
    [email, name, onSave, validateEmail]
  )

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value)
    },
    []
  )

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value)
    },
    []
  )

  return (
    <div className="space-y-6">
      <Alert className="border-primary/20 bg-primary/10">
        <InfoIcon className="size-4" />
        <AlertDescription className="text-sm text-primary-foreground/80">
          {`Saving your progress allows you to continue later. We'll send you a
          magic link with no password required. Your information is always
          private and secure.`}
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Your Name (Optional)</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Smith"
            value={name}
            onChange={handleNameChange}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={handleEmailChange}
            className={`w-full ${
              attempted && !isValidEmail ? "border-destructive" : ""
            }`}
            required
          />
          {attempted && !isValidEmail && (
            <p className="mt-1 text-sm text-destructive">
              Please enter a valid email address
            </p>
          )}
        </div>

        <div className="flex flex-col space-y-3 pt-2 sm:flex-row sm:space-x-3 sm:space-y-0">
          <Button
            type="submit"
            className="flex-1"
            disabled={attempted && !isValidEmail}
          >
            <Send size={16} className="mr-2" />
            Save Progress
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onSkip}
            className="flex-1"
          >
            Continue Without Saving
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </form>

      <div className="mt-8 border-t pt-4">
        <p className="text-sm text-muted-foreground">
          {`Don't want to save now? You can always save your progress later. Just
          continue with the onboarding process.`}
        </p>
      </div>
    </div>
  )
}
