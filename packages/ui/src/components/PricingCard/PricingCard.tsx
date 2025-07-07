import { cn } from "@package/utils"

import type { SubscriptionPlan } from "@package/utils"

import { Typography } from "@package/ui/typography"

import { Badge } from "../Badge/Badge"
import { Button } from "../Button/Button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../Card/Card"
import { Feature } from "../Feature/Feature"

type PricingCardProps = {
  subscriptionPlan: SubscriptionPlan
  isYearlyChecked: boolean
  hideButtons?: boolean
}

export function PricingCard({
  subscriptionPlan,
  isYearlyChecked,
  hideButtons,
}: PricingCardProps) {
  const url = new URL(process.env.NEXT_PUBLIC_APP_URL!)

  if (process.env.NEXT_PUBLIC_APP_ENV === "production") {
    url.hostname = `app.${url.hostname}`
  }

  const { color, buttonClassName, features, price, tagline, name } =
    subscriptionPlan

  const isPopular = subscriptionPlan.name === "PRO"

  const activePrice = isYearlyChecked ? price.yearly : price.monthly

  return (
    <Card
      className={cn("relative w-full max-w-[360px]", {
        "border-2 border-primary": isPopular,
      })}
    >
      <CardHeader className={cn({ "border-b": hideButtons })}>
        {isPopular && (
          <Badge
            className={cn(
              "absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 px-8 py-2 text-background ",
              color
            )}
          >
            Popular
          </Badge>
        )}
        <CardTitle>
          <section className="flex items-center gap-2">
            <div className={cn("size-5 rounded-full bg-primary", color)} />
            <Typography className="md:text-3xl" variant="h2">
              {name.substring(0, 1) + name.substring(1).toLowerCase()}
            </Typography>
          </section>
        </CardTitle>
        <section className="space-y-4">
          <Typography className="text-muted-foreground">{tagline}</Typography>
          <section className="my-4">
            <Typography className="text-5xl font-extrabold" variant="body">
              ${activePrice}
              <span className="text-base font-normal text-muted-foreground">
                {" "}
                / month
              </span>
            </Typography>
          </section>
          <Typography
            className="text-base text-muted-foreground"
            variant="body"
          >
            Billed {isYearlyChecked ? "yearly" : "monthly"}
          </Typography>
        </section>
      </CardHeader>
      {!hideButtons && (
        <CardContent className="border-y pt-6">
          {
            <Button asChild className={cn(buttonClassName)}>
              <a href={`${url}signup`}>Try for free</a>
            </Button>
          }
        </CardContent>
      )}
      <CardFooter className="flex flex-col items-start gap-2">
        <Typography className="mt-6 text-base font-bold" variant="body">
          What&apos;s included:
        </Typography>
        {features.map((feature) => (
          <Feature
            key={feature.name}
            included={feature.included}
            name={feature.name}
          />
        ))}
      </CardFooter>
    </Card>
  )
}
