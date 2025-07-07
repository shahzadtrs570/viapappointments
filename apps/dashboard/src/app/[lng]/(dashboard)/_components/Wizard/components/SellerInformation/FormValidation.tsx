/*eslint-disable*/

import { z } from "zod"
import type { TFunction } from "i18next"
import type { Owner } from "@/app/store/property/sellerInformation"
import { isOver55, isUnder75 } from "./FormHelpers"

// Define a specific TFunction type for the wizard namespaces
export type WizardTFunction = TFunction<
  ["wizard_seller_information", "wizard_common"]
>

export const getOwnerSchema = (t: WizardTFunction) =>
  z.object({
    firstName: z
      .string()
      .min(
        1,
        t(
          "wizard_seller_information:ownerDetailsSection.form.firstName.validationRequired"
        )
      ),
    lastName: z
      .string()
      .min(
        1,
        t(
          "wizard_seller_information:ownerDetailsSection.form.lastName.validationRequired"
        )
      ),
    email: z
      .string()
      .min(
        1,
        t(
          "wizard_seller_information:ownerDetailsSection.form.email.validationRequired"
        )
      )
      .email(
        t(
          "wizard_seller_information:ownerDetailsSection.form.email.validationInvalid"
        )
      ),
    dateOfBirth: z
      .string()
      .min(
        1,
        t(
          "wizard_seller_information:ownerDetailsSection.form.dateOfBirth.validationRequired"
        )
      )
      .refine((dob) => (dob ? isOver55(dob) : true), {
        message: "Owner must be at least 55 years old",
      }),
    phone: z.string().optional(),
    address: z.string().optional(),
    postcode: z.string().optional(),
    town: z.string().optional(),
    county: z.string().optional(),
    useExistingAddress: z.boolean().default(false),
  })

export const getSellerInfoSchema = (t: WizardTFunction) =>
  z.object({
    ownerType: z.enum(["single", "couple", "multiple"], {
      required_error: t(
        "wizard_seller_information:ownerDetailsSection.validation.selectOwnerType"
      ),
    }),
    numberOfOwners: z.number().min(1).max(5).optional(),
    owners: z
      .array(getOwnerSchema(t))
      .min(
        1,
        t(
          "wizard_seller_information:ownerDetailsSection.validation.atLeastOneOwner"
        )
      )
      .refine((owners) => owners.length > 0, {
        message: t(
          "wizard_seller_information:ownerDetailsSection.validation.provideOwnerInfo"
        ),
      })
      .superRefine((owners, ctx) => {
        // Skip validation if any DOB is missing
        if (owners.some((owner) => !owner.dateOfBirth)) {
          return // Return early - basic field validation will catch this
        }

        // Check if all owners are over 75
        const allOver75 = owners.every(
          (owner) => owner.dateOfBirth && !isUnder75(owner.dateOfBirth)
        )

        // If all owners are over 75, add error to each DOB field
        if (allOver75) {
          owners.forEach((_, index) => {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "At least one owner must be under 75 years old",
              path: [index, "dateOfBirth"], // This adds error to specific DOB field
            })
          })
        }
      }),
  })

export type SellerInfoData = z.infer<ReturnType<typeof getSellerInfoSchema>>

export interface PreviousStepAddress {
  address: string
  postcode: string
  town: string
  county: string
}

export interface SellerInformationProps {
  onSubmit: (data: SellerInfoData) => void
  onBack: () => void
  previousStepAddress?: PreviousStepAddress
  defaultValues?: SellerInfoData & { id?: string }
  readOnly?: boolean
  mode?: "edit" | "create"
}

// Add type for form owner
export interface FormOwner extends Omit<Owner, "useExistingAddress"> {
  useExistingAddress: boolean
}
