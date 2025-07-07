/*eslint-disable*/

import { Typography } from "@package/ui/typography"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"

interface AgreementSectionProps {
  offerDocument: any
  roundedLumpSum: number
  roundedMonthly: number
  monthlyTotal: number
  totalMonthlyPayments: number
  totalBenefit: number
  netBenefitPercentage: number
  contractDuration: number
  marketValue: number
  offerPrice: number
  fullName: string
  agreementChecked: boolean
  onFullNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onAgreementCheckedChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function AgreementSection({
  offerDocument,
  roundedLumpSum,
  roundedMonthly,
  monthlyTotal,
  totalMonthlyPayments,
  totalBenefit,
  netBenefitPercentage,
  contractDuration,
  marketValue,
  offerPrice,
  fullName,
  agreementChecked,
  onFullNameChange,
  onAgreementCheckedChange,
}: AgreementSectionProps) {
  const { t } = useClientTranslation(["wizard_provisional_offer"])

  return (
    <div className="mb-4 rounded-lg border border-border bg-card p-3 sm:mb-8 sm:p-6">
      {/* Detailed Terms & Conditions */}
      <div className="mb-4 sm:mb-6">
        <Typography
          className="mb-2 text-base font-semibold text-card-foreground sm:mb-3 sm:text-lg"
          variant="h4"
        >
          {t("wizard_provisional_offer:agreement.termsAndConditions.title")}
        </Typography>

        <div className="mb-3 sm:mb-4">
          <Typography
            className="mb-1 text-sm font-medium text-card-foreground sm:mb-2"
            variant="h4"
          >
            {t(
              "wizard_provisional_offer:agreement.termsAndConditions.purchaseStructure.title"
            )}
          </Typography>
          <Typography
            className="mb-1 text-xs text-muted-foreground sm:mb-2 sm:text-sm"
            variant="body"
          >
            {t(
              "wizard_provisional_offer:agreement.termsAndConditions.purchaseStructure.intro"
            )}
          </Typography>
          <ul className="list-disc space-y-1 pl-4 text-xs text-muted-foreground sm:pl-5 sm:text-sm">
            <li>
              {(t as any)(
                "wizard_provisional_offer:agreement.termsAndConditions.purchaseStructure.salePrice",
                {
                  price: offerPrice.toLocaleString(),
                  percentage: 80,
                  marketValue: marketValue.toLocaleString(),
                }
              )}
            </li>
            <li>
              <strong>
                {t(
                  "wizard_provisional_offer:agreement.termsAndConditions.purchaseStructure.paymentStructure.title"
                )}
              </strong>
              <ul>
                <li>
                  {(t as any)(
                    "wizard_provisional_offer:agreement.termsAndConditions.purchaseStructure.paymentStructure.lumpSum",
                    {
                      amount: roundedLumpSum.toLocaleString(),
                    }
                  )}
                </li>
                <li>
                  {(t as any)(
                    "wizard_provisional_offer:agreement.termsAndConditions.purchaseStructure.paymentStructure.remainingBalance",
                    {
                      amount: monthlyTotal.toLocaleString(),
                    }
                  )}
                </li>
                <li>
                  {(t as any)(
                    "wizard_provisional_offer:agreement.termsAndConditions.purchaseStructure.paymentStructure.monthlyPayments",
                    {
                      amount: roundedMonthly.toLocaleString(),
                      duration: contractDuration,
                    }
                  )}
                </li>
              </ul>
            </li>
            <li>
              <strong>
                {t(
                  "wizard_provisional_offer:agreement.termsAndConditions.purchaseStructure.annualAdjustment"
                )}
              </strong>
            </li>
          </ul>
        </div>

        <div className="mb-3 sm:mb-4">
          <Typography
            className="mb-1 text-sm font-medium text-card-foreground sm:mb-2"
            variant="h4"
          >
            {t(
              "wizard_provisional_offer:agreement.termsAndConditions.lifetimeOccupancy.title"
            )}
          </Typography>
          <Typography
            className="mb-1 text-xs text-muted-foreground sm:mb-2 sm:text-sm"
            variant="body"
          >
            {t(
              "wizard_provisional_offer:agreement.termsAndConditions.lifetimeOccupancy.intro"
            )}
          </Typography>
          <ul className="list-disc space-y-1 pl-4 text-xs text-muted-foreground sm:pl-5 sm:text-sm">
            <li>
              <strong>
                {t(
                  "wizard_provisional_offer:agreement.termsAndConditions.lifetimeOccupancy.rightOfResidence"
                )}
              </strong>
            </li>
            <li>
              <strong>
                {t(
                  "wizard_provisional_offer:agreement.termsAndConditions.lifetimeOccupancy.occupancyTerms"
                )}
              </strong>
            </li>
            <li>
              <strong>
                {t(
                  "wizard_provisional_offer:agreement.termsAndConditions.lifetimeOccupancy.maintenanceResponsibilities"
                )}
              </strong>
            </li>
            <li>
              <strong>
                {t(
                  "wizard_provisional_offer:agreement.termsAndConditions.lifetimeOccupancy.structuralRepairs"
                )}
              </strong>
            </li>
          </ul>
        </div>

        <div className="mb-3 sm:mb-4">
          <Typography
            className="mb-1 text-sm font-medium text-card-foreground sm:mb-2"
            variant="h4"
          >
            {t(
              "wizard_provisional_offer:agreement.termsAndConditions.financialProtections.title"
            )}
          </Typography>
          <Typography
            className="mb-1 text-xs text-muted-foreground sm:mb-2 sm:text-sm"
            variant="body"
          >
            {t(
              "wizard_provisional_offer:agreement.termsAndConditions.financialProtections.intro"
            )}
          </Typography>
          <ul className="list-disc space-y-1 pl-4 text-xs text-muted-foreground sm:pl-5 sm:text-sm">
            <li>
              <strong>
                {t(
                  "wizard_provisional_offer:agreement.termsAndConditions.financialProtections.guaranteedPayments"
                )}
              </strong>
            </li>
            <li>
              <strong>
                {t(
                  "wizard_provisional_offer:agreement.termsAndConditions.financialProtections.paymentProtection"
                )}
              </strong>
            </li>
            <li>
              <strong>
                {t(
                  "wizard_provisional_offer:agreement.termsAndConditions.financialProtections.defaultProtection"
                )}
              </strong>
            </li>
          </ul>
        </div>
      </div>

      {/* Financial Illustration */}
      <div className="mb-4 rounded-lg border border-border bg-card p-3 sm:mb-6 sm:p-6">
        <Typography
          className="mb-2 text-base font-semibold text-card-foreground sm:mb-3 sm:text-lg"
          variant="h4"
        >
          {t("wizard_provisional_offer:agreement.financialIllustration.title")}
        </Typography>
        <Typography
          className="mb-2 text-xs text-muted-foreground sm:mb-3 sm:text-sm"
          variant="body"
        >
          {t("wizard_provisional_offer:agreement.financialIllustration.intro")}
        </Typography>

        <table className="w-full border-collapse">
          {/* Financial Benefit Table Header */}
          <thead>
            <tr className="bg-muted">
              <th className="px-2 py-1.5 text-left text-xs font-medium text-card-foreground sm:px-3 sm:py-2 sm:text-sm">
                {t(
                  "wizard_provisional_offer:agreement.financialIllustration.benefitComponentHeader"
                )}
              </th>
              <th className="px-2 py-1.5 text-right text-xs font-medium text-card-foreground sm:px-3 sm:py-2 sm:text-sm">
                {t(
                  "wizard_provisional_offer:agreement.financialIllustration.amountHeader"
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-2 py-1.5 text-xs text-muted-foreground sm:px-3 sm:py-2 sm:text-sm">
                {t(
                  "wizard_provisional_offer:agreement.financialIllustration.lumpSumRow"
                )}
              </td>
              <td className="px-2 py-1.5 text-right text-xs text-muted-foreground sm:px-3 sm:py-2 sm:text-sm">
                £{roundedLumpSum.toLocaleString()}
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-2 py-1.5 text-xs text-muted-foreground sm:px-3 sm:py-2 sm:text-sm">
                {t(
                  "wizard_provisional_offer:agreement.financialIllustration.annuityPaymentsRow"
                )}{" "}
                (over {offerDocument?.contractDuration || "20"} years)
              </td>
              <td className="px-2 py-1.5 text-right text-xs text-muted-foreground sm:px-3 sm:py-2 sm:text-sm">
                £{totalMonthlyPayments.toLocaleString()}
              </td>
            </tr>
            <tr className="border-b border-border bg-muted">
              <td className="px-2 py-1.5 text-xs font-medium text-card-foreground sm:px-3 sm:py-2 sm:text-sm">
                {t(
                  "wizard_provisional_offer:agreement.financialIllustration.totalBenefitRow"
                )}
              </td>
              <td className="px-2 py-1.5 text-right text-xs font-medium text-card-foreground sm:px-3 sm:py-2 sm:text-sm">
                £{totalBenefit.toLocaleString()}
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-2 py-1.5 text-xs text-muted-foreground sm:px-3 sm:py-2 sm:text-sm">
                {t(
                  "wizard_provisional_offer:agreement.financialIllustration.marketValueRow"
                )}
              </td>
              <td className="px-2 py-1.5 text-right text-xs text-muted-foreground sm:px-3 sm:py-2 sm:text-sm">
                {offerDocument?.confirmedValue || "£1,000,000.00"}
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-2 py-1.5 text-xs text-muted-foreground sm:px-3 sm:py-2 sm:text-sm">
                {t(
                  "wizard_provisional_offer:agreement.financialIllustration.netBenefitPercentageRow"
                )}
              </td>
              <td className="px-2 py-1.5 text-right text-xs text-muted-foreground sm:px-3 sm:py-2 sm:text-sm">
                {Math.round(netBenefitPercentage)}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Agreement in Principle */}
      <div className="mb-4 rounded-lg border border-border bg-card p-3 sm:mb-8 sm:p-6">
        <Typography
          className="mb-3 text-base font-medium text-card-foreground sm:mb-4 sm:text-lg"
          variant="h4"
        >
          {t("wizard_provisional_offer:agreement.agreementInPrinciple.title")}
        </Typography>

        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-card-foreground sm:mb-2 sm:text-sm">
              {t(
                "wizard_provisional_offer:agreement.agreementInPrinciple.fullNameLabel"
              )}
            </label>
            <input
              className="mt-1 block w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs text-card-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary sm:px-3 sm:py-2 sm:text-sm"
              id="signature"
              type="text"
              value={fullName}
              placeholder={t(
                "wizard_provisional_offer:agreement.agreementInPrinciple.fullNamePlaceholder"
              )}
              onChange={onFullNameChange}
            />
          </div>

          <div className="flex items-start">
            <div className="flex h-5 items-center">
              <input
                checked={agreementChecked}
                className="size-3 rounded border-border text-primary focus:ring-primary sm:size-4"
                id="agreement-checkbox"
                type="checkbox"
                onChange={onAgreementCheckedChange}
              />
            </div>
            <div className="ml-2 sm:ml-3">
              <label className="text-xs text-muted-foreground sm:text-sm">
                {t(
                  "wizard_provisional_offer:agreement.agreementInPrinciple.checkboxLabel"
                )}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
