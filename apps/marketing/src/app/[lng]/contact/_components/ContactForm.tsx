/*eslint-disable import/order*/
"use client"

import { useState } from "react"

import { Button } from "@package/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@package/ui/form"
import { useTurnstile } from "@package/ui/hooks"
import { Input } from "@package/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@package/ui/select"
import { Textarea } from "@package/ui/textarea"
import { toast } from "@package/ui/toast"
import { TurnstileDialog } from "@package/ui/turnstile-dialog"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { api } from "@/lib/trpc/react"

const contactFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  subject: z.string().min(1, { message: "Subject is required" }),
  message: z.string().min(1, { message: "Message is required" }),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    token: turnstileToken,
    isShowing: isTurnstileShowing,
    showTurnstile,
    handleVerify: handleTurnstileVerify,
    reset: resetTurnstile,
  } = useTurnstile()

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  })

  const submitLeadMutation = api.leads.submit.useMutation({
    onSuccess: () => {
      setIsSubmitting(false)
      form.reset()
      toast({
        title: "Message Sent",
        description: "Thank you for contacting us. We'll be in touch soon.",
      })
    },
    onError: (error) => {
      setIsSubmitting(false)
      toast({
        title: "Error",
        description:
          error.message || "Failed to send your message. Please try again.",
        variant: "destructive",
      })
    },
  })

  const onSubmit = async (values: ContactFormValues) => {
    if (!turnstileToken) {
      showTurnstile()
      return
    }

    setIsSubmitting(true)

    try {
      await submitLeadMutation.mutateAsync({
        name: values.name,
        email: values.email,
        phone: values.phone,
        leadType: "contact",
        message: values.message,
        source: "contact-page",
        turnstileToken,
        metadata: {
          subject: values.subject,
        },
      })
    } catch {
      // error handled in mutation
    }
  }

  const subjectOptions = [
    { value: "general", label: "General Inquiry" },
    { value: "property-assessment", label: "Property Assessment" },
    { value: "payment-options", label: "Payment Options" },
    { value: "legal-questions", label: "Legal Questions" },
    { value: "support", label: "Support" },
  ]

  return (
    <>
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Your name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Your email"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (optional)</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Your phone number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <Select
                    defaultValue={field.value}
                    disabled={isSubmitting}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subjectOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    className="min-h-32"
                    disabled={isSubmitting}
                    placeholder="How can we help you?"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              className="w-full sm:w-auto"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </form>
      </Form>

      <TurnstileDialog
        open={isTurnstileShowing}
        size="compact"
        theme="auto"
        onOpenChange={(open) => {
          if (!open) resetTurnstile()
        }}
        onVerify={async (token) => {
          handleTurnstileVerify(token)
          const values = form.getValues()
          await submitLeadMutation.mutateAsync({
            name: values.name,
            email: values.email,
            phone: values.phone,
            leadType: "contact",
            message: values.message,
            source: "contact-page",
            turnstileToken: token,
            metadata: {
              subject: values.subject,
            },
          })
        }}
      />
    </>
  )
}
