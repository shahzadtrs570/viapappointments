/*eslint-disable*/

import type { UseFormReturn } from "react-hook-form"
import type { SellerInfoData } from "./FormValidation"
import { OwnerTypeSelection } from "./OwnerTypeSelection"
import { NumberOfOwnersSelect } from "./NumberOfOwnersSelect"

interface OwnershipSectionProps {
  form: UseFormReturn<SellerInfoData>
  ownerType: "single" | "couple" | "multiple"
  numberOfMultipleOwners: number
  onOwnerTypeChange: (value: "single" | "couple" | "multiple") => void
  onNumberOfOwnersChange: (value: string) => void
  setStoredOwnersCount: (count: number) => void
  setNumberOfMultipleOwners: (count: number) => void
}

export function OwnershipSection({
  form,
  ownerType,
  numberOfMultipleOwners,
  onOwnerTypeChange,
  onNumberOfOwnersChange,
  setStoredOwnersCount,
  setNumberOfMultipleOwners,
}: OwnershipSectionProps) {
  return (
    <>
      <OwnerTypeSelection
        form={form}
        ownerType={ownerType}
        onOwnerTypeChange={onOwnerTypeChange}
      />

      {ownerType === "multiple" && (
        <NumberOfOwnersSelect
          form={form}
          numberOfMultipleOwners={numberOfMultipleOwners}
          onNumberOfOwnersChange={onNumberOfOwnersChange}
          setStoredOwnersCount={setStoredOwnersCount}
          setNumberOfMultipleOwners={setNumberOfMultipleOwners}
        />
      )}
    </>
  )
}
