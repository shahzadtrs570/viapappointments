import { z } from "zod"

export const sellerSchema = z.object({
  id: z.string(),
  userId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  dateOfBirth: z.date(),
  generalHealth: z.string(),
  financialPriority: z.string(),
  willStayInProperty: z.boolean(),
  ownershipPercentage: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const propertyAddressSchema = z.object({
  id: z.string(),
  propertyId: z.string(),
  streetLine1: z.string(),
  streetLine2: z.string().nullable(),
  city: z.string(),
  state: z.string().nullable(),
  postalCode: z.string(),
  country: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  addressData: z.any().nullable(),
})

// Schema for review and recommendations
export const reviewAndReccommendations = z.object({
  checklist: z.object({
    carePlans: z.boolean(),
    financialAdvisor: z.boolean(),
    existingMortgages: z.boolean(),
    financialSituation: z.boolean(),
  }),
  considerations: z.object({
    benefits: z.boolean(),
    mortgage: z.boolean(),
    ownership: z.boolean(),
  }),
})

export const valuationSchema = z.object({
  id: z.string(),
  marketValue: z.number(),
  occupiedValue: z.number(),
  status: z.string(),
  notes: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  valuer: z.object({
    id: z.string(),
    firmName: z.string(),
    licenseNumber: z.string(),
  }),
})

export const offerSchema = z.object({
  id: z.string(),
  referenceNumber: z.string().nullable(),
  initialPaymentAmount: z.number(),
  monthlyPaymentAmount: z.number(),
  indexationRate: z.number(),
  status: z.string(),
  agreementType: z.string(),
  offerData: z.any().nullable(), // JSON data
  createdAt: z.date(),
  updatedAt: z.date(),
  expirationDate: z.date().nullable(),
  isProvisional: z.boolean(),
  responseId: z.string().nullable(),
  sellerProfile: z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  }),
})

export const propertyDocumentSchema = z.object({
  id: z.string(),
  documentType: z.string(),
  filename: z.string(),
  fileUrl: z.string(),
  verified: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  uploadedBy: z.object({
    id: z.string(),
    email: z.string().nullable(),
    name: z.string().nullable(),
  }),
})

// Main transformed property schema
export const transformedPropertySchema = z.object({
  id: z.string(),
  propertyType: z.string(),
  bedroomCount: z.number(),
  bathroomCount: z.number(),
  totalAreaSqM: z.number(),
  condition: z.string(),
  estimatedValue: z.number(),
  confirmedValue: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  address: propertyAddressSchema.nullable(),
  sellers: z.array(sellerSchema),
  documents: z.array(propertyDocumentSchema),
  reviewAndReccommendations: z.array(reviewAndReccommendations).optional(),
  valuations: z.array(valuationSchema),
  offers: z.array(offerSchema),
})

// Complete property details response
export const propertyDetailsResponseSchema = transformedPropertySchema

export type PropertyDetails = z.infer<typeof propertyDetailsResponseSchema>
