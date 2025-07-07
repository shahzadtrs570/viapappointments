/*eslint-disable import/order*/
/*eslint-disable react/function-component-definition*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable @typescript-eslint/consistent-type-imports*/
/*eslint-disable @typescript-eslint/no-unnecessary-condition*/
"use client"

import { MortgageData } from "./MortgageStatus"
import { PropertyAssetsData } from "./PropertyAssets"
import { LifeGoalsData } from "./LifeGoals"
import { Check, AlertTriangle } from "lucide-react"

interface SummaryProps {
  data: {
    mortgage?: MortgageData
    assets?: PropertyAssetsData
    goals?: LifeGoalsData
  }
}

export function Summary({ data }: SummaryProps) {
  const { mortgage, assets, goals } = data

  // Format currency values
  const formatCurrency = (value?: number) => {
    if (value === undefined) return "Not provided"
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Helper to check if a particular section has data
  const hasMortgageData =
    mortgage && (mortgage.hasMortgage || mortgage.hasMortgage === false)
  const hasAssetData =
    assets &&
    (assets.features.length > 0 ||
      assets.renovations.length > 0 ||
      assets.specialNotes)
  const hasGoalData = goals && (goals.primaryGoal || goals.stayDuration)

  // Map primary goal ID to readable text
  const getPrimaryGoalText = (goalId?: string) => {
    switch (goalId) {
      case "financial_security":
        return "Financial Security"
      case "retirement_income":
        return "Retirement Income"
      case "healthcare_costs":
        return "Healthcare Costs"
      case "family_support":
        return "Family Support"
      case "lifestyle_improvement":
        return "Lifestyle Improvement"
      default:
        return "Not specified"
    }
  }

  // Map stay duration ID to readable text
  const getStayDurationText = (durationId?: string) => {
    switch (durationId) {
      case "long_term":
        return "Long-term / Indefinite"
      case "medium_term":
        return "Medium-term (3-7 years)"
      case "short_term":
        return "Short-term (1-3 years)"
      case "flexible":
        return "Flexible / Uncertain"
      default:
        return "Not specified"
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          {`Here's a summary of the information you've provided. This will help us
          create a personalized viager arrangement suggestion for your property.`}
        </p>
      </div>

      {(!hasMortgageData || !hasAssetData || !hasGoalData) && (
        <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
          <div className="flex">
            <AlertTriangle className="mr-2 mt-0.5 size-5 shrink-0 text-amber-600" />
            <p className="text-sm text-amber-800">
              <strong>Some information is missing.</strong> For a more accurate
              assessment, consider completing all sections of the guided tour.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {/* Mortgage Information */}
        <div className="overflow-hidden rounded-lg border">
          <div className="border-b bg-gray-50 p-4">
            <h3 className="font-medium">Mortgage Information</h3>
          </div>
          <div className="p-4">
            {hasMortgageData ? (
              <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <dt className="text-sm text-gray-500">Mortgage Status</dt>
                  <dd className="mt-1 flex items-center">
                    {mortgage?.hasMortgage ? (
                      <span>Property has a mortgage</span>
                    ) : (
                      <span className="flex items-center text-green-700">
                        <Check className="mr-1 size-4" />
                        Property is fully paid off
                      </span>
                    )}
                  </dd>
                </div>

                {mortgage?.hasMortgage && (
                  <>
                    <div>
                      <dt className="text-sm text-gray-500">
                        Remaining Balance
                      </dt>
                      <dd className="mt-1">
                        {formatCurrency(mortgage.remainingBalance)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Monthly Payment</dt>
                      <dd className="mt-1">
                        {formatCurrency(mortgage.monthlyPayment)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Years Remaining</dt>
                      <dd className="mt-1">
                        {mortgage.yearsRemaining !== undefined
                          ? `${mortgage.yearsRemaining} years`
                          : "Not provided"}
                      </dd>
                    </div>
                  </>
                )}
              </dl>
            ) : (
              <p className="italic text-gray-500">
                No mortgage information provided
              </p>
            )}
          </div>
        </div>

        {/* Property Features */}
        <div className="overflow-hidden rounded-lg border">
          <div className="border-b bg-gray-50 p-4">
            <h3 className="font-medium">Property Features</h3>
          </div>
          <div className="p-4">
            {hasAssetData ? (
              <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <dt className="text-sm text-gray-500">Property Features</dt>
                  <dd className="mt-1">
                    {assets?.features.length ? (
                      <div className="flex flex-wrap gap-1">
                        {assets.features.map((feature) => (
                          <span
                            key={feature}
                            className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium capitalize text-blue-700"
                          >
                            {feature.replace(/-/g, " ")}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="italic text-gray-500">
                        None selected
                      </span>
                    )}
                  </dd>
                </div>

                <div className="sm:col-span-2">
                  <dt className="text-sm text-gray-500">Recent Renovations</dt>
                  <dd className="mt-1">
                    {assets?.renovations.length ? (
                      <div className="flex flex-wrap gap-1">
                        {assets.renovations.map((renovation) => (
                          <span
                            key={renovation}
                            className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium capitalize text-green-700"
                          >
                            {renovation.replace(/-/g, " ")}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="italic text-gray-500">
                        None selected
                      </span>
                    )}
                  </dd>
                </div>

                {assets?.specialNotes && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm text-gray-500">Special Notes</dt>
                    <dd className="mt-1 whitespace-pre-line">
                      {assets.specialNotes}
                    </dd>
                  </div>
                )}
              </dl>
            ) : (
              <p className="italic text-gray-500">
                No property features provided
              </p>
            )}
          </div>
        </div>

        {/* Life Goals */}
        <div className="overflow-hidden rounded-lg border">
          <div className="border-b bg-gray-50 p-4">
            <h3 className="font-medium">Your Goals</h3>
          </div>
          <div className="p-4">
            {hasGoalData ? (
              <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-gray-500">Primary Goal</dt>
                  <dd className="mt-1">
                    {getPrimaryGoalText(goals?.primaryGoal)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Stay Duration</dt>
                  <dd className="mt-1">
                    {getStayDurationText(goals?.stayDuration)}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm text-gray-500">
                    Balance Between Cash & Income
                  </dt>
                  <dd className="mt-1">
                    {goals?.immediateNeed !== undefined ? (
                      <div className="space-y-2">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-primary"
                            style={{ width: `${goals.immediateNeed}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Monthly Income</span>
                          <span>Lump Sum</span>
                        </div>
                      </div>
                    ) : (
                      <span className="italic text-gray-500">
                        Not specified
                      </span>
                    )}
                  </dd>
                </div>

                {goals?.additionalGoals && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm text-gray-500">Additional Goals</dt>
                    <dd className="mt-1 whitespace-pre-line">
                      {goals.additionalGoals}
                    </dd>
                  </div>
                )}
              </dl>
            ) : (
              <p className="italic text-gray-500">
                No goals information provided
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-green-100 bg-green-50 p-4">
        <p className="text-sm text-green-800">
          {`Based on this information, our experts
          can provide a personalized viager arrangessment. In the next steps,
          you'll be able to provide more detailed information about your
          property and personal circumstances.`}
        </p>
      </div>
    </div>
  )
}
