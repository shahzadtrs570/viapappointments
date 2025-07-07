import type { sellerProfilesListInput } from "./sellerProfiles.input"
import type { z } from "zod"

export type SellerProfilesListInput = z.infer<typeof sellerProfilesListInput>

export type GetSellerProfilesArgs = {
  input: SellerProfilesListInput
}
