/*eslint-disable import/order*/
/*eslint-disable react/function-component-definition*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/
"use client"

import { useState, useEffect } from "react"
import { Check, FileText, InfoIcon } from "lucide-react"
import { Label } from "@package/ui/label"
import { RadioGroup, RadioGroupItem } from "@package/ui/radio-group"
import { Input } from "@package/ui/input"
import { Slider } from "@package/ui/slider"
import { Button } from "@package/ui/button"
import { Alert, AlertDescription } from "@package/ui/alert"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@package/ui/tooltip"

export interface MortgageData {
  hasMortgage: boolean
  remainingBalance?: number
  monthlyPayment?: number
  yearsRemaining?: number
}

interface MortgageStatusProps {
  data?: MortgageData
  onDataChange: (data: MortgageData) => void
}

export function MortgageStatus({ data, onDataChange }: MortgageStatusProps) {
  const [mortgageData, setMortgageData] = useState<MortgageData>({
    hasMortgage: data?.hasMortgage ?? false,
    remainingBalance: data?.remainingBalance,
    monthlyPayment: data?.monthlyPayment,
    yearsRemaining: data?.yearsRemaining ?? 15,
  })

  useEffect(() => {
    const handleChange = () => {
      onDataChange(mortgageData)
    }

    const timeoutId = setTimeout(handleChange, 100)

    return () => clearTimeout(timeoutId)
  }, [JSON.stringify(mortgageData), onDataChange])

  // Format currency values
  const formatCurrency = (value?: number) => {
    if (value === undefined) return ""
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Handle mortgage status change
  const handleMortgageStatusChange = (value: string) => {
    setMortgageData((prev) => ({
      ...prev,
      hasMortgage: value === "yes",
      // Reset other values if "no" is selected
      ...(value === "no" && {
        remainingBalance: undefined,
        monthlyPayment: undefined,
        yearsRemaining: undefined,
      }),
    }))
  }

  // Handle remaining balance change
  const handleRemainingBalanceChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value
      ? parseInt(e.target.value.replace(/[^0-9]/g, ""), 10)
      : undefined
    setMortgageData((prev) => ({
      ...prev,
      remainingBalance: value,
    }))
  }

  // Handle monthly payment change
  const handleMonthlyPaymentChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value
      ? parseInt(e.target.value.replace(/[^0-9]/g, ""), 10)
      : undefined
    setMortgageData((prev) => ({
      ...prev,
      monthlyPayment: value,
    }))
  }

  // Handle years remaining change
  const handleYearsRemainingChange = (values: number[]) => {
    setMortgageData((prev) => ({
      ...prev,
      yearsRemaining: values[0],
    }))
  }

  return (
    <div className="space-y-6">
      <Alert className="border-primary/20 bg-primary/10">
        <InfoIcon className="size-4" />
        <AlertDescription className="text-sm text-primary-foreground/80">
          {`Your mortgage status helps us understand your property's financial
          situation. This information is kept private and is only used to
          structure a suitable viager arrangement.`}
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <Label className="text-base font-medium">
              Does your property currently have a mortgage?
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="size-8 p-0">
                    <InfoIcon className="size-4" />
                    <span className="sr-only">Mortgage Info</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    {`Having a mortgage doesn't prevent a viager arrangement, but
                    it affects how we structure the deal. We'll need to factor
                    in the remaining balance.`}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <RadioGroup
            value={mortgageData.hasMortgage ? "yes" : "no"}
            onValueChange={handleMortgageStatusChange}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes" />
              <Label htmlFor="yes" className="cursor-pointer">
                Yes, my property has a mortgage
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no" />
              <Label htmlFor="no" className="cursor-pointer">
                No, my property is fully paid off
              </Label>
            </div>
          </RadioGroup>
        </div>

        {mortgageData.hasMortgage && (
          <div className="space-y-6 duration-300 animate-in fade-in-50">
            <div className="space-y-2">
              <Label
                htmlFor="remaining-balance"
                className="text-base font-medium"
              >
                Remaining Balance
              </Label>
              <Input
                id="remaining-balance"
                type="text"
                placeholder="£150,000"
                value={
                  mortgageData.remainingBalance !== undefined
                    ? formatCurrency(mortgageData.remainingBalance)
                    : ""
                }
                onChange={handleRemainingBalanceChange}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="monthly-payment"
                className="text-base font-medium"
              >
                Monthly Payment
              </Label>
              <Input
                id="monthly-payment"
                type="text"
                placeholder="£850"
                value={
                  mortgageData.monthlyPayment !== undefined
                    ? formatCurrency(mortgageData.monthlyPayment)
                    : ""
                }
                onChange={handleMonthlyPaymentChange}
                className="w-full"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="years-remaining"
                  className="text-base font-medium"
                >
                  Years Remaining on Mortgage
                </Label>
                <span className="font-medium text-primary">
                  {mortgageData.yearsRemaining} years
                </span>
              </div>
              <Slider
                id="years-remaining"
                min={1}
                max={30}
                step={1}
                value={[mortgageData.yearsRemaining ?? 15]}
                onValueChange={handleYearsRemainingChange}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>1 year</span>
                <span>15 years</span>
                <span>30 years</span>
              </div>
            </div>

            <Alert className="bg-warning/10 border-warning/20">
              <FileText className="text-warning size-4" />
              <AlertDescription className="text-warning-foreground/80 text-sm">
                <strong>Note:</strong> In a viager arrangement, the mortgage is
                typically paid off as part of the transaction. The remaining
                balance will be factored into the bouquet (initial payment).
              </AlertDescription>
            </Alert>
          </div>
        )}

        {!mortgageData.hasMortgage && (
          <Alert className="border-success/20 bg-success/10 duration-300 animate-in fade-in-50">
            <Check className="size-4 text-success" />
            <AlertDescription className="text-success-foreground/80 text-sm">
              <strong>Great!</strong> Having no mortgage gives you maximum
              flexibility with your viager arrangement. This allows us to
              structure a deal that maximizes both your upfront payment and
              ongoing income.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
