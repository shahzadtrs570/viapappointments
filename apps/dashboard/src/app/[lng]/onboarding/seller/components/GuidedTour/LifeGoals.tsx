/*eslint-disable import/order*/
/*eslint-disable react/function-component-definition*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/

"use client"

import { useState, useEffect } from "react"
import { InfoIcon } from "lucide-react"
import { Label } from "@package/ui/label"
import { Button } from "@package/ui/button"
import { Textarea } from "@package/ui/textarea"
import { Slider } from "@package/ui/slider"
import { RadioGroup, RadioGroupItem } from "@package/ui/radio-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@package/ui/tooltip"

export interface LifeGoalsData {
  primaryGoal: string
  immediateNeed: number // 0-100 slider representing percentage of immediate cash need
  stayDuration: string
  additionalGoals: string
}

interface LifeGoalsProps {
  data?: LifeGoalsData
  onDataChange: (data: LifeGoalsData) => void
}

export function LifeGoals({ data, onDataChange }: LifeGoalsProps) {
  const [goalsData, setGoalsData] = useState<LifeGoalsData>({
    primaryGoal: data?.primaryGoal || "financial_security",
    immediateNeed: data?.immediateNeed ?? 50,
    stayDuration: data?.stayDuration || "long_term",
    additionalGoals: data?.additionalGoals || "",
  })

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onDataChange(goalsData)
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [JSON.stringify(goalsData), onDataChange])

  const handlePrimaryGoalChange = (value: string) => {
    setGoalsData((prev) => ({
      ...prev,
      primaryGoal: value,
    }))
  }

  const handleImmediateNeedChange = (values: number[]) => {
    setGoalsData((prev) => ({
      ...prev,
      immediateNeed: values[0],
    }))
  }

  const handleStayDurationChange = (value: string) => {
    setGoalsData((prev) => ({
      ...prev,
      stayDuration: value,
    }))
  }

  const handleAdditionalGoalsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setGoalsData((prev) => ({
      ...prev,
      additionalGoals: e.target.value,
    }))
  }

  // Get the displayed value for the immediate need slider
  const getImmediateNeedDisplay = () => {
    if (goalsData.immediateNeed <= 25)
      return "Lower cash upfront, higher monthly income"
    if (goalsData.immediateNeed <= 50) return "Balanced approach"
    if (goalsData.immediateNeed <= 75)
      return "Higher cash upfront, lower monthly income"
    return "Maximum cash upfront"
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          Your goals help us tailor the viager arrangement to your specific
          needs. Every arrangement can be customized to prioritize different
          objectives.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <Label className="text-base font-medium">
              What is your primary goal with this arrangement?
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="size-8 p-0">
                    <InfoIcon className="size-4" />
                    <span className="sr-only">Goal Info</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    {`Your primary goal helps us structure the right arrangement
                    for your needs. Different viager structures can prioritize
                    immediate cash, ongoing income, or staying in your home.`}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <RadioGroup
            value={goalsData.primaryGoal}
            onValueChange={handlePrimaryGoalChange}
            className="gap-4"
          >
            <div className="flex cursor-pointer items-start space-x-2 rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
              <RadioGroupItem
                value="financial_security"
                id="financial_security"
                className="mt-1"
              />
              <div className="grid gap-1">
                <Label
                  htmlFor="financial_security"
                  className="cursor-pointer font-medium"
                >
                  Financial Security
                </Label>
                <div className="text-sm text-gray-500">
                  {`I want to unlock the value in my property to secure my
                  financial future and have more flexibility.`}
                </div>
              </div>
            </div>

            <div className="flex cursor-pointer items-start space-x-2 rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
              <RadioGroupItem
                value="retirement_income"
                id="retirement_income"
                className="mt-1"
              />
              <div className="grid gap-1">
                <Label
                  htmlFor="retirement_income"
                  className="cursor-pointer font-medium"
                >
                  Retirement Income
                </Label>
                <div className="text-sm text-gray-500">
                  I need to supplement my retirement income while continuing to
                  live in my home.
                </div>
              </div>
            </div>

            <div className="flex cursor-pointer items-start space-x-2 rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
              <RadioGroupItem
                value="healthcare_costs"
                id="healthcare_costs"
                className="mt-1"
              />
              <div className="grid gap-1">
                <Label
                  htmlFor="healthcare_costs"
                  className="cursor-pointer font-medium"
                >
                  Healthcare Costs
                </Label>
                <div className="text-sm text-gray-500">
                  I need funds to cover healthcare or long-term care expenses
                  for myself or a loved one.
                </div>
              </div>
            </div>

            <div className="flex cursor-pointer items-start space-x-2 rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
              <RadioGroupItem
                value="family_support"
                id="family_support"
                className="mt-1"
              />
              <div className="grid gap-1">
                <Label
                  htmlFor="family_support"
                  className="cursor-pointer font-medium"
                >
                  Family Support
                </Label>
                <div className="text-sm text-gray-500">
                  I want to help family members with education, housing, or
                  other financial needs.
                </div>
              </div>
            </div>

            <div className="flex cursor-pointer items-start space-x-2 rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
              <RadioGroupItem
                value="lifestyle_improvement"
                id="lifestyle_improvement"
                className="mt-1"
              />
              <div className="grid gap-1">
                <Label
                  htmlFor="lifestyle_improvement"
                  className="cursor-pointer font-medium"
                >
                  Lifestyle Improvement
                </Label>
                <div className="text-sm text-gray-500">
                  I want to enjoy life more, travel, pursue hobbies, or
                  otherwise enhance my lifestyle.
                </div>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <Label className="text-base font-medium">
              Balance Between Immediate Cash and Monthly Income
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="size-8 p-0">
                    <InfoIcon className="size-4" />
                    <span className="sr-only">Balance Info</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Viager arrangements can be structured to provide more
                    upfront cash or higher monthly income. This slider helps us
                    understand your preference.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="space-y-6">
            <Slider
              value={[goalsData.immediateNeed]}
              min={0}
              max={100}
              step={5}
              onValueChange={handleImmediateNeedChange}
              className="mt-2"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Monthly Income</span>
              <span className="font-medium text-primary">
                {getImmediateNeedDisplay()}
              </span>
              <span>Lump Sum</span>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-2 flex items-center justify-between">
            <Label className="text-base font-medium">
              How long do you plan to stay in your property?
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="size-8 p-0">
                    <InfoIcon className="size-4" />
                    <span className="sr-only">Duration Info</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Your intended stay duration affects how we structure the
                    viager arrangement. Different terms can be negotiated based
                    on your plans.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <RadioGroup
            value={goalsData.stayDuration}
            onValueChange={handleStayDurationChange}
            className="gap-3"
          >
            <div className="flex cursor-pointer items-start space-x-2 rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
              <RadioGroupItem
                value="long_term"
                id="long_term"
                className="mt-1"
              />
              <div className="grid gap-1">
                <Label
                  htmlFor="long_term"
                  className="cursor-pointer font-medium"
                >
                  Long-term / Indefinite
                </Label>
                <div className="text-sm text-gray-500">
                  I plan to stay in my property for the rest of my life or as
                  long as possible.
                </div>
              </div>
            </div>

            <div className="flex cursor-pointer items-start space-x-2 rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
              <RadioGroupItem
                value="medium_term"
                id="medium_term"
                className="mt-1"
              />
              <div className="grid gap-1">
                <Label
                  htmlFor="medium_term"
                  className="cursor-pointer font-medium"
                >
                  Medium-term (3-7 years)
                </Label>
                <div className="text-sm text-gray-500">
                  I expect to stay for several years but will likely move
                  eventually.
                </div>
              </div>
            </div>

            <div className="flex cursor-pointer items-start space-x-2 rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
              <RadioGroupItem
                value="short_term"
                id="short_term"
                className="mt-1"
              />
              <div className="grid gap-1">
                <Label
                  htmlFor="short_term"
                  className="cursor-pointer font-medium"
                >
                  Short-term (1-3 years)
                </Label>
                <div className="text-sm text-gray-500">
                  {`I'm planning to move in the relatively near future.`}
                </div>
              </div>
            </div>

            <div className="flex cursor-pointer items-start space-x-2 rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
              <RadioGroupItem value="flexible" id="flexible" className="mt-1" />
              <div className="grid gap-1">
                <Label
                  htmlFor="flexible"
                  className="cursor-pointer font-medium"
                >
                  Flexible / Uncertain
                </Label>
                <div className="text-sm text-gray-500">
                  {`I'm open to different arrangements and my plans may change.`}
                </div>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="mt-8">
          <Label
            htmlFor="additional-goals"
            className="mb-2 block text-base font-medium"
          >
            {`Any other financial or personal goals you'd like to achieve?`}
          </Label>
          <Textarea
            id="additional-goals"
            placeholder={`Tell us about any other goals or concerns you have regarding your property and financial future...`}
            className="min-h-[120px]"
            value={goalsData.additionalGoals}
            onChange={handleAdditionalGoalsChange}
          />
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-amber-100 bg-amber-50 p-4">
        <p className="text-sm text-amber-800">
          <strong>Srenova Tip:</strong>{" "}
          {`Being clear about your goals helps us
          craft the perfect viager arrangement. You can always discuss options
          with our advisors later in the process.`}
        </p>
      </div>
    </div>
  )
}
