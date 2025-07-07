"use client"

import type { ChangeEvent } from "react"
import { useEffect, useMemo, useState } from "react"

import { useParams } from "next/navigation"

import { useTranslation } from "@/lib/i18n/client"

// Helper to format currency
const formatCurrency = (value: number, lng: string = "en") => {
  return new Intl.NumberFormat(lng === "en" ? "en-GB" : lng, {
    // Basic locale handling for currency
    style: "currency",
    currency: lng === "en" ? "GBP" : "EUR", // Assuming GBP for EN, EUR for others as example
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

// Remove currency formatting for input field
const stripCurrencyFormat = (value: string): string => {
  return value.replace(/[^0-9]/g, "")
}

interface CalculatorControlsProps {
  t: (key: string, options?: Record<string, string | number>) => string
  lng: string
  homeValue: number
  onHomeValueChange: (value: number) => void
  paymentPreference: string | null
  onPaymentPreferenceChange: (value: string | null) => void
}

function CalculatorControls({
  t,
  lng,
  homeValue,
  onHomeValueChange,
  paymentPreference,
  onPaymentPreferenceChange,
}: CalculatorControlsProps) {
  // Track the input value separately from the actual homeValue
  const [inputValue, setInputValue] = useState<string>(homeValue.toString())
  const [isEditing, setIsEditing] = useState(false)

  // Update the slider's visual appearance when value changes
  const updateSliderAppearance = (value: number) => {
    const slider = document.getElementById("home-value-slider")
    if (slider) {
      const min = parseFloat(slider.getAttribute("min") || "150000")
      const max = parseFloat(slider.getAttribute("max") || "3000000")
      const percent = ((value - min) / (max - min)) * 100
      slider.style.setProperty("--thumb-percent", `${percent}%`)
    }
  }

  // Initialize the slider's appearance and set up event listener
  useEffect(() => {
    const slider = document.getElementById("home-value-slider")
    if (slider) {
      // Initial setup
      updateSliderAppearance(homeValue)
    }
  }, [])

  // Update slider appearance whenever homeValue changes
  useEffect(() => {
    updateSliderAppearance(homeValue)
  }, [homeValue])

  const handleSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value)
    onHomeValueChange(newValue)
    setInputValue(newValue.toString())
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const rawValue = stripCurrencyFormat(event.target.value)

    // If user tries to enter more than 7 digits (>3M)
    if (rawValue.length > 7) {
      return // Ignore input that would exceed 3M
    }

    setInputValue(rawValue)

    if (rawValue === "") {
      // Don't update the homeValue to 0 when the field is empty
      // This allows for natural backspace behavior
      return
    }

    const numericValue = Number(rawValue)
    if (!isNaN(numericValue)) {
      // Strictly enforce max value during typing
      const boundedValue = Math.min(numericValue, 3000000)

      if (boundedValue !== numericValue) {
        // If we had to cap the value, update the input field too
        setInputValue(boundedValue.toString())
      }

      // Only update home value if it's at least the minimum
      if (boundedValue >= 150000) {
        onHomeValueChange(boundedValue)
      }
    }
  }

  // Handle blur event to ensure value is within bounds
  const handleBlur = () => {
    setIsEditing(false)
    let numericValue = Number(inputValue)
    if (isNaN(numericValue) || numericValue < 150000) {
      numericValue = 150000
    } else if (numericValue > 3000000) {
      numericValue = 3000000
    }

    onHomeValueChange(numericValue)
    setInputValue(numericValue.toString())
  }

  // Show raw value when editing, formatted value when not editing
  const displayValue = isEditing
    ? inputValue
    : formatCurrency(homeValue, lng).replace(/\s/g, "")

  return (
    <div className="flex flex-col justify-between">
      <div>
        <div className="mb-6 sm:mb-8">
          <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <label
              className="text-md block font-medium text-foreground"
              htmlFor="home-value-text"
            >
              {t("controls.home_value_label")}
            </label>
            {/* Text input for home value */}
            <input
              className="text-md mt-2 w-full rounded border p-2 text-right font-bold text-foreground sm:mt-0 sm:w-1/3 sm:text-lg"
              id="home-value-text"
              type="text"
              value={displayValue}
              onBlur={handleBlur}
              onChange={handleInputChange}
              onFocus={(e) => {
                setIsEditing(true)
                // When focusing, show the raw numeric value for easier editing
                setInputValue(homeValue.toString())
                // Select all text for easier replacement
                e.target.select()
              }}
            />
          </div>
          <div className="relative mt-4 sm:mt-0">
            <label className="sr-only" htmlFor="home-value-slider">
              {t("controls.home_value_label")}
            </label>
            <input
              className="custom-slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
              id="home-value-slider"
              max="3000000"
              min="150000"
              step="10000"
              type="range"
              value={homeValue}
              onChange={handleSliderChange}
            />
            {/* No need for the script here - we'll handle the updates in React */}
            <div className="mt-2 flex justify-between">
              <span className="text-xs text-gray-500">
                {formatCurrency(150000, lng)}
              </span>
              <span className="text-xs text-gray-500">
                {t("controls.max_value_plus")}
              </span>
            </div>
          </div>
        </div>
        <div className="my-4 w-full border-t-2 border-dashed border-gray-200 sm:my-6" />

        <div className="mb-6 sm:mb-8">
          <p className="text-md mb-2 font-medium text-foreground">
            {t("controls.payment_preference.label")}
          </p>
          <div className="space-y-3">
            <label
              className="flex w-fit cursor-pointer items-center rounded-full border border-gray-300 p-2 px-3 transition-colors hover:border-gray-400 has-[:checked]:border-black sm:px-4"
              htmlFor="payment-option-balanced"
            >
              <input
                checked={paymentPreference === "balanced"}
                className="peer sr-only"
                id="payment-option-balanced"
                name="payment-preference"
                type="radio"
                onChange={() =>
                  onPaymentPreferenceChange(
                    paymentPreference === "balanced" ? null : "balanced"
                  )
                }
              />
              <img
                alt="Unchecked"
                className="mr-2 size-4 peer-checked:hidden sm:mr-3 sm:size-6"
                src="/images/radio-unchecked.svg"
              />
              <img
                alt="Checked"
                className="mr-2 hidden size-4 peer-checked:block sm:mr-3 sm:size-6"
                src="/images/radio-checked.svg"
              />
              <span className="text-sm font-medium text-foreground">
                {t("controls.payment_preference.options.balanced")}
              </span>
            </label>

            <label
              className="flex w-fit cursor-pointer items-center rounded-full border border-gray-300 p-2 px-3 transition-colors hover:border-gray-400 has-[:checked]:border-black dark:border-gray-300 dark:hover:border-gray-300 sm:px-4"
              htmlFor="payment-option-lumpSum"
            >
              <input
                checked={paymentPreference === "lumpSum"}
                className="peer sr-only"
                id="payment-option-lumpSum"
                name="payment-preference"
                type="radio"
                onChange={() =>
                  onPaymentPreferenceChange(
                    paymentPreference === "lumpSum" ? null : "lumpSum"
                  )
                }
              />
              <img
                alt="Unchecked"
                className="mr-2 size-4 peer-checked:hidden sm:mr-3 sm:size-6"
                src="/images/radio-unchecked.svg"
              />
              <img
                alt="Checked"
                className="mr-2 hidden size-4 peer-checked:block sm:mr-3 sm:size-6"
                src="/images/radio-checked.svg"
              />
              <span className="text-sm font-medium text-foreground">
                {t("controls.payment_preference.options.lump_sum")}
              </span>
            </label>

            <label
              className="flex w-fit cursor-pointer items-center rounded-full border border-gray-300 p-2 px-3 transition-colors hover:border-gray-400 has-[:checked]:border-black dark:border-gray-300 dark:hover:border-gray-300 sm:px-4"
              htmlFor="payment-option-monthly"
            >
              <input
                checked={paymentPreference === "monthly"}
                className="peer sr-only"
                id="payment-option-monthly"
                name="payment-preference"
                type="radio"
                onChange={() =>
                  onPaymentPreferenceChange(
                    paymentPreference === "monthly" ? null : "monthly"
                  )
                }
              />
              <img
                alt="Unchecked"
                className="mr-2 size-5 peer-checked:hidden sm:mr-3 sm:size-6"
                src="/images/radio-unchecked.svg"
              />
              <img
                alt="Checked"
                className="mr-2 hidden size-5 peer-checked:block sm:mr-3 sm:size-6"
                src="/images/radio-checked.svg"
              />
              <span className="text-sm font-medium text-foreground">
                {t("controls.payment_preference.options.monthly")}
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

interface CalculatorResultsProps {
  t: (key: string, options?: Record<string, string | number>) => string
  lng: string
  homeValue: number
  srenovaOffer: number
  lumpSumPayment: number
  monthlyPayment: number
}

function CalculatorResults({
  t,
  lng,
  srenovaOffer,
  lumpSumPayment,
  monthlyPayment,
}: CalculatorResultsProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="rounded-2xl border border-gray-400 bg-white p-4 sm:p-6">
        {/* Lump Sum Section */}
        <div className="mb-4">
          <div className="mb-2 inline-block rounded-2xl bg-gray-200 px-2 py-1 sm:px-3">
            <span className="text-xs font-bold uppercase tracking-wide text-foreground">
              {t("results.lump_sum.label")}
            </span>
          </div>
          <div className="mb-1 text-2xl font-bold text-gray-900 sm:text-3xl">
            {formatCurrency(lumpSumPayment, lng)}{" "}
            {t("results.lump_sum.duration_short")}
          </div>
          <p className="text-xs text-foreground sm:text-sm">
            {t("results.lump_sum.description")}
          </p>
        </div>
        <div className="my-4 w-full border-t-2 border-dashed border-gray-200 sm:my-6" />

        {/* Monthly Payment Section */}
        <div>
          <div className="mb-2 inline-block rounded-2xl bg-gray-200 px-2 py-1 sm:px-3">
            <span className="text-xs font-bold uppercase tracking-wide text-foreground">
              {t("results.monthly.label")}
            </span>
          </div>
          <div className="mb-1 text-2xl font-bold text-foreground sm:text-3xl">
            {formatCurrency(monthlyPayment, lng)}{" "}
            {t("results.monthly.duration_short")}
          </div>
        </div>
        <div className="my-4 w-full border-t-2 border-dashed border-gray-200 sm:my-6" />

        {/* Offer Basis Text */}
        <p className="text-xs text-foreground">
          {t("results.offer_basis", {
            offer: formatCurrency(srenovaOffer, lng),
          })}
        </p>
      </div>
      <p className="text-center text-xs text-foreground">
        {t("results.disclaimer")}
      </p>
    </div>
  )
}

export function Calculator() {
  const params = useParams()
  const lng = params.lng as string
  const { t } = useTranslation(lng, "calculator")

  const [homeValue, setHomeValue] = useState(750000)
  const [paymentPreference, setPaymentPreference] = useState<string | null>(
    "balanced"
  )

  const srenovaOffer = useMemo(() => homeValue * 0.8, [homeValue])

  const { lumpSumPayment, monthlyPayment } = useMemo(() => {
    // Balanced calculation (default)
    let lumpSum = srenovaOffer * 0.3
    let monthlyTotal = srenovaOffer * 0.7
    let monthly = monthlyTotal / (20 * 12)

    // Override based on user selection
    if (paymentPreference === "lumpSum") {
      // Large lump sum: 40% upfront, 60% paid monthly over 20 years
      lumpSum = srenovaOffer * 0.4
      monthlyTotal = srenovaOffer * 0.6
      monthly = monthlyTotal / (20 * 12)
    } else if (paymentPreference === "monthly") {
      // Prioritize monthly: 10% upfront, 90% paid monthly over 20 years
      lumpSum = srenovaOffer * 0.1
      monthlyTotal = srenovaOffer * 0.9
      monthly = monthlyTotal / (20 * 12)
    }
    // balanced option uses the default calculation

    return { lumpSumPayment: lumpSum, monthlyPayment: monthly }
  }, [srenovaOffer, paymentPreference])

  return (
    <section
      className="container mx-auto max-w-6xl rounded-3xl bg-gradient-to-r from-[#FBFCFF] to-[#F1F6FF] px-4 py-12 dark:from-background dark:to-background sm:px-6 sm:py-16 md:py-20 lg:py-32"
      id="calculator"
    >
      <div className="mx-auto max-w-6xl rounded-3xl">
        <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-12 md:mb-16">
          <h2 className="mb-3 text-4xl font-bold tracking-tight text-gray-900 sm:mb-4  md:text-5xl">
            <span className="bg-gradient-to-r from-[#CA8A04] via-[#F5B329] to-[#F5B329] bg-clip-text text-transparent">
              {t("title.srenova")}
            </span>
            <span className="text-foreground"> {t("title.calculator")}</span>
          </h2>
          <p className="mt-8 text-xs text-foreground sm:text-lg">
            {t("description")}
          </p>
        </div>

        <div className="mx-auto max-w-4xl overflow-hidden p-4 sm:p-6 md:p-8">
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
            <CalculatorControls
              homeValue={homeValue}
              lng={lng}
              paymentPreference={paymentPreference}
              t={t}
              onHomeValueChange={setHomeValue}
              onPaymentPreferenceChange={setPaymentPreference}
            />
            <CalculatorResults
              homeValue={homeValue}
              lng={lng}
              lumpSumPayment={lumpSumPayment}
              monthlyPayment={monthlyPayment}
              srenovaOffer={srenovaOffer}
              t={t}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
