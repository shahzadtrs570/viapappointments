import { z } from "zod"

export const propertyIdInput = z.object({
  propertyId: z.string(),
})

export const propertiesPaginationInput = z.object({
  page: z.number().min(1),
  limit: z.number().min(1),
})

export const searchPropertiesInput = z.object({
  query: z.string(),
})
