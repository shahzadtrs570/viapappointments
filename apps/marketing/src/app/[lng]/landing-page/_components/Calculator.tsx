/* eslint-disable */
"use client"

import type { ChangeEvent } from "react"
import { useMemo, useState } from "react"

import { useParams } from "next/navigation"

import { useTranslation } from "@/lib/i18n/client"

// Helper to format currency
const formatCurrency = (value: number, lng: string = "en") => {
  return new Intl.NumberFormat(lng === "en" ? "en-US" : lng, {
    style: "currency",
    currency: lng === "en" ? "USD" : "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

// Remove currency formatting for input field
const stripCurrencyFormat = (value: string): string => {
  return value.replace(/[^0-9]/g, "")
}

// Credit score ranges and their APRs
const creditScoreRanges = [
  { range: "800+", minScore: 800, apr: 5.99 },
  { range: "750-799", minScore: 750, apr: 7.99 },
  { range: "700-749", minScore: 700, apr: 9.99 },
  { range: "650-699", minScore: 650, apr: 11.99 },
  { range: "600-649", minScore: 600, apr: 13.99 },
  { range: "Below 600", minScore: 0, apr: 18.99 },
]

// Get APR from credit score range
const getAPRFromRange = (range: string): number => {
  const scoreRange = creditScoreRanges.find((r) => r.range === range)
  return scoreRange?.apr || 18.99
}

// Calculate monthly payment using loan formula
const calculateMonthlyPayment = (
  principal: number,
  apr: number,
  termMonths: number
): number => {
  const monthlyRate = apr / 100 / 12

  if (monthlyRate === 0) {
    return principal / termMonths
  }

  return (
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) /
    (Math.pow(1 + monthlyRate, termMonths) - 1)
  )
}

export function Calculator() {
  const params = useParams()
  const lng = params.lng as string
  const { t } = useTranslation(lng, "calculator")

  const [carValue] = useState(25000) // Estimated car value for the calculation
  const [downPayment, setDownPayment] = useState(2350)
  const [creditScoreRange, setCreditScoreRange] = useState("700-749")
  const [loanTerm, setLoanTerm] = useState(72)
  const [includeTradeIn, setIncludeTradeIn] = useState(false)
  const [isEditingDownPayment, setIsEditingDownPayment] = useState(false)
  const [downPaymentInput, setDownPaymentInput] = useState(
    downPayment.toString()
  )

  const calculationResults = useMemo(() => {
    const effectiveDownPayment = includeTradeIn
      ? downPayment + 3000
      : downPayment // Assume $3k trade-in value
    const loanAmount = Math.max(0, carValue - effectiveDownPayment)
    const apr = getAPRFromRange(creditScoreRange)

    const monthlyPayment = calculateMonthlyPayment(loanAmount, apr, loanTerm)
    const totalPayments = monthlyPayment * loanTerm

    return {
      loanAmount,
      monthlyPayment,
      totalPayments,
      apr,
    }
  }, [carValue, downPayment, creditScoreRange, loanTerm, includeTradeIn])

  const handleDownPaymentChange = (event: ChangeEvent<HTMLInputElement>) => {
    const rawValue = stripCurrencyFormat(event.target.value)
    setDownPaymentInput(rawValue)

    if (rawValue === "") {
      return
    }

    const numericValue = Number(rawValue)
    if (!isNaN(numericValue)) {
      setDownPayment(numericValue)
    }
  }

  const handleDownPaymentBlur = () => {
    setIsEditingDownPayment(false)
    let numericValue = Number(downPaymentInput)
    if (isNaN(numericValue) || numericValue < 0) {
      numericValue = 0
    }

    setDownPayment(numericValue)
    setDownPaymentInput(numericValue.toString())
  }

  const displayDownPayment = isEditingDownPayment
    ? downPaymentInput
    : downPayment.toString()

  return (
    <section
      className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16"
      id="calculator"
    >
      <div className="mx-auto max-w-3xl">
        <div className="mx-auto mb-8 text-center sm:mb-12">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Car Payment Calculator
          </h2>
          <p className="text-lg text-gray-600">
            Calculate your estimated monthly payment
          </p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-lg">
          {/* Input Fields Grid */}
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            {/* Down Payment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Est. down payment
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="text"
                  value={displayDownPayment}
                  onChange={handleDownPaymentChange}
                  onFocus={(e) => {
                    setIsEditingDownPayment(true)
                    setDownPaymentInput(downPayment.toString())
                    e.target.select()
                  }}
                  onBlur={handleDownPaymentBlur}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-medium"
                  placeholder="2350"
                />
              </div>
            </div>

            {/* Loan Term */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan term
              </label>
              <select
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-medium bg-white"
              >
                <option value={36}>36 months</option>
                <option value={48}>48 months</option>
                <option value={60}>60 months</option>
                <option value={72}>72 months</option>
                <option value={84}>84 months</option>
              </select>
            </div>

            {/* Credit Score */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Credit score
              </label>
              <select
                value={creditScoreRange}
                onChange={(e) => setCreditScoreRange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-medium bg-white"
              >
                {creditScoreRanges.map((range) => (
                  <option key={range.range} value={range.range}>
                    {range.range}
                  </option>
                ))}
              </select>
            </div>

            {/* Monthly Payment Display */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Est. monthly payment
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="text"
                  value={Math.round(
                    calculationResults.monthlyPayment
                  ).toString()}
                  readOnly
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-lg font-medium text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Trade-in Toggle */}
          <div className="flex items-center mb-8">
            <button
              type="button"
              onClick={() => setIncludeTradeIn(!includeTradeIn)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                includeTradeIn ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  includeTradeIn ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className="ml-3 text-sm font-medium text-gray-700">
              Include trade-in
            </span>
          </div>

          {/* Results Display */}
          <div className="text-center border-t pt-8">
            <div className="mb-2">
              <span className="text-5xl font-bold text-gray-900">
                {formatCurrency(calculationResults.totalPayments, lng)}
              </span>
            </div>
            <div className="mb-4">
              <span className="text-lg text-gray-600">
                with {calculationResults.apr}% APR
              </span>
              <button className="ml-2 inline-flex items-center justify-center w-5 h-5 bg-gray-200 rounded-full text-gray-500 hover:bg-gray-300">
                <span className="text-xs">?</span>
              </button>
            </div>
            <div className="text-sm text-gray-600">
              Not ready to pre-qualify?{" "}
              <button className="text-blue-600 hover:text-blue-700 underline">
                Shop by estimated budget
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
