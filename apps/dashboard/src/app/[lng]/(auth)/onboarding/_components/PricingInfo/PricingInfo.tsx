"use client"

import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@package/ui/dialog"
import { Feature } from "@package/ui/feature"
import { PricingPlans } from "@package/ui/pricing-plans"
import { Typography } from "@package/ui/typography"

import type { Interval, Plan } from "@package/validations"

import { usePricingInfo } from "../../_hooks/usePricingInfo"

type PricingInfoProps = {
  plan: Plan["plan"]
  interval: Interval["interval"]
}

export function PricingInfo({ interval, plan }: PricingInfoProps) {
  const [isYearlyChecked, setIsYearlyChecked] = useState(true)
  const { planName, billingInterval, priceText, features } = usePricingInfo({
    plan,
    interval,
  })

  return (
    <section className="flex flex-col gap-2">
      <section className="flex items-center gap-2">
        <Typography variant="body">
          {planName + " " + billingInterval}
        </Typography>
        <section className="rounded-xl border px-3 py-1">
          <Typography
            className="font-normal text-muted-foreground"
            variant="body"
          >
            {priceText}
          </Typography>
        </section>
      </section>
      <section className="flex flex-col gap-1">
        {features?.map((feature) => (
          <Feature
            key={feature.name}
            included={feature.included}
            name={feature.name}
          />
        ))}
      </section>
      <Dialog>
        <DialogTrigger className="w-fit">
          <Typography
            className="my-2 cursor-pointer text-muted-foreground underline-offset-4 hover:underline"
            variant="body"
          >
            Compare plans
          </Typography>
        </DialogTrigger>
        <DialogContent className="max-h-[calc(100%-100px)] max-w-[calc(100%-25px)] overflow-auto xs:max-w-[calc(90%-20px)]">
          <DialogHeader>
            <DialogTitle>Pricing</DialogTitle>
          </DialogHeader>
          <PricingPlans
            hideButtons
            checked={isYearlyChecked}
            onCheckedChange={setIsYearlyChecked}
          />
        </DialogContent>
      </Dialog>
    </section>
  )
}
