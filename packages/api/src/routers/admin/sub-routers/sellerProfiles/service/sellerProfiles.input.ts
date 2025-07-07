import { z } from "zod"

export const sellerProfilesListInput = z.object({
  limit: z.number().optional(),
})
