import type {
  propertiesPaginationInput,
  propertyIdInput,
  searchPropertiesInput,
} from "./properties.input"
import type { UserSession } from "@package/auth/types"
import type { z } from "zod"

export type GetPropertyByIdInput = z.infer<typeof propertyIdInput>
export type PropertiesPaginationInput = z.infer<
  typeof propertiesPaginationInput
>
export type SearchPropertiesInput = z.infer<typeof searchPropertiesInput>

export type GetPropertyByIdArgs = {
  input: GetPropertyByIdInput
}

export type GetPaginatedPropertiesArgs = {
  input: PropertiesPaginationInput
}

export type SearchPropertiesArgs = {
  input: SearchPropertiesInput
}

export interface DeletePropertyByIdArgs {
  input: {
    propertyId: string
  }
  session: UserSession
}

export interface RequestProvisionalOfferArgs {
  input: {
    propertyId: string
  }
  session: UserSession
}
