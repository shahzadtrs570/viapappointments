import { combineReducers } from "@reduxjs/toolkit"

import { completionReducer } from "./completion/slice"
import { offerReducer } from "./offer/slice"
import { propertyDetailsReducer } from "./propertyDetails"
import { reviewReducer } from "./review/slice"
import { sellerInformationReducer } from "./sellerInformation"

// Combine all property-related reducers
export const propertyReducer = combineReducers({
  sellerInformation: sellerInformationReducer,
  propertyDetails: propertyDetailsReducer,
  completion: completionReducer,
  review: reviewReducer,
  offer: offerReducer,
  // Add other property-related reducers here as we create them
})

// Types
export interface PropertyState {
  sellerInformation: ReturnType<typeof sellerInformationReducer>
  propertyDetails: ReturnType<typeof propertyDetailsReducer>
  completion: ReturnType<typeof completionReducer>
  review: ReturnType<typeof reviewReducer>
  offer: ReturnType<typeof offerReducer>
  // Add other property-related state types here as we create them
}

// Re-export everything from nested slices with namespacing
export * as completion from "./completion"
export * as review from "./review/slice"
export * as offer from "./offer/slice"
export * as propertyDetails from "./propertyDetails"
export * as sellerInformation from "./sellerInformation"
