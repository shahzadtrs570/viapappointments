import type * as React from "react"

import { CheckIcon } from "lucide-react"

import type { WaitlistFormConfig } from "./types"

function SuccessListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2">
      <CheckIcon className="size-4 text-primary/80" />
      {children}
    </li>
  )
}

export const baseWaitlistConfig: WaitlistFormConfig = {
  fields: [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      required: true,
      placeholder: "Enter your name",
      storeInMetadata: false,
      columnSpan: 1,
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      required: true,
      placeholder: "you@example.com",
      storeInMetadata: false,
      columnSpan: 1,
    },
    {
      name: "source",
      type: "hidden",
      defaultValue: "direct",
      storeInMetadata: false,
    },
    {
      name: "waitlistType",
      type: "hidden",
      defaultValue: "standard",
      storeInMetadata: false,
    },
    {
      name: "status",
      type: "hidden",
      defaultValue: "active",
      storeInMetadata: false,
    },
    {
      name: "referralCode",
      type: "hidden",
      defaultValue: "",
      storeInMetadata: false,
    },
    {
      name: "marketingConsent",
      label: "I agree to receive product updates and marketing communications",
      type: "checkbox",
      defaultValue: false,
      storeInMetadata: false,
      columnSpan: 2,
    },
  ],
  metadata: {},
  customStyles: {
    formWrapper: "max-w-xl mx-auto w-full",
    card: "bg-gradient-to-b from-background to-background/80 backdrop-blur-xl border-primary/10 shadow-2xl",
    submitButton:
      "bg-primary hover:bg-primary/90 text-primary-foreground font-medium",
  },
  submitButtonText: "Join Waitlist",
}

export const consumerWaitlistConfig: WaitlistFormConfig = {
  ...(baseWaitlistConfig as WaitlistFormConfig),
  fields: [
    ...baseWaitlistConfig.fields!.slice(0, 2),
    {
      name: "waitlistType",
      type: "hidden",
      defaultValue: "consumer",
      storeInMetadata: false,
    },
    {
      name: "status",
      type: "hidden",
      defaultValue: "active",
      storeInMetadata: false,
    },
    baseWaitlistConfig.fields![5],
    baseWaitlistConfig.fields![6],
  ],
  metadata: {},
  submitButtonText: "Join Consumer Waitlist",
  successMessage: {
    title: "Welcome to the Waitlist! 🎉",
    description: (
      <div className="mt-2 space-y-2">
        <p className="font-medium">{`You're now on our consumer waitlist!`}</p>
        <ul className="space-y-1 text-[15px]">
          <SuccessListItem>Get early access to our platform</SuccessListItem>
          <SuccessListItem>Exclusive launch day offers</SuccessListItem>
        </ul>
      </div>
    ),
  },
}

export const enterpriseWaitlistConfig: WaitlistFormConfig = {
  ...(baseWaitlistConfig as WaitlistFormConfig),
  fields: [
    ...baseWaitlistConfig.fields!.slice(0, 2),
    {
      name: "waitlistType",
      type: "hidden",
      defaultValue: "enterprise",
      storeInMetadata: false,
    },
    {
      name: "status",
      type: "hidden",
      defaultValue: "active",
      storeInMetadata: false,
    },
    {
      name: "company",
      label: "Company Name",
      type: "text",
      required: false,
      placeholder: "Enter your company name",
      storeInMetadata: false,
      columnSpan: 2,
    },
    {
      name: "teamSize",
      label: "Team Size",
      type: "select",
      required: false,
      placeholder: "Select team size",
      storeInMetadata: false,
      columnSpan: 2,
      options: [
        { label: "1-10 employees", value: "1-10" },
        { label: "11-50 employees", value: "11-50" },
        { label: "51-200 employees", value: "51-200" },
        { label: "201-1000 employees", value: "201-1000" },
        { label: "1000+ employees", value: "1000+" },
      ],
    },
    baseWaitlistConfig.fields![5],
    baseWaitlistConfig.fields![6],
  ],
  metadata: {},
  submitButtonText: "Request Enterprise Access",
  customStyles: {
    formWrapper: "max-w-4xl mx-auto w-full",
    card: "bg-gradient-to-br from-primary/5 via-background to-background border-primary/20 shadow-2xl",
    submitButton:
      "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold",
  },
  successMessage: {
    title: "Thank you for your interest! 🚀",
    description: (
      <div className="mt-2 space-y-2">
        <p className="font-medium">
          Your enterprise request has been received!
        </p>
        <ul className="space-y-1 text-[15px]">
          <SuccessListItem>
            Our team will contact you within 24 hours
          </SuccessListItem>
          <SuccessListItem>
            Get priority access to enterprise features
          </SuccessListItem>
          <SuccessListItem>Custom onboarding and support</SuccessListItem>
        </ul>
      </div>
    ),
  },
}

// Helper function to create custom waitlist configs
export function createWaitlistConfig(
  config: Partial<WaitlistFormConfig>
): WaitlistFormConfig {
  const baseConfig = baseWaitlistConfig as WaitlistFormConfig
  return {
    ...baseConfig,
    ...config,
    fields: [...baseConfig.fields, ...(config.fields ?? [])],
    customStyles: {
      ...baseConfig.customStyles,
      ...config.customStyles,
    },
    metadata: config.metadata ?? {},
  }
}
