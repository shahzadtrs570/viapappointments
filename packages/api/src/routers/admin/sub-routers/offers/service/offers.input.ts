import { z } from "zod"

export const getOffersByPropertyIdInput = z.object({
  propertyId: z.string(),
})

export const createOfferInput = z.object({
  propertyId: z.string(),
  sellerProfileId: z.string(),
  initialPaymentAmount: z.number().min(1),
  monthlyPaymentAmount: z.number().min(0),
  indexationRate: z.number().min(0),
  agreementType: z.enum(["STANDARD", "CUSTOM"]),
  occupancyRight: z.enum(["FULL", "PARTIAL", "NONE"]),
})
