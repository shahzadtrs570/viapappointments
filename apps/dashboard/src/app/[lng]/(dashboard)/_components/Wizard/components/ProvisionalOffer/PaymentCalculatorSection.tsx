/*eslint-disable*/

import { Slider } from "@package/ui/slider"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"

interface PaymentCalculatorSectionProps {
  offerDocument: any
  sliderPercent: number
  minLumpSum: number
  maxLumpSum: number
  roundedLumpSum: number
  roundedMonthly: number
  PURCHASE_PRICE: number
  onSliderChange: (value: number) => void
  onDispatchLogDecision: (action: any) => void
  marketValue: number
  CONTRACT_DURATION: number
}

export function PaymentCalculatorSection({
  offerDocument,
  sliderPercent,
  minLumpSum,
  maxLumpSum,
  roundedLumpSum,
  roundedMonthly,
  PURCHASE_PRICE,
  onSliderChange,
  onDispatchLogDecision,
  marketValue,
  CONTRACT_DURATION,
}: PaymentCalculatorSectionProps) {
  const { t } = useClientTranslation(["wizard_provisional_offer"])

  const handleSliderChange = (values: number[]) => {
    const newSliderPercent = values[0]
    onSliderChange(newSliderPercent)

    // Log the decision
    onDispatchLogDecision({
      action: "BALANCE_ADJUSTMENT",
      details: {
        sliderPercent: newSliderPercent,
        marketValue,
        lumpSum:
          minLumpSum + (maxLumpSum - minLumpSum) * (newSliderPercent / 100),
        contractDuration: CONTRACT_DURATION,
      },
    })
  }

  return (
    <div className="mb-4 rounded-lg border border-border bg-card p-6 sm:mb-8">
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Column - Inputs */}
        <div>
          {/* Market Value Input */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <label className="text-lg font-medium text-foreground">
                {t("wizard_provisional_offer:paymentCalculator.homeValueLabel")}
              </label>
              <div className="inline-block rounded-lg border border-border bg-background px-4 py-2">
                <span className="text-2xl font-bold">
                  {offerDocument?.confirmedValue?.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Shadcn Slider */}
            <div className="relative mt-6">
              <Slider
                className="relative w-full cursor-pointer"
                max={100}
                min={0}
                step={1}
                value={[sliderPercent]}
                onValueChange={handleSliderChange}
              />
              <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                <span>
                  {t(
                    "wizard_provisional_offer:paymentCalculator.minLumpSumLabel"
                  )}{" "}
                  <span className="font-bold">
                    £{minLumpSum.toLocaleString()}
                  </span>
                </span>
                <span>
                  {t(
                    "wizard_provisional_offer:paymentCalculator.maxLumpSumLabel"
                  )}{" "}
                  <span className="font-bold">
                    £{maxLumpSum.toLocaleString()}
                  </span>
                </span>
              </div>
            </div>

            <div className="my-4 w-full border-t-2 border-dashed border-gray-200 sm:my-6" />

            <div className="mt-2 text-sm text-muted-foreground">
              {t(
                "wizard_provisional_offer:paymentCalculator.sliderDescription"
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Results Card */}
        <div className="rounded-lg border-2 border-gray-300 p-4">
          {/* Lump Sum Display */}
          <div className="mb-8">
            <div className="mb-2 inline-block rounded-xl bg-gray-100 px-3 py-1">
              <span className="text-xs font-bold uppercase tracking-wide">
                {t(
                  "wizard_provisional_offer:paymentCalculator.lumpSumSection.title"
                )}
              </span>
            </div>
            <div className="mb-1">
              <span className="text-3xl font-bold">
                £{roundedLumpSum.toLocaleString()}
              </span>
              <span className="ml-2 text-lg">
                {t(
                  "wizard_provisional_offer:paymentCalculator.lumpSumSection.upfrontLabel"
                )}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {t(
                "wizard_provisional_offer:paymentCalculator.lumpSumSection.description"
              )}
            </p>
          </div>

          {/* Monthly Payment Display */}
          <div className="mb-8">
            <div className="mb-2 inline-block rounded-xl bg-gray-100 px-3 py-1">
              <span className="text-xs font-bold uppercase tracking-wide">
                {t(
                  "wizard_provisional_offer:paymentCalculator.monthlyPaymentSection.title"
                )}
              </span>
            </div>
            <div className="mb-1">
              <span className="text-3xl font-bold">
                £{roundedMonthly.toLocaleString()}
              </span>
              <span className="ml-2 text-lg">
                {(t as any)(
                  "wizard_provisional_offer:paymentCalculator.monthlyPaymentSection.durationLabel",
                  {
                    duration: offerDocument?.contractDuration,
                  }
                )}
              </span>
            </div>
          </div>

          {/* Purchase Price Note */}
          <div className="text-sm text-gray-600">
            {t("wizard_provisional_offer:paymentCalculator.purchasePriceNote")}{" "}
            <span className="font-bold">
              £{PURCHASE_PRICE.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Override shadcn slider styles for this specific use case */
        :global(.slider-track) {
          height: 4px !important;
          background: #e5e7eb !important;
        }

        :global(.slider-range) {
          background: #000 !important;
        }

        :global(.slider-thumb) {
          width: 24px !important;
          height: 24px !important;
          background: white !important;
          border: 3px solid black !important;
          box-shadow: none !important;
        }

        :global(.slider-thumb:hover),
        :global(.slider-thumb:focus) {
          background: white !important;
        }
      `}</style>
    </div>
  )
}
