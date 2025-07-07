import type {
  createOfferInput,
  getOffersByPropertyIdInput,
} from "./offers.input"
import type { UserSession } from "@package/auth/types"
import type { z } from "zod"

export type GetOffersByPropertyIdInput = z.infer<
  typeof getOffersByPropertyIdInput
>
export type CreateOfferInput = z.infer<typeof createOfferInput>

export type GetOffersByPropertyIdArgs = {
  input: GetOffersByPropertyIdInput
}

export type CreateOfferArgs = {
  input: CreateOfferInput
  session: UserSession
}
